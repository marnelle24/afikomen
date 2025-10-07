'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import VerseHistory from '@/components/VerseHistory'
import RecentVerses from '@/components/RecentVerses'
import { BookOpen, TrendingUp, Copy, Check, Heart, Target, Coins } from 'lucide-react'

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

interface FullVerse {
  id: string
  reference: string
  version: string
  verseContent: string
  context: string
  modernReflection: string
  weeklyActionPlan: Array<{ title: string; action: string }>
  shortPrayer: string
  createdAt: string
}

export default function DashboardPage() {
  const { user, token, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)
  const [selectedVerse, setSelectedVerse] = useState<FullVerse | null>(null)
  const [copied, setCopied] = useState(false)

  const fetchDashboardStats = React.useCallback(async () => {
    try {
      const response = await fetch('/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

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


  const copyVerseContent = async (verse: FullVerse) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    
    const formattedContent = `${verse.reference} (${verse.version})

Verse:
"${verse.verseContent}"

Context:
${verse.context}

Reflection:
${verse.modernReflection}

7-Day Action Plan:
${verse.weeklyActionPlan.map((day, index) => `${days[index]}: ${day.title}\n${day.action}`).join('\n\n')}

Prayer:
"${verse.shortPrayer}"`

    try {
      await navigator.clipboard.writeText(formattedContent)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedVerse(null)
    }
  }

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
              <div className="bg-slate-100 dark:bg-gray-800 rounded-lg shadow-lg border border-slate-300 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-light text-orange-500 dark:text-orange-300">Total Verses</p>
                    <p className="text-3xl font-bold text-orange-400 dark:text-orange-300 mt-2">{stats.totalVerses}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-orange-400 dark:text-orange-300" />
                </div>
              </div>

              <div className="bg-slate-100 dark:bg-gray-800 rounded-lg shadow-lg border border-slate-300 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-light text-orange-500 dark:text-orange-300">This Week</p>
                    <p className="text-3xl font-bold text-orange-400 dark:text-orange-300 mt-2">{stats.versesThisWeek}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-400 dark:text-orange-300" />
                </div>
              </div>

              <div className="bg-slate-100 dark:bg-gray-800 rounded-lg shadow-lg border border-slate-300 dark:border-slate-700 p-6">
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
            <RecentVerses onVerseClick={setSelectedVerse} />
            <br />
            {/* Verse History */}
            <VerseHistory />
          </div>
        </div>
      </main>

      {/* Verse Detail Modal */}
      {selectedVerse && (
        <div 
          className="fixed inset-0 bg-black/80 dark:bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={handleBackdropClick}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-slate-600 dark:text-slate-200">{selectedVerse.reference} ({selectedVerse.version})</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyVerseContent(selectedVerse)}
                    className="cursor-pointer flex items-center gap-2 px-3 mr-4 py-1 text-xs bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-300/50 text-orange-400 dark:text-orange-300 rounded-md hover:bg-orange-200 dark:hover:bg-orange-700/50 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy All
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setSelectedVerse(null)}
                    className="text-slate-600 dark:text-slate-200 hover:text-orange-400 dark:hover:text-orange-300 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-300 dark:border-orange-800">
                  <p className="text-orange-900 dark:text-orange-100 font-light">{selectedVerse.verseContent}</p>
                </div>
                
                <div className="bg-slate-50 dark:bg-gray-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                  <h4 className="font-semibold text-slate-600 dark:text-slate-200 mb-3 flex items-center">
                    {/* <span className="w-6 h-6 bg-orange-100 dark:bg-orange-400/20 text-orange-500 dark:text-orange-400 rounded-full flex items-center justify-center text-xs font-bold mr-2">1</span> */}
                    <BookOpen className="h-4 w-4 mr-2 text-slate-600 dark:text-slate-300" />
                    Context
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 font-light leading-relaxed">{selectedVerse.context}</p>
                </div>
                
                <div className="bg-slate-50 dark:bg-gray-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                  <h4 className="font-semibold text-slate-600 dark:text-slate-200 mb-3 flex items-center">
                    <Heart className="h-4 w-4 mr-2 text-rose-500 dark:text-rose-400" />
                    Reflection
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 font-light leading-relaxed">{selectedVerse.modernReflection}</p>
                </div>
                
                <div className="bg-slate-50 dark:bg-gray-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                  <h4 className="font-semibold text-slate-600 dark:text-slate-200 mb-4 flex items-center">
                    <Target className="h-4 w-4 mr-2 text-orange-500 dark:text-orange-400" />
                    Weekly Action Plan
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {selectedVerse.weeklyActionPlan.map((day, index) => (
                      <div key={index} className="bg-white dark:bg-gray-600 p-3 rounded-lg border border-slate-200 dark:border-slate-500">
                        <div className="font-semibold text-sm text-orange-500 dark:text-orange-400 mb-1">{day.title}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300 font-light">{day.action}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-200/70">
                  <h4 className="font-semibold text-slate-600 dark:text-slate-200 mb-3 flex items-center">
                    <Heart className="h-4 w-4 mr-2 text-amber-500 dark:text-amber-400" />
                    Prayer
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 italic font-light leading-relaxed">&ldquo;{selectedVerse.shortPrayer}&rdquo;</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

