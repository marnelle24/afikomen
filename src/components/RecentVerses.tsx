'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { BookOpen, Calendar, ChevronRight } from 'lucide-react'
import { apiClient } from '@/lib/api-client'

interface RecentVerse {
  id: string
  reference: string
  version: string
  verseContent: string
  createdAt: string
  tokenUsed: number
}

interface RecentVersesProps {
  showTitle?: boolean
  limit?: number
}

export default function RecentVerses({ showTitle = true, limit = 5 }: RecentVersesProps) {
  const { token } = useAuth()
  const [recentVerses, setRecentVerses] = useState<RecentVerse[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchRecentVerses = useCallback(async () => {
    if (!token) return

    try {
      const response = await apiClient.get('/api/verses', token || undefined)

      if (response.ok) {
        const data = await response.json()
        if (data.verses && Array.isArray(data.verses)) {
          setRecentVerses(data.verses.slice(0, limit))
        } else {
          setRecentVerses([])
        }
      }
    } catch (error) {
      console.error('Error fetching recent verses:', error)
    } finally {
      setLoading(false)
    }
  }, [token, limit])

  const handleVerseClick = (verseId: string) => {
    router.push(`/verse/${verseId}`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatVerseContent = (verseContent: string | Array<{ v: number; t: string }>) => {
    // Handle both string and array formats
    let parsedContent: Array<{ v: number; t: string }>
    let excerpt = '';

    if (typeof verseContent === 'string') {
      // Check if it looks like JSON (starts with [ or {)
      const trimmed = verseContent.trim()
      if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
        try {
          parsedContent = JSON.parse(verseContent);
        } catch (error) {
          console.error('Error parsing verse content:', error);
          // If parsing fails, treat as plain text
          return (
            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 font-light leading-relaxed">
              &ldquo;{verseContent}&rdquo;
            </p>
          )
        }
      } else {
        // If it doesn't look like JSON, treat as plain text
        return (
          <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 font-light leading-relaxed">
            &ldquo;{verseContent}&rdquo;
          </p>
        )
      }
    } else {
      parsedContent = verseContent;
    }

    // Create excerpt from parsed content
    parsedContent.forEach((verseItem: { v: number; t: string }) => {
      excerpt += `${verseItem.t} `;
    });

    return (
      <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 font-light leading-relaxed">
        &ldquo;{excerpt.trim()}&rdquo;
      </p>
    )
  }

  useEffect(() => {
    if (token) {
      fetchRecentVerses()
    }
  }, [token, fetchRecentVerses])

  if (loading) {
    return (
      <div className="bg-slate-100 dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        {showTitle && (
          <h2 className="text-xl font-normal text-slate-600 dark:text-slate-200 mb-4 flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Recent Verses
          </h2>
        )}
        <div className="animate-pulse">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-3"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-3"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-100 dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      {showTitle && (
        <h2 className="text-xl font-normal text-slate-600 dark:text-slate-200 mb-4 flex items-center">
          <BookOpen className="h-5 w-5 mr-2" />
          Recent Verses
        </h2>
      )}
      
      {recentVerses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
          <p className="text-slate-500 dark:text-slate-400 font-light">No verses explored yet. Start by searching for a verse!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentVerses.map((verse) => (
            <div
              key={verse.id}
              onClick={() => handleVerseClick(verse.id)}
              className="group relative hover:-translate-y-1 hover:shadow-xl duration-300 transition-all border-l-4 border-orange-500 dark:border-orange-400 rounded-lg p-5 bg-white dark:bg-gray-700 hover:bg-orange-50 dark:hover:bg-gray-600 cursor-pointer overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-100 dark:bg-orange-900/20 rounded-full -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="flex lg:flex-row flex-col lg:gap-0 gap-4 justify-between items-start relative z-10">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-orange-500 dark:text-orange-400 flex-shrink-0" />
                    <h3 className="font-semibold text-slate-700 dark:text-slate-100">{verse.reference}</h3>
                  </div>
                  {formatVerseContent(verse.verseContent)}
                </div>
                
                <div className="flex lg:items-start items-end lg:justify-between justify-between lg:w-auto w-full gap-3 flex-shrink-0">
                  <div className="flex lg:flex-row flex-col items-start gap-3">
                    <div className="flex items-start font-light text-[11px] italic text-slate-400 dark:text-slate-400">
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
      )}
    </div>
  )
}
