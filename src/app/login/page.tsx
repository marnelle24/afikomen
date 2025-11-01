'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import LoginForm from '@/components/LoginForm'

export default function LoginPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [hasRedirected, setHasRedirected] = useState(false)
  const [pageLoaded, setPageLoaded] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Check if this is a page refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      setIsRefreshing(true)
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  // Debug logging
  // console.log('LoginPage: user =', user ? 'authenticated' : 'not authenticated', 'loading =', loading, 'hasRedirected =', hasRedirected, 'isRefreshing =', isRefreshing)

  // Check for existing authentication on page load/refresh
  useEffect(() => {
    const checkExistingAuth = () => {
      const token = localStorage.getItem('token')
      // console.log('LoginPage: Checking existing auth, token present:', !!token)
      
      if (token) {
        // If token exists, wait for AuthContext to verify it
        // console.log('LoginPage: Token found, waiting for AuthContext verification')
        
        // Check if token is expired by trying to decode it
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          const now = Math.floor(Date.now() / 1000)
          const isExpired = payload.exp < now
          
          if (isExpired) {
            // console.log('LoginPage: Token is expired, clearing it')
            localStorage.removeItem('token')
            setPageLoaded(true)
          } else {
            console.log('LoginPage: Token is valid, waiting for AuthContext verification')
          }
        } catch {
          // console.log('LoginPage: Invalid token format, clearing it')
          localStorage.removeItem('token')
          setPageLoaded(true)
        }
      } else {
        // No token, mark page as loaded immediately
        // console.log('LoginPage: No token found, marking page as loaded')
        setPageLoaded(true)
      }
    }

    checkExistingAuth()
  }, [])

  // Mark page as loaded after a short delay (fallback)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!pageLoaded) {
        // console.log('LoginPage: Fallback timer - marking page as loaded')
        setPageLoaded(true)
      }
    }, 1000) // 1 second fallback delay

    return () => clearTimeout(timer)
  }, [pageLoaded])

  // Enhanced redirect logic for authenticated users
  useEffect(() => {
    // Prevent multiple redirects
    if (hasRedirected) return

    // Check if user is authenticated and loading is complete
    if (user && !loading) {
      // console.log('LoginPage: User is authenticated, preparing redirect')
      
      // For page refreshes, redirect immediately
      if (isRefreshing) {
        // console.log('LoginPage: Page refresh detected, redirecting immediately')
        setHasRedirected(true)
        router.replace('/dashboard')
        return
      }
      
      // For normal navigation, wait for page to load and show message
      if (pageLoaded) {
        const redirectTimer = setTimeout(() => {
          // console.log('LoginPage: User is authenticated, redirecting to dashboard')
          setHasRedirected(true)
          router.replace('/dashboard')
        }, 1000) // 1 second delay to allow user to see the page

        return () => clearTimeout(redirectTimer)
      }
    }
  }, [user, loading, pageLoaded, isRefreshing, router, hasRedirected])

  // Additional check for immediate redirect on page refresh with valid token
  useEffect(() => {
    if (hasRedirected) return

    const token = localStorage.getItem('token')
    if (token && !loading && !user && isRefreshing) {
      console.log('LoginPage: Token found on refresh, waiting for AuthContext to verify')
      // Don't redirect immediately, let AuthContext handle the verification
    }
  }, [loading, user, isRefreshing, hasRedirected])


  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            {isRefreshing ? 'Refreshing...' : 'Loading...'}
          </p>
        </div>
      </div>
    )
  }

  // If user is authenticated, show redirecting message
  if (user && (pageLoaded || isRefreshing)) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            {isRefreshing 
              ? 'Welcome back! Redirecting to dashboard...' 
              : 'You are already logged in. Redirecting to dashboard...' 
            }
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex flex-col items-center lg:mb-26 mb-24">
            <Link href="/">
              <Image 
                src="/afikomen.png" 
                alt="Afikomen Logo" 
                width={250}
                height={200}
                className="object-contain w-60"
                style={{ width: "auto", height: "auto" }}
                priority
              />
            </Link>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-600 dark:text-slate-200">
            Sign in to your account
          </h2>
          <p className="mt-4 font-light tracking-wider text-sm text-slate-600 dark:text-slate-200">
            Welcome back! Continue exploring God&apos;s word
          </p>
        </div>
        <br />
        <LoginForm />
        
        <div className="text-center">
          <p className="text-sm text-slate-600 dark:text-slate-200">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-orange-400 hover:text-orange-500 font-light">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

