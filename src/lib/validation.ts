import { z } from 'zod'

// Input validation schemas
export const loginSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .min(1, 'Email is required')
    .max(255, 'Email too long')
    .transform(email => email.toLowerCase().trim()),
  password: z.string()
    .min(1, 'Password is required')
    .max(128, 'Password too long')
})

export const registerSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .min(1, 'Email is required')
    .max(255, 'Email too long')
    .transform(email => email.toLowerCase().trim()),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .transform(name => name.trim())
})

export const journalSchema = z.object({
  verseId: z.string()
    .min(1, 'Verse ID is required')
    .max(50, 'Invalid verse ID'),
  personalReflection: z.string()
    .min(1, 'Personal reflection is required')
    .max(5000, 'Reflection too long')
    .transform(text => text.trim()),
  isPublic: z.boolean().optional().default(false)
})

export const updatePasswordSchema = z.object({
  currentPassword: z.string()
    .min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number')
})

export const updateProfileSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .transform(name => name.trim()),
  email: z.string()
    .email('Invalid email format')
    .min(1, 'Email is required')
    .max(255, 'Email too long')
    .transform(email => email.toLowerCase().trim())
})

// Sanitization functions
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/['"]/g, '') // Remove quotes that could break JSON
    .trim()
}

// Request size validation
export function validateRequestSize(request: Request, maxSize: number = 1024 * 1024): boolean {
  const contentLength = request.headers.get('content-length')
  if (contentLength && parseInt(contentLength) > maxSize) {
    return false
  }
  return true
}

