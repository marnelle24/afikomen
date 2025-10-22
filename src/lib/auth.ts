import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from './db'

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required')
}

export interface JWTPayload {
  userId: string
  email: string
}

interface DecodedJWT {
  userId: string
  email: string
  iat?: number
  exp?: number
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET!, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as DecodedJWT
    return {
      userId: decoded.userId,
      email: decoded.email
    }
  } catch {
    return null
  }
}

export async function getUserFromToken(token: string) {
  const payload = verifyToken(token)
  if (!payload) return null
  
  return prisma.user.findUnique({
    where: { id: payload.userId },
    select: { 
      id: true, 
      email: true, 
      name: true,
      tokenBalance: true,
      tokensUsed: true,
      lastTokenReset: true
    }
  })
}

// Token management functions
export async function checkUserTokens(userId: string): Promise<{ hasTokens: boolean; remainingTokens: number; tokensUsed: number }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { tokenBalance: true, tokensUsed: true, lastTokenReset: true }
  })

  if (!user) {
    throw new Error('User not found')
  }

  // Check if we need to reset tokens (monthly reset)
  const now = new Date()
  const lastReset = new Date(user.lastTokenReset)
  const shouldReset = now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()

  if (shouldReset) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        tokensUsed: 0,
        lastTokenReset: now
      }
    })
    return {
      hasTokens: true,
      remainingTokens: user.tokenBalance,
      tokensUsed: 0
    }
  }

  const remainingTokens = user.tokenBalance - user.tokensUsed
  return {
    hasTokens: remainingTokens > 0,
    remainingTokens: Math.max(0, remainingTokens),
    tokensUsed: user.tokensUsed
  }
}

export async function deductTokens(userId: string, tokensToDeduct: number): Promise<{ success: boolean; remainingTokens: number; tokensUsed: number }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { tokenBalance: true, tokensUsed: true }
  })

  if (!user) {
    throw new Error('User not found')
  }

  const newTokensUsed = user.tokensUsed + tokensToDeduct
  
  if (newTokensUsed > user.tokenBalance) {
    return {
      success: false,
      remainingTokens: Math.max(0, user.tokenBalance - user.tokensUsed),
      tokensUsed: user.tokensUsed
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { tokensUsed: newTokensUsed },
    select: { tokenBalance: true, tokensUsed: true }
  })

  return {
    success: true,
    remainingTokens: updatedUser.tokenBalance - updatedUser.tokensUsed,
    tokensUsed: updatedUser.tokensUsed
  }
}
