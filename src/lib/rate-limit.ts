import { NextRequest } from 'next/server'

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

// In-memory store (use Redis in production)
const store: RateLimitStore = {}

export function createRateLimit(config: RateLimitConfig) {
  return async (request: NextRequest, identifier?: string): Promise<{
    success: boolean
    limit: number
    remaining: number
    resetTime: number
  }> => {
    const key = identifier || getClientIP(request)
    const now = Date.now()

    // Clean expired entries
    Object.keys(store).forEach(k => {
      if (store[k].resetTime < now) {
        delete store[k]
      }
    })

    // Get or create entry
    if (!store[key]) {
      store[key] = {
        count: 0,
        resetTime: now + config.windowMs
      }
    }

    const entry = store[key]

    // Reset if window expired
    if (entry.resetTime < now) {
      entry.count = 0
      entry.resetTime = now + config.windowMs
    }

    // Check limit
    if (entry.count >= config.maxRequests) {
      return {
        success: false,
        limit: config.maxRequests,
        remaining: 0,
        resetTime: entry.resetTime
      }
    }

    // Increment counter
    entry.count++

    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - entry.count,
      resetTime: entry.resetTime
    }
  }
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}

// Pre-configured rate limiters
export const authRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5 // 5 login attempts per 15 minutes
})

export const verseRateLimit = createRateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 3 // 3 verse requests per minute
})

export const generalRateLimit = createRateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30 // 30 requests per minute
})
