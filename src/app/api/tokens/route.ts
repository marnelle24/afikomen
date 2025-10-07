import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken, checkUserTokens } from '@/lib/auth'

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

    // Get current token status
    const tokenStatus = await checkUserTokens(user.id)

    return NextResponse.json({
      success: true,
      data: {
        tokenBalance: user.tokenBalance,
        tokensUsed: tokenStatus.tokensUsed,
        remainingTokens: tokenStatus.remainingTokens,
        lastTokenReset: user.lastTokenReset,
        hasTokens: tokenStatus.hasTokens
      }
    })
  } catch (error) {
    console.error('Token balance error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to get token balance'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
