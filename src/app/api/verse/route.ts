import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'
import { fetchBibleVerse } from '@/lib/bible-api'
import { generateVerseInsight } from '@/lib/ai'
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

    const { reference, version } = await request.json()

    if (!reference || !version) {
      return NextResponse.json(
        { error: 'Reference and version are required' },
        { status: 400 }
      )
    }

    // Fetch Bible verse using OpenAI
    const verseData = await fetchBibleVerse(reference, version)
    
    // Generate AI insights using the same verse text
    const insight = await generateVerseInsight(verseData.text, verseData.reference, version)

    // Save to database (reference without version, version stored separately)
    const savedVerse = await prisma.verse.create({
      data: {
        reference: verseData.reference, // Clean reference (e.g., "John 3:16")
        version,
        verseContent: insight.verse_content,
        context: insight.context,
        modernReflection: insight.modern_reflection,
        weeklyActionPlan: insight.weekly_action_plan,
        shortPrayer: insight.short_prayer,
        userId: user.id
      }
    })

    // Return formatted reference for display (e.g., "John 3:16 (NIV)")
    const displayReference = `${verseData.reference} (${version})`

    return NextResponse.json({
      success: true,
      data: {
        id: savedVerse.id,
        reference: displayReference, // Display with version
        version,
        insight
      }
    })
  } catch (error) {
    console.error('Verse processing error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to process verse'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
