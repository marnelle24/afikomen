'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import RegisterForm from '@/components/RegisterForm'

export default function RegisterPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user && !loading) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-400"></div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex flex-col items-center lg:mb-26 mb-24">
            <Image 
              src="/afikomen.png" 
              alt="Afikomen Logo" 
              width={250}
              height={200}
              className="object-contain w-60"
            />
            <p className="text-orange-400 dark:text-orange-300 font-normal dark:font-thin text-[10px] uppercase tracking-wider text-center mt-4">
              Uncovering God&apos;s word, one verse at a time
            </p>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-600 dark:text-slate-200">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-200">
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

