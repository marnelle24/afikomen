'use client'

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import RecentVerses from '@/components/RecentVerses'

export default function AppPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirect to login if not logged in
  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-400"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="px-4 py-6 sm:px-0">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-600 dark:text-slate-200 mb-2">
                Welcome back!
              </h1>
              <p className="text-slate-600 font-light dark:text-slate-200 text-sm lg:text-base">
                Discover deeper meaning of God&apos;s word and be transformed by His amazing grace.
              </p>
            </div>

            <div className="space-y-8">
              {user && (
                <RecentVerses showTitle={true} limit={3} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

