'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface RegisterFormProps {
  onToggleMode: () => void
}

export default function RegisterForm({ onToggleMode }: RegisterFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate password match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        login(data.token, data.user)
      } else {
        setError(data.error || 'Registration failed')
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
          <label htmlFor="name" className="font-thin block text-sm text-slate-600 dark:text-slate-200">
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-400 focus:border-orange-400 bg-white dark:bg-gray-700 text-slate-600 dark:text-slate-200"
          />
        </div>

        <div>
          <label htmlFor="email" className="font-thin block text-sm text-slate-600 dark:text-slate-200">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email Address"
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
            placeholder="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-400 focus:border-orange-400 bg-white dark:bg-gray-700 text-slate-600 dark:text-slate-200"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="font-thin block text-sm text-slate-600 dark:text-slate-200">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-400 focus:border-orange-400 bg-white dark:bg-gray-700 text-slate-600 dark:text-slate-200"
          />
        </div>

        {error && (
          <div className="text-red-400 dark:text-red-300 text-xs border border-red-300 dark:border-red-300 rounded-md p-3 bg-red-100 dark:bg-red-900/20">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer w-full flex font-regular hover:-translate-y-0.5 duration-300 uppercase tracking-widest justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm text-white bg-orange-400 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <div className="mt-16 text-center">
        <button
          onClick={onToggleMode}
          className="font-thin text-orange-400 cursor-pointer dark:text-orange-400 duration-300 transition-colors hover:text-orange-500 dark:hover:text-orange-200 text-sm"
        >
          Already have an account? Sign in
        </button>
      </div>
    </div>
  )
}
