import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { PrismaClient } from '@prisma/client'

async function testConnection(connectionUrl?: string) {
  const startTime = Date.now()

  let testPrisma = prisma

  // If custom connection URL provided, create new Prisma instance
  if (connectionUrl) {
    testPrisma = new PrismaClient({
      datasources: {
        db: {
          url: connectionUrl
        }
      }
    })
  }

  try {
    // Simple query to check if database is accessible
    await testPrisma.$queryRaw`SELECT 1`

    const responseTime = Date.now() - startTime

    // Get basic stats if using default connection
    let stats = { users: 0, trips: 0 }
    if (!connectionUrl) {
      stats.users = await testPrisma.user.count()
      stats.trips = await testPrisma.trip.count()
    }

    return {
      connected: true,
      responseTime,
      stats
    }
  } finally {
    // Cleanup custom Prisma instance
    if (connectionUrl && testPrisma !== prisma) {
      await testPrisma.$disconnect()
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const result = await testConnection()

    return NextResponse.json({
      status: 'healthy',
      database: result,
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { connectionUrl } = body

    if (!connectionUrl) {
      return NextResponse.json({
        error: 'connectionUrl is required'
      }, { status: 400 })
    }

    const result = await testConnection(connectionUrl)

    return NextResponse.json({
      status: 'healthy',
      database: result,
      timestamp: new Date().toISOString(),
      message: 'Custom connection successful'
    })

  } catch (error) {
    console.error('Custom connection test failed:', error)

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