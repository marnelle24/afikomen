'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import { ArrowLeft, Calendar, User, BookOpen, Heart, Share2 } from 'lucide-react'

interface VerseData {
  id: string
  reference: string
  version: string
  verseContent: string
  context: string
  modernReflection: string
  weeklyActionPlan: Array<{
    title: string
    action: string
  }>
  shortPrayer: string
  tokenUsed: number
  createdAt: string
  userId: string
  user: {
    name: string
    email: string
  }
}

export default function VersePage() {
  const params = useParams()
  const router = useRouter()
  const { user, token, loading: authLoading } = useAuth()
  const [verse, setVerse] = useState<VerseData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVerse = async () => {
      if (!params.id || !token) return
      
      try {
        setLoading(true)
        const response = await fetch(`/api/verse/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Verse not found')
          } else if (response.status === 401) {
            setError('Unauthorized access')
          } else {
            setError('Failed to load verse')
          }
          return
        }

        const data = await response.json()
        
        // Check if the verse belongs to the current user
        if (data.verse && user && data.verse.userId !== user.id) {
          setError('Unauthorized access - This verse does not belong to you')
          return
        }
        
        setVerse(data.verse)
      } catch (err) {
        setError('Failed to load verse')
        console.error('Error fetching verse:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchVerse()
  }, [params.id, token, user])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading verse...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg p-6 max-w-md">
            <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">Error</h2>
            <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
            <button
              onClick={() => router.back()}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!verse) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Verse not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="max-w-4xl mx-auto px-4 mt-12">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex gap-1 text-center text-sm cursor-pointer p-2 text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          
          <div className="flex items-center space-x-4">
            {/* <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">
              <Heart className="w-5 h-5" />
            </button> */}
            <button className="flex gap-1 text-center text-sm cursor-pointer p-2 text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">
              <Share2 className="w-4 h-4" />
              Share
            </button>
            {/* <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">
              <Edit3 className="w-5 h-5" />
            </button> */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-2">
        {/* Verse Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex lg:flex-row flex-col items-start justify-start lg:justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {verse.reference}
                <span className="text-gray-600 dark:text-gray-200 ml-2">({verse.version})</span>
              </h1>
            </div>
            <div className="lg:text-right text-left text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center mb-1">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(verse.createdAt)}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">{verse.tokenUsed} tokens used</p>
            </div>
          </div>
          
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <p className="text-lg text-gray-800 dark:text-gray-200 italic">
              &quot;{verse.verseContent}&quot;
            </p>
          </div>
        </div>

        {/* Context */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-orange-500" />
            Context
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {verse.context}
          </p>
        </div>

        {/* Modern Reflection */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-orange-500" />
            Modern Reflection
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {verse.modernReflection}
          </p>
        </div>

        {/* Weekly Action Plan */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Weekly Action Plan
          </h2>
          <div className="space-y-4">
            {verse.weeklyActionPlan.map((day, index) => (
              <div key={index} className="border-l-4 border-orange-500 pl-4 py-2">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {day.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {day.action}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Prayer */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Prayer
          </h2>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">
              {verse.shortPrayer}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
