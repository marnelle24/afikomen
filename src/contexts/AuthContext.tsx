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
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      setToken(savedToken)
      // Verify token and get user info
      fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${savedToken}`
        }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}`)
          }
          return res.json()
        })
        .then(data => {
          if (data.user) {
            setUser(data.user)
            // Fetch token info after user is set
            fetch('/api/tokens', {
              headers: {
                'Authorization': `Bearer ${savedToken}`
              }
            })
              .then(res => {
                if (!res.ok) {
                  throw new Error(`Token fetch failed: ${res.status}`)
                }
                return res.json()
              })
              .then(tokenData => {
                if (tokenData.success) {
                  setTokenInfo(tokenData.data)
                }
              })
              .catch(error => {
                console.error('Token fetch error:', error)
              })
          } else {
            console.log('No user data received, clearing auth')
            localStorage.removeItem('token')
            setToken(null)
          }
        })
        .catch(error => {
          console.error('Auth verification error:', error)
          localStorage.removeItem('token')
          setToken(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

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
