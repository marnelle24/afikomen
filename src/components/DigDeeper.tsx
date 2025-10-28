'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, LogIn, UserPlus } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface BibleVerse {
  book_id: string
  book_name: string
  chapter: number
  verse: number
  text: string
}

interface BibleResponse {
  reference: string
  verses: BibleVerse[]
  text: string
  translation_id: string
  translation_name: string
  translation_note: string
}

interface DigDeeperProps {
  BibleData: BibleResponse
}

export default function DigDeeper({BibleData}: DigDeeperProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Show tooltip automatically after component mounts
    const timer = setTimeout(() => {
      setShowTooltip(true)
    }, 500) // Small delay to ensure smooth mounting

    // Hide tooltip after 5 seconds
    const hideTimer = setTimeout(() => {
      setShowTooltip(false)
    }, 6500) // 500ms delay + 5 seconds

    return () => {
      clearTimeout(timer)
      clearTimeout(hideTimer)
    }
  }, [])

  const handleAIClick = async () => {
    if (user) {
      // User is logged in - handle AI feature
      setIsGenerating(true)
      console.log('User is logged in, AI feature activated')
      console.log('Bible Data:', BibleData)
      
      try {
        // Call the API route for AI analysis
        const response = await fetch('/api/ai/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reference: BibleData.reference,
            text: BibleData.text,
            verses: BibleData.verses,
            translation: BibleData.translation_name
          })
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const aiResponse = await response.json()
        console.log('AI Analysis Response:', aiResponse)

        // Save the verse to database
        // Create a minimal verse content from the Bible data
        const minimalVerses = BibleData.verses.map(verse => ({
          v: verse.verse,
          t: verse.text
        }))
        
        console.log('About to call /api/verse/ai-save endpoint')
        const saveResponse = await fetch('/api/verse/ai-save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            reference: aiResponse.reference,
            version: 'WEB',
            verseContent: JSON.stringify(minimalVerses),
            context: aiResponse.context,
            modernReflection: aiResponse.modern_reflection,
            weeklyActionPlan: JSON.stringify(aiResponse.weekly_action_plan),
            shortPrayer: aiResponse.short_prayer,
            tokenUsed: aiResponse.tokens_used
          })
        })

        if (!saveResponse.ok) {
          const errorText = await saveResponse.text()
          console.error('Save verse error response:', errorText)
          throw new Error(`Failed to save verse: ${saveResponse.status} - ${errorText}`)
        }

        const savedVerse = await saveResponse.json()
        console.log('Verse saved:', savedVerse)

        // Redirect to the verse page
        router.push(`/verse/${savedVerse.verse.id}`)
      } catch (error) {
        console.error('Error generating AI analysis or saving verse:', error)
      } finally {
        setIsGenerating(false)
      }
    } else {
      // User is not logged in - show login dialog
      setShowLoginDialog(true)
    }
  }

  return (
    <div className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
    >
        <button
            onClick={handleAIClick}
            disabled={isGenerating}
            className="flex items-center p-2 text-orange-400 hover:text-orange-600 dark:text-orange-300 dark:hover:text-orange-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <div className="flex items-start cursor-pointer hover:-translate-y-0.5 transition-transform duration-300">
                <sup>
                  {isGenerating ? (
                    <div className="w-3 h-3 border border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Sparkles className="w-3 h-3" />
                  )}
                </sup>
                <span className="font-bold text-xl">
                  {isGenerating ? 'Generating...' : 'Ai'}
                </span>
            </div>
        </button>

        {/* Hover Tooltip */}
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              transition: { 
                duration: 0.5,
                ease: "easeOut"
              }
            }}
            exit={{ 
              opacity: 0, 
              y: 10, 
              scale: 0.9,
              transition: { 
                duration: 0.5,
                ease: "easeIn"
              }
            }}
            className="absolute bottom-full md:left-1/2 -left-16 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 dark:bg-gray-300 text-white dark:text-gray-900 text-xs rounded-lg p-3 shadow-xl z-20"
          >
            <div className="text-left flex flex-col gap-1">
                <p className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /><span className="font-bold text-base">AI Assistant</span>
                </p>
                <p className="mb-1 text-sm font-light">
                    Dig deeper to the passage, get the real context, modern reflections & insights and apply practical actionable 7-day plans tailored to your spiritual journey.
                    <br />
                    <br />
                    Make this application your daily journal & devotion companion.
                    <br />
                    <br />
                    Transform your Bible study with intelligent analysis and guidance.
                </p>
            </div>
            {/* Arrow pointing down */}
            <div className="absolute top-full md:left-1/2 left-56 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-16 border-transparent border-t-gray-900 dark:border-t-gray-300"></div>
          </motion.div>
        )}

        {/* Login Dialog */}
        <AnimatePresence>
          {showLoginDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 py-16"
              onClick={() => setShowLoginDialog(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-6 h-6 text-orange-500" />
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">AI Assistant</h3>
                  </div>
                  <button
                    onClick={() => setShowLoginDialog(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="w-5 h-5 cursor-pointer hover:text-orange-500 transition-colors" />
                  </button>
                </div>

                <div className="mb-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-8">
                    To access the AI Assistant features, please log in or create an account. Enjoy <span className="font-bold text-orange-400 dark:text-orange-300">10,000 free credits</span>.
                  </p>
                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                    <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">AI Assistant Features Include:</h4>
                    <div className="text-sm text-orange-700 dark:text-orange-300 space-y-2">
                      <p className="flex"><span className="w-2 h-2">-</span><span className="ml-1">Get the context, modern reflections & insights</span></p>
                      <p className="flex"><span className="w-2 h-2">-</span><span className="ml-1">Get 7-day action plans tailored to your spiritual journey</span></p>
                      <p className="flex"><span className="w-2 h-2">-</span><span className="ml-1">Make this application your daily journal & devotion companion</span></p>
                      <p className="flex"><span className="w-2 h-2">-</span><span className="ml-1">Transform your Bible study with intelligent analysis and guidance</span></p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Link
                    href="/login"
                    className="flex-1 flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
                    onClick={() => setShowLoginDialog(false)}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                  <Link
                    href="/register"
                    className="flex-1 flex items-center justify-center space-x-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg transition-colors"
                    onClick={() => setShowLoginDialog(false)}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Sign Up</span>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  )
}
