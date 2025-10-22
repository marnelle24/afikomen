import { NextRequest, NextResponse } from 'next/server'
import { generalRateLimit, authRateLimit, verseRateLimit, dataRateLimit } from '@/lib/rate-limit'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip rate limiting for static files
  if (pathname.startsWith('/_next/') || 
      pathname.startsWith('/favicon.ico') ||
      pathname.startsWith('/public/')) {
    return NextResponse.next()
  }

  // Apply only ONE rate limit per request based on priority
  let rateLimitResult
  
  if (pathname.startsWith('/api/auth/')) {
    // Authentication endpoints - strictest limits
    rateLimitResult = await authRateLimit(request)
  } else if (pathname.startsWith('/api/verse') && !pathname.startsWith('/api/verses')) {
    // Verse processing endpoint - expensive AI operations
    rateLimitResult = await verseRateLimit(request)
  } else if (pathname.startsWith('/api/dashboard') || pathname.startsWith('/api/verses')) {
    // Data endpoints - temporarily disabled for debugging
    // rateLimitResult = await dataRateLimit(request)
  } else if (pathname.startsWith('/api/')) {
    // All other API endpoints - temporarily disabled for debugging
    // rateLimitResult = await generalRateLimit(request)
  }

  // Check if rate limit was exceeded
  if (rateLimitResult && !rateLimitResult.success) {
    return NextResponse.json(
      {
        error: 'Too many requests',
        message: 'Please slow down your requests',
        retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
      },
      {
        status: 429,
        headers: {
          'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
        }
      }
    )
  }

  // Add security headers
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // CORS headers for API routes
  if (pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }

  return response
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
