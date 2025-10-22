# Rate Limiting Fix for Dashboard 429 Error

## Problem
The dashboard was getting 429 (Too Many Requests) errors because multiple components were making API calls simultaneously:
- `/api/dashboard` - for stats
- `/api/verses` - for RecentVerses component  
- `/api/verses` - for VerseHistory component

## Solution Implemented

### 1. **Adjusted Rate Limits**
- **General API**: Increased from 30 to 60 requests per minute
- **Data endpoints** (`/api/dashboard`, `/api/verses`): 10 requests per 10 seconds
- **Verse processing**: Kept at 3 requests per minute (expensive AI operations)
- **Authentication**: Kept at 5 requests per 15 minutes

### 2. **API Client with Request Queuing**
- Created `src/lib/api-client.ts` with built-in request queuing
- 100ms delay between requests to prevent rapid-fire calls
- Automatic request serialization

### 3. **Updated Components**
- **Dashboard**: Uses `apiClient.get()` with delay
- **RecentVerses**: Uses `apiClient.get()` 
- **VerseHistory**: Uses `apiClient.get()`
- Added 100ms delay before dashboard API calls

### 4. **Middleware Improvements**
- Different rate limits for different endpoint types
- Better error messages with retry information
- Proper CORS headers

## Files Modified

1. **`src/lib/rate-limit.ts`**
   - Added `dataRateLimit` for dashboard/verses endpoints
   - Increased general rate limit to 60 requests/minute

2. **`src/middleware.ts`**
   - Added specific rate limiting for data endpoints
   - Better error handling and headers

3. **`src/lib/api-client.ts`** (NEW)
   - Request queuing system
   - Built-in delays between requests
   - TypeScript-safe implementation

4. **`src/app/dashboard/page.tsx`**
   - Uses API client instead of direct fetch
   - Added 100ms delay before API calls

5. **`src/components/RecentVerses.tsx`**
   - Uses API client for requests

6. **`src/components/VerseHistory.tsx`**
   - Uses API client for requests

## Testing

Run the test script to verify rate limiting:
```bash
node test-rate-limit.js
```

## Expected Behavior

- **Dashboard loads normally** without 429 errors
- **Rate limiting still protects** against DDoS attacks
- **AI operations** (verse processing) remain protected
- **Authentication** remains secure

## Rate Limit Summary

| Endpoint Type | Rate Limit | Window |
|---------------|------------|---------|
| Authentication | 5 requests | 15 minutes |
| Verse Processing | 3 requests | 1 minute |
| Data (Dashboard/Verses) | 10 requests | 10 seconds |
| General API | 60 requests | 1 minute |

The dashboard should now load without 429 errors while maintaining security against DDoS attacks.
