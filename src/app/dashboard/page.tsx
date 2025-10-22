'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import VerseHistory from '@/components/VerseHistory'
import RecentVerses from '@/components/RecentVerses'
import { BookOpen, TrendingUp, Coins } from 'lucide-react'
import { apiClient } from '@/lib/api-client'

// Helper function to format large numbers with K notation
const formatTokenNumber = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace('.0', '') + 'K'
  }
  return num.toString()
}

interface DashboardStats {
  totalVerses: number
  versesThisWeek: number
  tokenUsage: {
    tokensUsed: number
    tokenBalance: number
    remainingTokens: number
    totalTokensUsedInVerses: number
  }
  favoriteVersion: string
}

export default function DashboardPage() {
  const { user, token, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)

  const fetchDashboardStats = React.useCallback(async () => {
    try {
      const response = await apiClient.get('/api/dashboard', token)

      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoadingStats(false)
    }
  }, [token])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
    if (user && token) {
      fetchDashboardStats()
    }
  }, [user, loading, token, router, fetchDashboardStats])



  if (loading || loadingStats) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-400"></div>
      </div>
    )
  }

  if (!user || !stats) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-600 dark:text-slate-200 mb-8">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-r from-slate-200 via-white to-slate-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-lg shadow-lg border border-slate-300 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-light text-orange-500 dark:text-orange-300">Total Verses</p>
                    <p className="text-3xl font-bold text-orange-400 dark:text-orange-300 mt-2">{stats.totalVerses}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-orange-400 dark:text-orange-300" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-slate-200 via-white to-slate-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-lg shadow-lg border border-slate-300 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-light text-orange-500 dark:text-orange-300">This Week</p>
                    <p className="text-3xl font-bold text-orange-400 dark:text-orange-300 mt-2">{stats.versesThisWeek}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-400 dark:text-orange-300" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-slate-200 via-white to-slate-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-lg shadow-lg border border-slate-300 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-light text-orange-500 dark:text-orange-300">Token Usage</p>
                    <p className="text-3xl font-bold text-orange-400 dark:text-orange-300 mt-2">
                      {formatTokenNumber(stats.tokenUsage.tokensUsed)}/{formatTokenNumber(stats.tokenUsage.tokenBalance)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {formatTokenNumber(stats.tokenUsage.remainingTokens)} remaining
                    </p>
                  </div>
                  <Coins className="h-8 w-8 text-orange-400 dark:text-orange-300" />
                </div>
              </div>
            </div>

            {/* Recent Verses */}
            <RecentVerses />
            <br />
            {/* Verse History */}
            <VerseHistory />
          </div>
        </div>
      </main>
    </div>
  )
}

