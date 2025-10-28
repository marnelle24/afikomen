import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken, checkUserTokens, deductTokens } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

// Schema for AI-generated verse data
const aiVerseSchema = z.object({
  reference: z.string().min(1, 'Reference is required'),
  version: z.string().min(1, 'Version is required'),
  verseContent: z.string().min(1, 'Verse content is required'),
  context: z.string().min(1, 'Context is required'),
  modernReflection: z.string().min(1, 'Modern reflection is required'),
  weeklyActionPlan: z.string().min(1, 'Weekly action plan is required'),
  shortPrayer: z.string().min(1, 'Short prayer is required'),
  tokenUsed: z.number().min(0, 'Token used must be non-negative')
})

export async function POST(request: NextRequest) {
  try {
    // Validate request size
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > 1024 * 100) { // 100KB max
      return NextResponse.json(
        { error: 'Request too large' },
        { status: 413 }
      )
    }

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

    // Validate and sanitize input
    const body = await request.json()
    const validationResult = aiVerseSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid input',
          details: validationResult.error.errors
        },
        { status: 400 }
      )
    }

    const { reference, version, verseContent, context, modernReflection, weeklyActionPlan, shortPrayer, tokenUsed } = validationResult.data

    // Check if user has sufficient tokens
    const tokenStatus = await checkUserTokens(user.id)
    if (!tokenStatus.hasTokens) {
      return NextResponse.json(
        { 
          error: 'Insufficient tokens', 
          message: `You have used all your tokens for this month. You have ${tokenStatus.remainingTokens} tokens remaining.`,
          tokenInfo: {
            remainingTokens: tokenStatus.remainingTokens,
            tokensUsed: tokenStatus.tokensUsed
          }
        },
        { status: 402 } // Payment Required
      )
    }

    // Create the verse in the database
    const verse = await prisma.verse.create({
      data: {
        reference,
        version,
        verseContent,
        context,
        modernReflection,
        weeklyActionPlan,
        shortPrayer,
        tokenUsed,
        userId: user.id
      }
    })

    // Deduct tokens from user's balance
    await deductTokens(user.id, tokenUsed)

    return NextResponse.json({
      success: true,
      verse: {
        id: verse.id,
        reference: verse.reference,
        version: verse.version,
        createdAt: verse.createdAt
      }
    })

  } catch (error) {
    console.error('Error saving AI verse:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
