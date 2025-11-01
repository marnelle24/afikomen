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

    // Check limit first
    if (entry.count >= config.maxRequests) {
      return {
        success: false,
        limit: config.maxRequests,
        remaining: 0,
        resetTime: entry.resetTime
      }
    }

    // Increment counter before returning
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
  
  // In development, use a combination of headers to create a unique identifier
  // This prevents all requests from being grouped as 'unknown'
  // Note: In production, always use actual IP addresses from headers
  const userAgent = request.headers.get('user-agent') || 'unknown-agent'
  const acceptLanguage = request.headers.get('accept-language') || 'unknown-lang'
  
  // Create a consistent identifier from client headers (not URL)
  // This ensures rate limiting works per client, not per endpoint
  const identifier = `${userAgent.slice(0, 30)}-${acceptLanguage.slice(0, 10)}`
  
  return identifier
}

// Pre-configured rate limiters
export const authRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 50 // 50 auth requests per 15 minutes (generous for development and normal usage)
})

// Rate limiter for verse processing with longer window
export const verseProcessingRateLimit = createRateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  maxRequests: 20 // 20 verse requests per 5 minutes (prevents abuse while allowing normal usage)
})

export const generalRateLimit = createRateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 120 // 120 requests per minute (very generous)
})

// Special rate limiter for dashboard/data endpoints
export const dataRateLimit = createRateLimit({
  windowMs: 10 * 1000, // 10 seconds
  maxRequests: 50 // 50 data requests per 10 seconds (very generous for dashboard)
})
