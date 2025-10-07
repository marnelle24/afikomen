'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import VerseHistory from '@/components/VerseHistory'
import { BookOpen, TrendingUp, Calendar, ChevronRight, Copy, Check, Heart, Target, Coins } from 'lucide-react'

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
  recentVerses: Array<{
    id: string
    reference: string
    version: string
    verseContent: string
    createdAt: string
  }>
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const fetchFullVerse = async (verseId: string) => {
    try {
      const response = await fetch(`/api/verse/${verseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setSelectedVerse(data.verse)
      }
    } catch (error) {
      console.error('Error fetching verse:', error)
    }
  }

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
                      {stats.tokenUsage.tokensUsed}/{stats.tokenUsage.tokenBalance}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {stats.tokenUsage.remainingTokens} remaining
                    </p>
                    {/* <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      {stats.tokenUsage.totalTokensUsedInVerses} total used
                    </p> */}
                  </div>
                  <Coins className="h-8 w-8 text-orange-400 dark:text-orange-300" />
                </div>
              </div>
            </div>

            {/* Recent Verses */}
            <div className="bg-slate-100 dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-normal text-slate-600 dark:text-slate-200 mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Recent Verses
              </h2>
              
              {stats.recentVerses.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                  <p className="text-slate-500 dark:text-slate-400 font-light">No verses explored yet. Start by searching for a verse!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.recentVerses.map((verse) => (
                    <div
                      key={verse.id}
                      onClick={() => fetchFullVerse(verse.id)}
                      className="group relative hover:-translate-y-1 hover:shadow-xl duration-300 transition-all border-l-4 border-orange-500 dark:border-orange-400 rounded-lg p-5 bg-white dark:bg-gray-700 hover:bg-orange-50 dark:hover:bg-gray-600 cursor-pointer overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-orange-100 dark:bg-orange-900/20 rounded-full -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="flex lg:flex-row flex-col lg:gap-0 gap-4 justify-between items-start relative z-10">
                        <div className="flex-1 pr-4">
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="h-4 w-4 text-orange-500 dark:text-orange-400 flex-shrink-0" />
                            <h3 className="font-semibold text-slate-700 dark:text-slate-100">{verse.reference}</h3>
                            <span className="text-xs px-2 py-0.5 bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-full font-medium">{verse.version}</span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 font-light leading-relaxed">{verse.verseContent}</p>
                        </div>
                        
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="flex items-center font-light text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-gray-600 px-3 py-1.5 rounded-full">
                            <Calendar className="h-3 w-3 mr-1.5" />
                            {formatDate(verse.createdAt)}
                          </div>
                          <ChevronRight className="h-5 w-5 text-slate-400 dark:text-slate-500 group-hover:text-orange-500 dark:group-hover:text-orange-400 group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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

