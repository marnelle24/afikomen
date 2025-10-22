'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import { ArrowLeft, Calendar, BookOpen, Heart, Share2, PenTool, X, Save, CheckCircle, Clock, Globe, Lock } from 'lucide-react'

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

interface JournalEntry {
  id: string
  personalReflection: string
  isPublic: boolean
  createdAt: string
  verse: {
    id: string
    reference: string
    version: string
    verseContent: string
  }
}

export default function VersePage() {
  const params = useParams()
  const router = useRouter()
  const { user, token, loading: authLoading } = useAuth()
  const [verse, setVerse] = useState<VerseData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showJournalModal, setShowJournalModal] = useState(false)
  const [journalContent, setJournalContent] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [journals, setJournals] = useState<JournalEntry[]>([])
  const [loadingJournals, setLoadingJournals] = useState(false)

  const fetchJournals = useCallback(async () => {
    if (!params.id || !token) return

    try {
      setLoadingJournals(true)
      const response = await fetch(`/api/journal?verseId=${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setJournals(data.journals || [])
      }
    } catch (error) {
      console.error('Error fetching journals:', error)
    } finally {
      setLoadingJournals(false)
    }
  }, [params.id, token])

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
    fetchJournals()
  }, [params.id, token, user, fetchJournals])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleSaveJournal = async () => {
    if (!journalContent.trim() || !user || !verse) return

    try {
      setSaving(true)
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          verseId: verse.id,
          personalReflection: journalContent,
          isPublic: isPublic
        })
      })

      if (response.ok) {
        setShowJournalModal(false)
        setJournalContent('')
        setIsPublic(false)
        setShowSuccess(true)
        
        // Refresh journals list
        fetchJournals()
        
        // Auto-hide success notification after 3 seconds
        setTimeout(() => {
          setShowSuccess(false)
        }, 3000)
      } else {
        console.error('Failed to save journal')
      }
    } catch (error) {
      console.error('Error saving journal:', error)
    } finally {
      setSaving(false)
    }
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
          
           <div className="flex items-center gap-2">
             <button 
               onClick={() => setShowJournalModal(true)}
               className="bg-gradient-to-r from-orange-300 to-orange-400 text-white hover:bg-gradient-to-l drop-shadow duration-500 hover:scale-105 transation-all border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 flex gap-1 text-center text-sm cursor-pointer p-2 dark:text-white hover:text-orange-100 transition-all"
             >
               <PenTool className="w-4 h-4" />
               Write My Journal
             </button>
             <button className="flex gap-1 text-center text-sm cursor-pointer p-2 text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">
               <Share2 className="w-4 h-4" />
               Share
             </button>
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Prayer
          </h2>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">
              {verse.shortPrayer}
            </p>
          </div>
        </div>

        {/* Journal Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <PenTool className="w-5 h-5 mr-2 text-orange-500" />
              My Journal Entries
            </h2>
            <button 
              onClick={() => setShowJournalModal(true)}
              className="bg-gradient-to-r from-orange-300 to-orange-400 text-white hover:bg-gradient-to-l drop-shadow duration-500 hover:scale-105 transition-all border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 flex gap-1 text-center text-sm cursor-pointer"
            >
              <PenTool className="w-4 h-4" />
              Add Entry
            </button>
          </div>

          {loadingJournals ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
            </div>
          ) : journals.length === 0 ? (
            <div className="text-center py-12">
              <PenTool className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">No journal entries yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Start your spiritual journey by writing your first reflection</p>
            </div>
          ) : (
            <div className="space-y-6">
              {journals.map((journal, index) => (
                <div key={journal.id} className="relative">
                  {/* Timeline line */}
                  {index < journals.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-200 dark:bg-gray-600"></div>
                  )}
                  
                  {/* Journal entry */}
                  <div className="relative flex items-start space-x-4">
                    {/* Timeline dot */}
                    <div className="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-orange-500" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {formatDate(journal.createdAt)}
                            </span>
                            <div className="flex items-center space-x-1">
                              {journal.isPublic ? (
                                <>
                                  <Globe className="w-4 h-4 text-green-500" />
                                  <span className="text-xs text-green-600 dark:text-green-400">Public</span>
                                </>
                              ) : (
                                <>
                                  <Lock className="w-4 h-4 text-gray-400" />
                                  <span className="text-xs text-gray-500 dark:text-gray-400">Private</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="prose prose-sm max-w-none">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {journal.personalReflection}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Journal Modal */}
      {showJournalModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <PenTool className="w-5 h-5 mr-2 text-orange-500" />
                Write Your Journal
              </h2>
              <button
                onClick={() => setShowJournalModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Personal Reflection
                </label>
                <textarea
                  value={journalContent}
                  onChange={(e) => setJournalContent(e.target.value)}
                  placeholder="Share your thoughts, insights, and personal reflections about this verse..."
                  className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-0 focus:outline-none focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                />
              </div>

              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  I want to make this journal public
                </label>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowJournalModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveJournal}
                  disabled={!journalContent.trim() || saving}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Journal
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className="bg-green-500/70 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 max-w-sm">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Journal Saved!</p>
              <p className="text-sm text-green-100">Your reflection has been saved successfully.</p>
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              className="ml-2 text-green-200 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
