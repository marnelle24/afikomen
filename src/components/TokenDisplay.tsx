'use client'

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Coins } from 'lucide-react'

export default function TokenDisplay() {
  const { tokenInfo } = useAuth()

  if (!tokenInfo) return null

  const { tokensUsed, tokenBalance } = tokenInfo

  const formatTokenNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace('.0', '') + 'K'
    }
    return num.toString()
  }

  return (
    <div className="flex items-center shadow drop-shadow space-x-2 bg-gradient-to-r from-orange-100 via-orange-50 to-amber-100 dark:from-orange-800/50 dark:via-orange-700/50 dark:to-amber-400/50 dark:shadow-md dark:shadow-orange-800/20 rounded-lg px-3 py-2">
      <Coins className="h-4 w-4 text-orange-400 drop-shadow dark:text-orange-400" />
      <div className="text-xs">
        <div className="font-light tracking-widest text-[11px] text-orange-800 dark:text-orange-200">
           {formatTokenNumber(tokensUsed)}/{formatTokenNumber(tokenBalance)} TOKENS
        </div>
      </div>
    </div>
  )
}
