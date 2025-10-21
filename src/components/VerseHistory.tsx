'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { BookOpen, Calendar, Copy, Check, X, Sparkles, Heart, Target, ChevronRight, Search, Coins, ChevronLeft } from 'lucide-react'

interface Verse {
  id: string
  reference: string
  version: string
  verseContent: string
  context: string
  modernReflection: string
  weeklyActionPlan: Array<{ title: string; action: string }>
  shortPrayer: string
  createdAt: string
  tokenUsed: number
}

export default function VerseHistory() {
  const [verses, setVerses] = useState<Verse[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null)
  const [copied, setCopied] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const { token } = useAuth()

  const ITEMS_PER_PAGE = 6

  const fetchVerses = React.useCallback(async () => {
    try {
      const response = await fetch('/api/verses', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setVerses(data.verses)
      }
    } catch (error) {
      console.error('Error fetching verses:', error)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (token) {
      fetchVerses()
    }
  }, [token, fetchVerses])

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const copyVerseContent = async (verse: Verse) => {
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

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-slate-600 dark:text-slate-200 mb-4">History</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  // Filter verses based on search query
  const filteredVerses = verses.filter((verse) => {
    const query = searchQuery.toLowerCase()
    return (
      verse.reference.toLowerCase().includes(query) ||
      verse.version.toLowerCase().includes(query) ||
      verse.verseContent.toLowerCase().includes(query)
    )
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredVerses.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedVerses = filteredVerses.slice(startIndex, endIndex)

  return (
    <div className="space-y-6">
      <div className="bg-slate-100 dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-normal text-slate-600 dark:text-slate-200 flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            History
          </h2>
          
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input
              type="search"
              placeholder="Search verses, references..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 transition-all"
            />
          </div>
        </div>
        
        {filteredVerses.length === 0 ? (
          <div className="text-center py-12">
            {searchQuery ? (
              <>
                <Search className="h-12 w-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                <p className="text-slate-500 dark:text-slate-400 font-light">No verses found matching &ldquo;{searchQuery}&rdquo;</p>
              </>
            ) : (
              <>
                <BookOpen className="h-12 w-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                <p className="text-slate-500 dark:text-slate-400 font-light">No verses saved yet. Start by exploring a verse above!</p>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {paginatedVerses.map((verse) => (
              <div
                key={verse.id}
                className="group relative hover:-translate-y-1 hover:shadow-xl duration-300 transition-all border-l-4 border-orange-500 dark:border-orange-400 rounded-lg p-5 bg-white dark:bg-gray-700 hover:bg-orange-50 dark:hover:bg-gray-600 cursor-pointer overflow-hidden"
                onClick={() => setSelectedVerse(verse)}
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
                  
                  <div className="flex lg:items-start items-end lg:justify-between justify-between lg:w-auto w-full gap-3 flex-shrink-0">
                    <div className="flex lg:flex-row flex-col items-start gap-3">
                      <div className="flex items-center font-light text-[11px] italic text-slate-400 dark:text-slate-400">
                        {verse.tokenUsed} tokens
                      </div>
                      <div className="flex items-center font-light text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-gray-600 px-3 py-1.5 rounded-full">
                        <Calendar className="h-3 w-3 mr-1.5" />
                        {formatDate(verse.createdAt)}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-400 dark:text-slate-500 group-hover:text-orange-500 dark:group-hover:text-orange-400 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-gray-600">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredVerses.length)} of {filteredVerses.length} verses
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first page, last page, current page, and pages around current page
                      const shouldShow = 
                        page === 1 || 
                        page === totalPages || 
                        Math.abs(page - currentPage) <= 1
                      
                      if (!shouldShow) {
                        // Show ellipsis for gaps
                        if (page === 2 && currentPage > 4) {
                          return <span key={`ellipsis-${page}`} className="px-2 text-slate-400">...</span>
                        }
                        if (page === totalPages - 1 && currentPage < totalPages - 3) {
                          return <span key={`ellipsis-${page}`} className="px-2 text-slate-400">...</span>
                        }
                        return null
                      }
                      
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            page === currentPage
                              ? 'bg-orange-500 text-white'
                              : 'text-slate-600 dark:text-slate-300 bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 hover:bg-slate-50 dark:hover:bg-gray-600'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {selectedVerse && (
        <div 
          className="fixed inset-0 bg-black/70 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
          onClick={handleBackdropClick}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-400 dark:from-orange-400 dark:via-orange-300 dark:to-orange-400 p-6 border-b border-orange-300 dark:border-orange-700">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-6 w-6 text-white" />
                    <h3 className="text-2xl font-bold text-white">{selectedVerse.reference}</h3>
                    <span className="text-sm px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full font-medium">
                      {selectedVerse.version}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-white/90 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(selectedVerse.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/90 text-sm">
                    <Coins className="h-4 w-4" />
                    <span>{selectedVerse.tokenUsed} tokens used</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => copyVerseContent(selectedVerse)}
                    className="cursor-pointer flex items-center gap-2 px-4 py-2 text-md dark:bg-amber-900/30 text-amber-800 dark:text-amber-100 rounded-lg hover:bg-amber-100 bg-amber-200/40 dark:hover:bg-amber-800/50 transition-all duration-200 font-medium shadow-sm hover:shadow"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy All
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setSelectedVerse(null)}
                    className="cursor-pointer p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-110"
                    aria-label="Close"
                  >
                    <X className="h-7 w-7" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
              <div className="space-y-6">
                {/* Verse Content */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-xl border-2 border-indigo-200 dark:border-indigo-800 shadow-sm">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-6 w-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-1" />
                    <p className="text-lg text-indigo-900 dark:text-indigo-100 font-light leading-relaxed italic">&ldquo;{selectedVerse.verseContent}&rdquo;</p>
                  </div>
                </div>
                
                {/* Context Section */}
                <div className="bg-slate-50 dark:bg-gray-700/50 p-5 rounded-xl border border-slate-200 dark:border-gray-600">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                    <h4 className="font-semibold text-slate-700 dark:text-slate-200 text-lg">Context</h4>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 font-light leading-relaxed">{selectedVerse.context}</p>
                </div>
                
                {/* Reflection Section */}
                <div className="bg-slate-50 dark:bg-gray-700/50 p-5 rounded-xl border border-slate-200 dark:border-gray-600">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="h-5 w-5 text-rose-500 dark:text-rose-400" />
                    <h4 className="font-semibold text-slate-700 dark:text-slate-200 text-lg">Reflection</h4>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 font-light leading-relaxed">{selectedVerse.modernReflection}</p>
                </div>
                
                {/* Action Plan Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="h-5 w-5 text-orange-500 dark:text-orange-400" />
                    <h4 className="font-semibold text-slate-700 dark:text-slate-200 text-lg">7-Day Action Plan</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {selectedVerse.weeklyActionPlan.map((day, index) => {
                      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
                      return (
                        <div 
                          key={index} 
                          className="group bg-white dark:bg-gray-700 border border-orange-500/60 dark:border-orange-400/40 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:translate-x-1"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-orange-200 dark:bg-orange-900/60 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400 font-semibold text-sm">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{days[index]}</span>
                              </div>
                              <div className="font-semibold text-slate-700 dark:text-slate-200 mb-1">{day.title}</div>
                              <div className="text-sm text-slate-600 dark:text-slate-300 font-light leading-relaxed">{day.action}</div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                
                {/* Prayer Section */}
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-2 border-amber-200 dark:border-amber-800 p-6 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    <h4 className="font-semibold text-amber-900 dark:text-amber-200 text-lg">Prayer</h4>
                  </div>
                  <p className="text-amber-900 dark:text-amber-100 italic leading-relaxed font-light">&ldquo;{selectedVerse.shortPrayer}&rdquo;</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
