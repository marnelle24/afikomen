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

    const verses = await prisma.verse.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        reference: true,
        version: true,
        verseContent: true,
        context: true,
        modernReflection: true,
        weeklyActionPlan: true,
        shortPrayer: true,
        createdAt: true,
        tokenUsed: true
      }
    })

    return NextResponse.json({ verses })
  } catch (error) {
    console.error('Error fetching verses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch verses' },
      { status: 500 }
    )
  }
}
