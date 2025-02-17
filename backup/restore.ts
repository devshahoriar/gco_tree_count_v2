/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '../prisma/db';
import * as fs from 'fs';
import * as path from 'path';

function getLatestBackupDir(baseDir: string): string {
    if (!fs.existsSync(baseDir)) {
        throw new Error(`Base backup directory not found: ${baseDir}`);
    }

    const directories = fs.readdirSync(baseDir)
        .map(name => path.join(baseDir, name))
        .filter(path => fs.statSync(path).isDirectory())
        .sort((a, b) => fs.statSync(b).mtime.getTime() - fs.statSync(a).mtime.getTime());

    if (directories.length === 0) {
        throw new Error('No backup directories found');
    }

    return directories[0];
}

async function restoreBackup(backupDir: string) {
    try {
        const fullBackupDir = path.resolve(backupDir);
        const targetDir = fs.statSync(fullBackupDir).isDirectory() ? 
            fullBackupDir : 
            getLatestBackupDir(fullBackupDir);

        console.log(`Using backup directory: ${targetDir}`);

        // Order matters due to foreign key relationships
        const restoreOrder = [
            'user',
            'division',
            'zilla',
            'upazilla',
            'union',
            'postOffice',
            'treeType',
            'file',
            'ot4oc',
            'treeInvolved',
            'tree',
            'session',
            'account',
            'verification'
        ];

        for (const tableName of restoreOrder) {
            const filePath = path.join(targetDir, `${tableName}.json`);
            if (!fs.existsSync(filePath)) {
                console.warn(`Skipping ${tableName}: backup file not found`);
                continue;
            }

            console.log(`Restoring ${tableName}...`);
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

            if (Array.isArray(data) && data.length > 0) {
                // Clear existing data
                await (prisma as any)[tableName].deleteMany({});

                // Restore data in batches of 100
                const batchSize = 100;
                for (let i = 0; i < data.length; i += batchSize) {
                    const batch = data.slice(i, i + batchSize);
                    await (prisma as any)[tableName].createMany({
                        data: batch,
                        skipDuplicates: true
                    });
                }

                console.log(`✓ Restored ${data.length} records to ${tableName}`);
            }
        }

        console.log('Restore completed successfully!');
    } catch (error) {
        console.error('Restore failed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Validate and process command line arguments
const args = process.argv.slice(2);
if (args.length !== 1) {
    console.error('Usage: bun restore.ts <backup-directory>');
    console.error('Example: bun restore.ts ./backup/backups');
    process.exit(1);
}

restoreBackup(args[0]).catch((error) => {
    console.error('Restore script failed:', error);
    process.exit(1);
});
