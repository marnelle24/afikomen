import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { verseId, personalReflection, isPublic } = body

    if (!verseId || !personalReflection) {
      return NextResponse.json(
        { error: 'Verse ID and personal reflection are required' },
        { status: 400 }
      )
    }

    // Verify the verse belongs to the user
    const verse = await prisma.verse.findFirst({
      where: {
        id: verseId,
        userId: user.id
      }
    })

    if (!verse) {
      return NextResponse.json(
        { error: 'Verse not found or does not belong to you' },
        { status: 404 }
      )
    }

    // Create the journal entry
    const journal = await prisma.journal.create({
      data: {
        userId: user.id,
        verseId: verseId,
        personalReflection: personalReflection,
        isPublic: isPublic || false
      }
    })

    return NextResponse.json({
      success: true,
      journal: {
        id: journal.id,
        personalReflection: journal.personalReflection,
        isPublic: journal.isPublic,
        createdAt: journal.createdAt
      }
    })

  } catch (error) {
    console.error('Journal creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create journal entry' },
      { status: 500 }
    )
  }
}

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

    const { searchParams } = new URL(request.url)
    const verseId = searchParams.get('verseId')

    const whereClause: { userId: string; verseId?: string } = {
      userId: user.id
    }

    // If verseId is provided, filter by that verse
    if (verseId) {
      whereClause.verseId = verseId
    }

    const journals = await prisma.journal.findMany({
      where: whereClause,
      include: {
        verse: {
          select: {
            id: true,
            reference: true,
            version: true,
            verseContent: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      journals
    })

  } catch (error) {
    console.error('Journal fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch journals' },
      { status: 500 }
    )
  }
}
