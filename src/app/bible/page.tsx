'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Search, Loader2, Sun, Moon, LayoutDashboard, LogIn, UserPlus } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import Header from '@/components/Header'

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

// Sticky Header Component
const StickyHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { isDark, toggleTheme } = useTheme()
  const { user } = useAuth()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-transparent dark:bg-transparent backdrop-blur-md' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center justify-end">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={toggleTheme}
              className="cursor-pointer rounded-md text-slate-600 dark:text-slate-200 hover:text-orange-400 dark:hover:text-orange-300 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="lg:h-5 lg:w-5 h-7 w-7" /> : <Moon className="lg:h-5 lg:w-5 h-7 w-7" />}
            </button>
            
            {!mounted ? (
              // Placeholder to prevent hydration mismatch
              <div className="w-24 h-6"></div>
            ) : user ? (
              <Link
                href="/dashboard"
                className="cursor-pointer flex items-center space-x-1 text-sm text-slate-600 dark:text-slate-200 hover:text-orange-400 dark:hover:text-orange-300 transition-colors"
                title="Dashboard"
              >
                <LayoutDashboard className="lg:h-5 lg:w-5 h-7 w-7" />
                <span className="hidden sm:block text-xs font-semibold uppercase tracking-widest">Dashboard</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="cursor-pointer flex items-center space-x-1 text-sm text-slate-600 dark:text-slate-200 hover:text-orange-400 dark:hover:text-orange-300 transition-colors"
                  title="Login"
                >
                  <LogIn className="lg:h-5 lg:w-5 h-7 w-7" />
                  <span className="hidden sm:block text-xs font-semibold uppercase tracking-widest">Login</span>
                </Link>

                <Link
                  href="/register"
                  className="cursor-pointer flex items-center space-x-1 text-sm text-slate-600 dark:text-slate-200 hover:text-orange-400 dark:hover:text-orange-300 transition-colors"
                  title="Register"
                >
                  <UserPlus className="lg:h-5 lg:w-5 h-7 w-7" />
                  <span className="hidden sm:block text-xs font-semibold uppercase tracking-widest">Register</span>
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </motion.header>
  )
}

export default function BiblePage() {
  const [passage, setPassage] = useState('')
  const [loading, setLoading] = useState(false)
  const [bibleData, setBibleData] = useState<BibleResponse | null>(null)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    if (!passage.trim()) return

    setLoading(true)
    setError('')
    setBibleData(null)

    try {
      // Encode the passage for URL
      const encodedPassage = encodeURIComponent(passage.trim())
      const response = await fetch(`https://bible-api.com/${encodedPassage}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: BibleResponse = await response.json()
      setBibleData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch Bible passage')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-800">
      {/* Sticky Header */}
        <StickyHeader />
        <Header />
      
        <div className="container mx-auto px-4 lg:mt-20 mt-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto"
            >
                {/* Header */}
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className='flex flex-col justify-center items-center py-8'  
                >
                    <h1 className="lg:text-4xl text-2xl font-bold text-orange-400 dark:text-orange-400 mb-2">
                        The Afikomen Bible App
                    </h1>
                    <p className="text-orange-400 dark:text-orange-300 lg:w-3/4 w-full text-center font-light tracking-wider">
                        You Simplified Bible App where you can search and read Bible passages from the modern & simplified World English Bible
                    </p>
                </motion.div>

                {/* Search Input */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200/10 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 rounded-xl shadow-lg p-6 mb-8"
                >
                    <div className="flex flex-col gap-1">
                        <label htmlFor="passage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Search for a bible passage
                            </label>
                            <div className='flex lg:flex-row flex-col gap-2'>
                            <div className="flex w-full">
                                <input
                                    id="passage"
                                    type="search"
                                    value={passage}
                                    onChange={(e) => setPassage(e.target.value)}
                                    // onKeyPress={handleKeyPress}
                                    placeholder="ex: John 3:16 or John 3:16-20 or John 3:16-20,25,32"
                                    className="bg-white dark:bg-gray-600 w-full px-4 py-3 border border-gray-600 dark:border-gray-400/60 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-transparent dark:text-white"
                                    disabled={loading}
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    type='button'
                                    onClick={handleSearch}
                                    disabled={loading || !passage.trim()}
                                    className="w-full px-6 justify-center items-center py-3 bg-orange-500 text-white rounded-lg cursor-pointer hover:bg-orange-600 focus:ring-1 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex gap-2 transition-colors"
                                >
                                    {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                    <Search className="w-4 h-4" />
                                    )}
                                    {loading ? 'Searching...' : 'Search'}
                                </button>
                            </div>
                            </div>
                    </div>
                </motion.div>

                {/* Results */}
                {error && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6"
                >
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                </motion.div>
                )}

                {bibleData && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                    >
                        {/* Header Info */}
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {bibleData.reference}
                            </h2>
                        </div>

                        {/* Full Text */}
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <p className="text-gray-800 dark:text-gray-200 font-light leading-relaxed whitespace-pre-line max-h-96 overflow-y-auto">
                            {bibleData.text}
                            </p>
                        </div>
                    </motion.div>
                )}
                    
                {bibleData && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-12"
                    >
                        {/* Individual Verses */}
                        {bibleData.verses && bibleData.verses.length > 0 && (
                            <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                Verse by verse
                            </h3>
                            <div className="space-y-4 max-h-96 overflow-auto">
                                {bibleData.verses.map((verse, index) => (
                                <motion.div
                                    key={`${verse.book_id}-${verse.chapter}-${verse.verse}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                                >
                                    <div className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-8 h-8 bg-orange-400 text-white rounded-full flex items-center justify-center text-lg font-light">
                                        {verse.verse}
                                    </span>
                                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                                        {verse.text}
                                    </p>
                                    </div>
                                </motion.div>
                                ))}
                            </div>
                            </div>
                        )}
                    </motion.div>
                )}          

            </motion.div>
        </div>
    </div>
  )
}
