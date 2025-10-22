# Verse Form 429 Error Fix

## Problem
The verse form was getting 429 errors when submitting to `/api/verse` (POST) because the rate limit was too restrictive at 3 requests per minute.

## Root Cause
The verse processing rate limit was too strict for legitimate usage:
- **Before**: 3 requests per minute (too restrictive)
- **Issue**: Users couldn't process multiple verses in a reasonable time

## Solution Applied

### 1. **More Reasonable Rate Limits**
- **Short-term**: 10 requests per minute (immediate usage)
- **Long-term**: 20 requests per 5 minutes (prevents abuse while allowing normal usage)

### 2. **Updated Rate Limiting Strategy**
```typescript
// New rate limiter for verse processing
export const verseProcessingRateLimit = createRateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  maxRequests: 20 // 20 verse requests per 5 minutes
})
```

### 3. **Middleware Update**
- Uses the more reasonable `verseProcessingRateLimit` for `/api/verse` (POST)
- Maintains protection against abuse
- Allows legitimate usage patterns

## Current Rate Limits

| Endpoint | Rate Limit | Purpose |
|----------|------------|---------|
| `/api/verse` (POST) | 20 requests per 5 minutes | Allow normal usage, prevent abuse |
| `/api/verse/[id]` (GET) | 50 requests per 10 seconds | Allow normal verse viewing |
| `/api/verses` (GET) | 50 requests per 10 seconds | Allow normal verse listing |
| `/api/dashboard` (GET) | 50 requests per 10 seconds | Allow normal dashboard usage |
| `/api/auth/*` | 5 requests per 15 minutes | Prevent brute force attacks |

## Benefits
- ✅ Users can process multiple verses normally
- ✅ Still protects against DDoS/abuse
- ✅ Reasonable limits for legitimate usage
- ✅ Maintains security for expensive AI operations

## Testing
- Verse form should now work without 429 errors
- Users can process multiple verses in a session
- Rate limiting still prevents abuse
- AI operations remain protected
