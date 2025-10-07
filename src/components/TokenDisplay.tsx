'use client'

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Coins } from 'lucide-react'

export default function TokenDisplay() {
  const { tokenInfo } = useAuth()

  if (!tokenInfo) return null

  const { tokensUsed, tokenBalance } = tokenInfo

  return (
    <div className="flex items-center shadow drop-shadow space-x-2 bg-gradient-to-r from-orange-100 via-orange-50 to-amber-100 dark:from-orange-700/20 dark:via-orange-500/20 dark:to-amber-700/20 dark:shadow-md dark:shadow-orange-800/20 dark:border dark:border-orange-800/40 rounded-lg px-3 py-2">
      <Coins className="h-4 w-4 text-orange-400 drop-shadow dark:text-orange-400" />
      <div className="text-xs">
        <div className="font-medium text-orange-800 dark:text-orange-200">
           {tokensUsed}/{tokenBalance} tokens
        </div>
      </div>
    </div>
  )
}
