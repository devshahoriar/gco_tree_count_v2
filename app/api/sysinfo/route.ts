import { NextResponse } from 'next/server'
import si from 'systeminformation'

export async function GET() {
  try {
    const [cpu, mem, os] = await Promise.all([si.cpu(), si.mem(), si.osInfo()])

    return NextResponse.json({
      cpu: {
        model: cpu.manufacturer + ' ' + cpu.brand,
        cores: cpu.cores,
        speed: cpu.speed,
      },
      memory: {
        total: mem.total,
        free: mem.free,
        used: mem.used,
      },
      os: {
        platform: os.platform,
        distro: os.distro,
        release: os.release,
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'error.message' }, { status: 500 })
  }
}
