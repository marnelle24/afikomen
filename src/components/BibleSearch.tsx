'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, BookOpen } from 'lucide-react'
import DigDeeper from './DigDeeper'

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

export default function BibleSearch() {
  const [passage, setPassage] = useState('')
  const [loading, setLoading] = useState(false)
  const [bibleData, setBibleData] = useState<BibleResponse | null>(null)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
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
    <div className="w-full max-w-4xl mx-auto">
      {/* Search Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200/10 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 rounded-xl shadow-lg p-6 mb-8"
      >
        <div className="flex flex-col gap-1">
          <form
            onSubmit={handleSearch}
            className="flex lg:flex-row flex-col gap-3">
            <div className="flex w-full">
              <input
                id="passage"
                type="search"
                value={passage}
                onChange={(e) => setPassage(e.target.value)}
                placeholder="ex: John 3:16 or John 3:16-20 or John 3:16-20,25,32"
                className="bg-white dark:bg-gray-600 w-full px-4 py-3 border border-gray-600 dark:border-gray-400/60 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-transparent dark:text-white"
                disabled={loading}
              />
            </div>
            <div className="flex items-end">
              <button
                type='submit'
                disabled={loading || !passage.trim()}
                className="w-full font-light whitespace-nowrap px-3 justify-center items-center py-3.5 bg-orange-500 text-white rounded-lg cursor-pointer hover:bg-orange-600 focus:ring-1 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex gap-2 transition-colors"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <BookOpen className="w-5 h-5" />
                )}
                {loading ? 'Searching...' : 'Show Passage'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6"
        >
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </motion.div>
      )}

      {/* Results */}
      {bibleData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6"
        >
          {/* Header Info */}
          <div className="mb-6">
            <div className="flex justify-between md:gap-0 gap-4 items-center mb-2">
              <h3 className="text-xl">
                <span className="text-gray-800 dark:text-gray-200 font-light md:text-lg text-base">{bibleData.reference ? 'Passage from the book of ' : ''}</span>
                <span className="text-orange-500 dark:text-orange-400 font-bold md:text-lg text-base">{bibleData.reference}</span>
              </h3>
              <DigDeeper BibleData={bibleData} />
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            {bibleData.verses.map((verse, index) => (
              <motion.div
                key={`${verse.book_id}-${verse.chapter}-${verse.verse}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex gap-2 items-start mb-2"
              >
                <p className="text-lg text-orange-500 dark:text-orange-400 font-light italic"><sup>{verse.verse}</sup></p>
                <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed">{verse.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
