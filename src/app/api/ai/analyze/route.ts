import { NextRequest, NextResponse } from 'next/server'
import { generateAIAnalysis } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reference, text, verses, translation } = body

    if (!reference || !text || !verses || !translation) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const analysis = await generateAIAnalysis({
      reference,
      text,
      verses,
      translation
    })

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Error in AI analysis API:', error)
    return NextResponse.json(
      { error: 'Failed to generate AI analysis' },
      { status: 500 }
    )
  }
}
