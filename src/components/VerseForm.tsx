'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface VerseFormProps {
  onVerseProcessed: (data: {
    reference: string;
    version: string;
    insight: {
      verse_content: string;
      context: string;
      modern_reflection: string;
      weekly_action_plan: Array<{ title: string; action: string }>;
      short_prayer: string;
    };
  }) => void
}

interface BibleVersion {
  value: string;
  label: string;
}

const BIBLE_VERSIONS: readonly BibleVersion[] = [
  { value: 'NIV', label: 'New International Version (NIV)' },
  { value: 'KJV', label: 'King James Version (KJV)' },
  { value: 'NKJV', label: 'New King James Version (NKJV)' },
  { value: 'NLV', label: 'New Living Version (NLV)' },
  { value: 'ESV', label: 'English Standard Version (ESV)' },
  { value: 'NLT', label: 'New Living Translation (NLT)' },
  { value: 'NASB', label: 'New American Standard Bible (NASB)' },
  { value: 'NET', label: 'New English Translation (NET)' },
] as const

export default function VerseForm({ onVerseProcessed }: VerseFormProps) {
  const [reference, setReference] = useState('')
  const [version, setVersion] = useState(BIBLE_VERSIONS[0].value)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { token } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/verse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ reference, version }),
      })

      const data = await response.json()

      if (response.ok) {
        onVerseProcessed(data.data)
        setReference('')
      } else {
        setError(data.error || 'Failed to process verse')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-100 dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
      <h2 className="text-2xl font-bold text-slate-600 dark:text-slate-200 mb-6">Explore the word of God</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="reference" className="block text-sm font-medium text-slate-600 dark:text-slate-200 mb-2">
              Bible Verse
            </label>
            <input
              id="reference"
              type="text"
              required
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g., John 3:16, john 3 16, or John chapter 3 verse 16"
              className="w-full px-3 py-2 text-xl font-light placeholder:font-light placeholder:text-sm border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-400 focus:border-orange-400 bg-white dark:bg-gray-700 text-slate-600 dark:text-slate-200"
            />
          </div>

          <div className="w-full sm:w-64">
            <label htmlFor="version" className="block text-sm font-medium text-slate-600 dark:text-slate-200 mb-2">
              Version
            </label>
            <select
              id="version"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="w-full px-3 py-3 text-md font-light border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-400 focus:border-orange-400 bg-white dark:bg-gray-700 text-slate-600 dark:text-slate-200"
            >
              {BIBLE_VERSIONS.map((v) => (
                <option key={v.value} value={v.value}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-auto sm:self-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2 font-thin drop-shadow-md text-xl border border-transparent rounded-md shadow-sm cursor-pointer disabled:cursor-not-allowed text-white bg-orange-400 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Processing...' : 'Reveal the word'}
            </button>
          </div>
        </div>

        {error && (
          <div className="text-orange-400 dark:text-orange-300 text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
            {error}
          </div>
        )}
      </form>
    </div>
  )
}
