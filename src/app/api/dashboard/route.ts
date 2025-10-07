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

    // Get token usage information from user object (should include token fields)
    const userWithTokens = user as typeof user & { tokensUsed: number; tokenBalance: number }
    const tokenUsage = {
      tokensUsed: userWithTokens.tokensUsed || 0,
      tokenBalance: userWithTokens.tokenBalance || 1000,
      remainingTokens: (userWithTokens.tokenBalance || 1000) - (userWithTokens.tokensUsed || 0)
    }

    // Get all verses to determine favorite version and total tokens used
    const allVerses = await prisma.verse.findMany({
      where: { userId: user.id }
    })

    // Calculate total tokens used across all verses
    const totalTokensUsedInVerses = allVerses.reduce((total, verse) => total + ((verse as any).tokenUsed || 0), 0)

    // Calculate favorite version
    const versionCounts = allVerses.reduce((acc, verse) => {
      acc[verse.version] = (acc[verse.version] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const favoriteVersion = Object.entries(versionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'

    return NextResponse.json({
      totalVerses,
      versesThisWeek,
      tokenUsage: {
        ...tokenUsage,
        totalTokensUsedInVerses
      },
      favoriteVersion
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}

