import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken, checkUserTokens, deductTokens } from '@/lib/auth'
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

    // Fetch Bible verse using OpenAI
    const verseData = await fetchBibleVerse(reference, version)
    
    // Generate AI insights using the same verse text
    const insight = await generateVerseInsight(verseData.text, verseData.reference, version)

    // Get actual token consumption from AI response
    const actualTokensUsed = insight.tokens_used

    // Check if user has sufficient tokens for the actual usage
    const finalTokenStatus = await checkUserTokens(user.id)
    if (finalTokenStatus.remainingTokens < actualTokensUsed) {
      return NextResponse.json(
        { 
          error: 'Insufficient tokens', 
          message: `This request requires ${actualTokensUsed} tokens, but you only have ${finalTokenStatus.remainingTokens} tokens remaining.`,
          tokenInfo: {
            remainingTokens: finalTokenStatus.remainingTokens,
            tokensUsed: finalTokenStatus.tokensUsed,
            requiredTokens: actualTokensUsed
          }
        },
        { status: 402 } // Payment Required
      )
    }

    // Save to database with actual token usage
    const savedVerse = await prisma.verse.create({
      data: {
        reference: verseData.reference, // Clean reference (e.g., "John 3:16")
        version,
        verseContent: insight.verse_content,
        context: insight.context,
        modernReflection: insight.modern_reflection,
        weeklyActionPlan: insight.weekly_action_plan,
        shortPrayer: insight.short_prayer,
        tokenUsed: actualTokensUsed, // Store actual token usage
        userId: user.id
      } as Parameters<typeof prisma.verse.create>[0]['data']
    })

    // Deduct actual tokens used after successful processing
    const tokenDeduction = await deductTokens(user.id, actualTokensUsed)
    
    if (!tokenDeduction.success) {
      // This shouldn't happen since we checked earlier, but handle gracefully
      console.error('Token deduction failed after successful processing')
    }

    // Return formatted reference for display (e.g., "John 3:16 (NIV)")
    const displayReference = `${verseData.reference} (${version})`

    return NextResponse.json({
      success: true,
      data: {
        id: savedVerse.id,
        reference: displayReference, // Display with version
        version,
        insight
      },
      tokenInfo: {
        tokensUsed: actualTokensUsed,
        remainingTokens: tokenDeduction.remainingTokens,
        totalTokensUsed: tokenDeduction.tokensUsed
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
