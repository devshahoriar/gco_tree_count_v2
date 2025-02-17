import prisma from '../prisma/db';
import * as fs from 'fs';
import * as path from 'path';

async function createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.resolve(__dirname, 'backups', timestamp);
    
    console.log(`Creating backup in: ${backupDir}`);

    // Ensure backups directory exists
    fs.mkdirSync(path.resolve(__dirname, 'backups'), { recursive: true });
    // Create timestamped backup directory
    fs.mkdirSync(backupDir, { recursive: true });

    try {
        // Backup all tables
        const tables = [
            { name: 'user', query: prisma.user.findMany() },
            { name: 'session', query: prisma.session.findMany() },
            { name: 'account', query: prisma.account.findMany() },
            { name: 'verification', query: prisma.verification.findMany() },
            { name: 'division', query: prisma.division.findMany() },
            { name: 'zilla', query: prisma.zilla.findMany() },
            { name: 'upazilla', query: prisma.upazilla.findMany() },
            { name: 'union', query: prisma.union.findMany() },
            { name: 'postOffice', query: prisma.postOffice.findMany() },
            { name: 'treeType', query: prisma.treeType.findMany() },
            { name: 'file', query: prisma.file.findMany() },
            { name: 'ot4oc', query: prisma.ot4oc.findMany() },
            { name: 'treeInvolved', query: prisma.treeInvolved.findMany() },
            { name: 'tree', query: prisma.tree.findMany() }
        ];

        for (const table of tables) {
            console.log(`Backing up ${table.name}...`);
            const data = await table.query;
            fs.writeFileSync(
                path.join(backupDir, `${table.name}.json`),
                JSON.stringify(data, null, 2)
            );
        }

        console.log(`Backup completed successfully at ${backupDir}`);
    } catch (error) {
        console.error('Backup failed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Execute backup
createBackup().catch((error) => {
    console.error('Backup script failed:', error);
    process.exit(1);
});
