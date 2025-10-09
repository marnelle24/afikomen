import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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

    const params = await context.params
    const verse = await prisma.verse.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    })

    if (!verse) {
      return NextResponse.json(
        { error: 'Verse not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      verse
    })
  } catch (error) {
    console.error('Verse fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch verse' },
      { status: 500 }
    )
  }
}

