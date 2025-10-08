'use client'

import React, { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import VerseForm from '@/components/VerseForm'
import VerseResults from '@/components/VerseResults'
import RecentVerses from '@/components/RecentVerses'

interface CopyAllButtonProps {
  reference: string;
  insight: {
    verse_content: string;
    context: string;
    modern_reflection: string;
    weekly_action_plan: Array<{ title: string; action: string }>;
    short_prayer: string;
  };
}

function CopyAllButton({ reference, insight }: CopyAllButtonProps) {
  const [copied, setCopied] = useState(false)

  const copyAllContent = async () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    
    const formattedContent = `${reference}

Verse:
"${insight.verse_content}"

Context:
${insight.context}

Reflection:
${insight.modern_reflection}

7-Day Action Plan:
${insight.weekly_action_plan.map((day, index) => `${days[index]}: ${day.title}\n${day.action}`).join('\n\n')}

Prayer:
"${insight.short_prayer}"`

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

  return (
    <button
      onClick={copyAllContent}
      className="cursor-pointer flex items-center gap-2 px-4 py-2 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-all duration-200 font-medium shadow-sm hover:shadow"
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
  )
}

export default function AppPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [currentResults, setCurrentResults] = useState<{
    reference: string;
    version: string;
    insight: {
      verse_content: string;
      context: string;
      modern_reflection: string;
      weekly_action_plan: Array<{ title: string; action: string }>;
      short_prayer: string;
    };
  } | null>(null)

  // Redirect to auth if not logged in
  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-400"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="px-4 py-6 sm:px-0">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-600 dark:text-slate-200 mb-2">
                Welcome back!
              </h1>
              <p className="text-slate-600 font-light dark:text-slate-200 text-sm lg:text-base">
                Discover deeper meaning of God&apos;s word and be transformed by His amazing grace.
              </p>
            </div>

            <div className="space-y-8">
              <VerseForm onVerseProcessed={setCurrentResults} />
              
              {currentResults && (
                <div className="bg-slate-100 dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-normal text-slate-600 dark:text-slate-200">Your Afikomen</h2>
                    <CopyAllButton 
                      reference={currentResults.reference}
                      insight={currentResults.insight}
                    />
                  </div>
                  <VerseResults
                    reference={currentResults.reference}
                    version={currentResults.version}
                    insight={currentResults.insight}
                  />
                </div>
              )}

              {user && (
                <RecentVerses showTitle={true} limit={3} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

