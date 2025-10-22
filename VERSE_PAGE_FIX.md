# Verse Page 429 Error Fix

## Problem
The verse page was getting 429 errors when trying to access `/api/verse/[id]` because the middleware was incorrectly applying the strict verse processing rate limit (3 requests per minute) to this endpoint.

## Root Cause
The middleware logic was too broad:
```typescript
// WRONG - This caught ALL /api/verse/* endpoints
pathname.startsWith('/api/verse')
```

This meant that:
- `/api/verse` (POST - expensive AI processing) ✅ Should have strict limits
- `/api/verse/[id]` (GET - simple database lookup) ❌ Was getting strict limits

## Solution
Fixed the middleware to be more specific:

```typescript
// CORRECT - Only the main verse processing endpoint gets strict limits
if (pathname === '/api/verse') {
  // Verse processing endpoint - expensive AI operations
  rateLimitResult = await verseRateLimit(request)
} else if (pathname.startsWith('/api/dashboard') || 
           pathname.startsWith('/api/verses') || 
           pathname.startsWith('/api/verse/')) {
  // Data endpoints - generous limits for dashboard and verse lookups
  rateLimitResult = await dataRateLimit(request)
}
```

## Rate Limits Applied

| Endpoint | Rate Limit | Purpose |
|----------|------------|---------|
| `/api/verse` (POST) | 3 requests/minute | Protect expensive AI operations |
| `/api/verse/[id]` (GET) | 50 requests/10 seconds | Allow normal verse viewing |
| `/api/verses` (GET) | 50 requests/10 seconds | Allow normal verse listing |
| `/api/dashboard` (GET) | 50 requests/10 seconds | Allow normal dashboard usage |

## Additional Fixes
- Fixed Next.js config warnings
- Updated deprecated `experimental.serverComponentsExternalPackages` to `serverExternalPackages`
- Removed invalid `api` configuration

## Result
- Verse pages should now load without 429 errors
- AI operations remain protected from abuse
- Dashboard and verse viewing work normally
- Security is maintained
