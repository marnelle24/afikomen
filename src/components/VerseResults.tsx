'use client'

import React, { useState } from 'react'
import { Copy, Check, BookOpen, Heart, Target, Sparkles } from 'lucide-react'

interface VerseInsight {
  verse_content: string
  context: string
  modern_reflection: string
  weekly_action_plan: Array<{
    title: string
    action: string
  }>
  short_prayer: string
}

interface VerseResultsProps {
  reference: string
  version: string
  insight: VerseInsight
}

export default function VerseResults({ reference, insight }: VerseResultsProps) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const [copiedItems, setCopiedItems] = useState<{ [key: string]: boolean }>({})

  const copyToClipboard = async (text: string, itemKey: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItems(prev => ({ ...prev, [itemKey]: true }))
      setTimeout(() => {
        setCopiedItems(prev => ({ ...prev, [itemKey]: false }))
      }, 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const formatActionPlan = () => {
    const formattedPlan = insight.weekly_action_plan
      .map((day, index) => `${days[index]}: ${day.title}\n${day.action}`)
      .join('\n\n')
    return `${reference}\n\n7-Day Action Plan:\n\n${formattedPlan}`
  }

  const formatVerseContent = () => {
    const content = insight.verse_content
    
    // Pattern to match verse numbers at the beginning of sentences or standalone
    // Matches: "1 Text", "¹Text", " 1 Text", etc.
    const versePattern = /(\s|^)(\d+)(\s+)/g
    
    // Split content by verse numbers
    const parts = content.split(versePattern).filter(part => part && part.trim())
    
    const formatted: React.ReactElement[] = []
    let i = 0
    
    while (i < parts.length) {
      const part = parts[i]
      
      // Check if this part is a number (verse number)
      if (/^\d+$/.test(part.trim())) {
        const verseNum = part.trim()
        const verseText = parts[i + 1] || ''
        
        formatted.push(
          <span key={i} className="inline">
            <sup className="text-sm font-semibold text-white/90 mr-0.5">{verseNum}</sup>
            {verseText}
          </span>
        )
        i += 2 // Skip the next part as we've already used it
      } else {
        formatted.push(<span key={i}>{part}</span>)
        i++
      }
    }
    
    return formatted.length > 0 ? formatted : [<span key="0">{content}</span>]
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Verse Content - Hero Section */}
      <div className="relative group overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-500 to-indigo-700 dark:from-indigo-600 dark:via-indigo-500 dark:to-indigo-500 rounded-2xl p-8 text-indigo-50 shadow-2xl transition-all duration-300 hover:shadow-3xl">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-6 w-6 text-white" />
            <h3 className="text-2xl font-bold drop-shadow-lg">{reference}</h3>
          </div>
          <p className="text-md leading-relaxed font-light drop-shadow-md">
            &ldquo;{formatVerseContent()}&rdquo;
          </p>
        </div>
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      {/* Context Section */}
      <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-start gap-4">
          <BookOpen className="h-6 w-6 mt-1 text-blue-600 dark:text-blue-400" />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-100 mb-3 flex items-center gap-2">
              Context
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-light">{insight.context}</p>
          </div>
        </div>
      </div>

      {/* Modern Reflection Section */}
      <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start gap-4 flex-1">
            <Heart className="h-6 w-6 mt-1 text-rose-600 dark:text-rose-400" />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-100 mb-3">
                Reflection
              </h3>
            </div>
          </div>
          <button
            onClick={() => copyToClipboard(`${reference}\n\nReflection:\n\n${insight.modern_reflection}`, 'reflection')}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-all duration-200 font-medium shadow-sm hover:shadow"
          >
            {copiedItems.reflection ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </button>
        </div>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-light ml-10">{insight.modern_reflection}</p>
      </div>

      {/* Weekly Action Plan Section */}
      <div className="group bg-gradient-to-br from-slate-50 to-orange-50/30 dark:from-gray-800 dark:to-orange-900/10 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <Target className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-100">
              7-Day Action Plan
            </h3>
          </div>
          <button
            onClick={() => copyToClipboard(formatActionPlan(), 'actionPlan')}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-all duration-200 font-medium shadow-sm hover:shadow"
          >
            {copiedItems.actionPlan ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-1 gap-4">
          {insight.weekly_action_plan.map((day, index) => (
            <div 
              key={index} 
              className="group/day bg-white dark:bg-gray-700 border-l-4 border-orange-500 dark:border-orange-400 rounded-lg p-5 hover:shadow-lg transition-all duration-300 hover:translate-x-2"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 dark:from-orange-500 dark:to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md group-hover/day:scale-110 transition-transform duration-300">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-2 uppercase tracking-wider">
                    {days[index]}
                  </div>
                  <h4 className="font-bold text-slate-700 dark:text-slate-100 text-base mb-2">{day.title}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-light leading-relaxed">{day.action}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prayer Section */}
      <div className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl duration-300 hover:-translate-y-1">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-4">
              <Heart className="h-6 w-6 mt-1 text-amber-700 dark:text-amber-100" />
              <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100">
                Prayer
              </h3>
            </div>
            <button
              onClick={() => copyToClipboard(`${reference}\n\nPrayer:\n\n"${insight.short_prayer}"`, 'prayer')}
              className="cursor-pointer flex items-center gap-2 px-4 py-2 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-all duration-200 font-medium shadow-sm hover:shadow"
            >
              {copiedItems.prayer ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </button>
          </div>
          <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-lg p-5">
            <p className="text-lg text-amber-900 dark:text-amber-50 leading-relaxed font-light italic">&ldquo;{insight.short_prayer}&rdquo;</p>
          </div>
        </div>
      </div>
    </div>
  )
}
