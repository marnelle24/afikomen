'use client'

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function DebugAuth() {
  const { user, token, tokenInfo, loading } = useAuth()

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div>Loading: {loading ? 'true' : 'false'}</div>
      <div>User: {user ? 'exists' : 'null'}</div>
      <div>Token: {token ? 'exists' : 'null'}</div>
      <div>TokenInfo: {tokenInfo ? 'exists' : 'null'}</div>
      {user && (
        <div className="mt-2">
          <div>ID: {user.id}</div>
          <div>Email: {user.email}</div>
          <div>Token Balance: {user.tokenBalance}</div>
        </div>
      )}
      {tokenInfo && (
        <div className="mt-2">
          <div>Remaining: {tokenInfo.remainingTokens}</div>
          <div>Used: {tokenInfo.tokensUsed}</div>
        </div>
      )}
    </div>
  )
}
