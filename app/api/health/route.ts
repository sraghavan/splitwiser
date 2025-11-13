import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const startTime = Date.now()

    // Simple query to check if database is accessible
    await prisma.$queryRaw`SELECT 1`

    const responseTime = Date.now() - startTime

    // Optionally get some basic stats
    const userCount = await prisma.user.count()
    const tripCount = await prisma.trip.count()

    return NextResponse.json({
      status: 'healthy',
      database: {
        connected: true,
        responseTime,
        stats: {
          users: userCount,
          trips: tripCount
        }
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Health check failed:', error)

    return NextResponse.json({
      status: 'unhealthy',
      database: {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      timestamp: new Date().toISOString()
    }, { status: 503 })
  }
}