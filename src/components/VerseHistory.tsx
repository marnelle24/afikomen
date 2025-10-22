'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { BookOpen, Calendar, ChevronRight, Search, ChevronLeft } from 'lucide-react'

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
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const { token } = useAuth()
  const router = useRouter()

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

  const handleVerseClick = (verseId: string) => {
    router.push(`/verse/${verseId}`)
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
                onClick={() => handleVerseClick(verse.id)}
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
    </div>
  )
}
