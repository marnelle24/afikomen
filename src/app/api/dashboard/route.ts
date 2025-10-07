import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Get total verses
    const totalVerses = await prisma.verse.count({
      where: { userId: user.id }
    })

    // Get verses from this week
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const versesThisWeek = await prisma.verse.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: weekAgo
        }
      }
    })

    // Get verses from this month
    const monthAgo = new Date()
    monthAgo.setMonth(monthAgo.getMonth() - 1)
    const versesThisMonth = await prisma.verse.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: monthAgo
        }
      }
    })

    // Get all verses to determine favorite version
    const allVerses = await prisma.verse.findMany({
      where: { userId: user.id },
      select: { version: true }
    })

    // Calculate favorite version
    const versionCounts = allVerses.reduce((acc, verse) => {
      acc[verse.version] = (acc[verse.version] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const favoriteVersion = Object.entries(versionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'

    // Get 5 most recent verses
    const recentVerses = await prisma.verse.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        reference: true,
        version: true,
        verseContent: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      totalVerses,
      versesThisWeek,
      versesThisMonth,
      favoriteVersion,
      recentVerses
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}

