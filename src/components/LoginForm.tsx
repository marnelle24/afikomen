'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface LoginFormProps {
  onToggleMode: () => void
}

export default function LoginForm({ onToggleMode }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        await login(data.token, data.user)
        router.push('/dashboard')
      } else {
        setError(data.error || 'Login failed')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="font-thin block text-sm text-slate-600 dark:text-slate-200">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-400 focus:border-orange-400 bg-white dark:bg-gray-700 text-slate-600 dark:text-slate-200"
          />
        </div>

        <div>
          <label htmlFor="password" className="font-thin block text-sm text-slate-600 dark:text-slate-200">
            Password
          </label>
          <input
            id="password"
            placeholder="Enter your password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-400 focus:border-orange-400 bg-white dark:bg-gray-700 text-slate-600 dark:text-slate-200"
          />
        </div>

        {error && (
          <div className="text-orange-400 dark:text-orange-300 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer mt-8 w-full flex font-regular hover:-translate-y-0.5 duration-300 uppercase tracking-widest justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm text-white bg-orange-400 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="mt-12 text-center">
        <button
          type="button"
          onClick={onToggleMode}
          className="font-thin cursor-pointer text-orange-400 dark:text-orange-400 duration-300 transition-colors hover:text-orange-500 dark:hover:text-orange-300 text-sm"
        >
          Don&apos;t have an account? Sign up
        </button>
      </div>
    </div>
  )
}
