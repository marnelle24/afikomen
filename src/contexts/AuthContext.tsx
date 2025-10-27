'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface User {
  id: string
  email: string
  name?: string
  tokenBalance?: number
  tokensUsed?: number
  lastTokenReset?: string
}

interface TokenInfo {
  tokenBalance: number
  tokensUsed: number
  remainingTokens: number
  lastTokenReset: string
  hasTokens: boolean
}

interface AuthContextType {
  user: User | null
  token: string | null
  tokenInfo: TokenInfo | null
  login: (token: string, user: User) => Promise<void>
  logout: () => void
  loading: boolean
  refreshTokenInfo: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  // Fallback timeout to ensure loading doesn't persist indefinitely
  useEffect(() => {
    const fallbackTimeout = setTimeout(() => {
      if (loading) {
        console.warn('Auth loading timeout - forcing loading to false. Token:', localStorage.getItem('token') ? 'present' : 'none')
        setLoading(false)
        setInitialized(true) // Also set initialized to prevent re-initialization
      }
    }, 6000) // 6 second fallback timeout (slightly longer than API timeout)

    return () => clearTimeout(fallbackTimeout)
  }, [loading])

  const refreshTokenInfo = async () => {
    if (!token) return
    
    try {
      const response = await fetch('/api/tokens', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setTokenInfo(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch token info:', error)
    }
  }

  useEffect(() => {
    // Prevent multiple initializations
    if (initialized) return
    
    const savedToken = localStorage.getItem('token')
    console.log('AuthContext: Initializing with token:', savedToken ? 'present' : 'none')
    
    if (savedToken) {
      setToken(savedToken)
      setInitialized(true)
      
      // Add a small delay to prevent rapid API calls
      const timeoutId = setTimeout(() => {
        // Create an abort controller for timeout
        const controller = new AbortController()
        const timeoutId2 = setTimeout(() => controller.abort(), 5000) // 5 second timeout
        
        // Verify token and get user info
        console.log('AuthContext: Making API call to /api/auth/me with token:', savedToken.substring(0, 20) + '...')
        fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${savedToken}`
          },
          signal: controller.signal
        })
          .then(res => {
            clearTimeout(timeoutId2)
            console.log('AuthContext: API response status:', res.status, res.statusText)
            if (!res.ok) {
              throw new Error(`HTTP ${res.status}: ${res.statusText}`)
            }
            return res.json()
          })
          .then(data => {
            console.log('AuthContext: API response received:', data)
            if (data.user) {
              console.log('AuthContext: Setting user data:', data.user)
              setUser(data.user)
              // Use token info from user data if available
              if (data.user.tokenBalance !== undefined) {
                setTokenInfo({
                  tokenBalance: data.user.tokenBalance || 0,
                  tokensUsed: data.user.tokensUsed || 0,
                  remainingTokens: (data.user.tokenBalance || 0) - (data.user.tokensUsed || 0),
                  lastTokenReset: data.user.lastTokenReset || new Date().toISOString(),
                  hasTokens: (data.user.tokenBalance || 0) - (data.user.tokensUsed || 0) > 0
                })
              }
            } else {
              console.log('No user data received, clearing auth')
              localStorage.removeItem('token')
              setToken(null)
            }
          })
          .catch(error => {
            clearTimeout(timeoutId2)
            console.error('Auth verification error:', error)
            console.error('Error details:', {
              name: error.name,
              message: error.message,
              stack: error.stack
            })
            // Only clear token if it's not an abort error (timeout)
            if (error.name !== 'AbortError') {
              console.log('AuthContext: Clearing token due to error')
              localStorage.removeItem('token')
              setToken(null)
            } else {
              console.log('AuthContext: API call aborted (timeout), keeping token')
              // Try to decode token and create basic user state
              try {
                const tokenPayload = JSON.parse(atob(savedToken.split('.')[1]))
                console.log('AuthContext: Creating basic user from token payload:', tokenPayload)
                setUser({
                  id: tokenPayload.userId,
                  email: tokenPayload.email,
                  name: tokenPayload.email.split('@')[0], // Use email prefix as name
                  tokenBalance: 100, // Default token balance
                  tokensUsed: 0,
                  lastTokenReset: new Date().toISOString()
                })
              } catch (tokenError) {
                console.error('AuthContext: Failed to decode token:', tokenError)
              }
            }
            // Always set loading to false on error
            setLoading(false)
            setInitialized(true)
          })
          .finally(() => {
            setLoading(false)
            setInitialized(true)
          })
      }, 100) // Small delay to prevent rapid calls
      
      return () => {
        clearTimeout(timeoutId)
      }
    } else {
      // No token, set states immediately
      setLoading(false)
      setInitialized(true)
    }
  }, [initialized])

  const login = async (newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(newUser)
    
    // Fetch token info immediately after login
    try {
      const response = await fetch('/api/tokens', {
        headers: {
          'Authorization': `Bearer ${newToken}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setTokenInfo(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch token info after login:', error)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    setTokenInfo(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, tokenInfo, login, logout, loading, refreshTokenInfo }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
