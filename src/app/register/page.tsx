'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import RegisterForm from '@/components/RegisterForm'

export default function RegisterPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [hasRedirected, setHasRedirected] = useState(false)
  const [pageLoaded, setPageLoaded] = useState(false)

  // Mark page as loaded after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true)
    }, 500) // 500ms delay to ensure page is fully loaded

    return () => clearTimeout(timer)
  }, [])

  // Single effect to handle all redirect logic
  useEffect(() => {
    // Prevent multiple redirects
    if (hasRedirected) return

    // Only redirect if user is authenticated AND loading is complete AND page is loaded
    if (user && !loading && pageLoaded) {
      const redirectTimer = setTimeout(() => {
        console.log('RegisterPage: User is authenticated, redirecting to dashboard')
        setHasRedirected(true)
        router.replace('/dashboard')
      }, 1000) // 1 second delay to allow user to see the page

      return () => clearTimeout(redirectTimer)
    }
  }, [user, loading, pageLoaded, router, hasRedirected])

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  // If user is authenticated, show redirecting message
  if (user && pageLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">You&apos;re already logged in. Redirecting to dashboard...</p>
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
            Create your account
          </h2>
          <p className="mt-4 text-md tracking-wider font-light text-slate-600 dark:text-slate-200">
            Start your journey with Afikomen
          </p>
        </div>
        
        <RegisterForm />
        
        <div className="text-center">
          <p className="text-sm text-slate-600 dark:text-slate-200">
            Already have an account?{' '}
            <Link href="/login" className="text-orange-400 hover:text-orange-500 font-light">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

