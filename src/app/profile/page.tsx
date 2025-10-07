'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { User, Lock, Save } from 'lucide-react'

export default function ProfilePage() {
  const { user, token, loading } = useAuth()
  const router = useRouter()
  const [name, setName] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
    if (user) {
      setName(user.name || '')
    }
  }, [user, loading, router])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Profile updated successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data.error || 'Failed to update profile')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      setSaving(false)
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      setSaving(false)
      return
    }

    try {
      const response = await fetch('/api/auth/update-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Password updated successfully!')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data.error || 'Failed to update password')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-400"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-600 dark:text-slate-200 mb-8">Profile Settings</h1>

            {success && (
              <div className="mb-6 text-green-600 dark:text-green-400 text-sm border border-green-300 dark:border-green-300 rounded-md p-3 bg-green-100 dark:bg-green-900/20">
                {success}
              </div>
            )}

            {error && (
              <div className="mb-6 text-red-400 dark:text-red-300 text-sm border border-red-300 dark:border-red-300 rounded-md p-3 bg-red-100 dark:bg-red-900/20">
                {error}
              </div>
            )}

            {/* Profile Information */}
            <div className="bg-slate-100 dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
              <h2 className="text-xl font-bold text-slate-600 dark:text-slate-200 mb-6 flex items-center">
                <User className="h-5 w-5 mr-2 text-orange-400" />
                Profile Information
              </h2>
              
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-slate-600 dark:text-slate-200 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-gray-100 dark:bg-gray-700/50 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Email address cannot be changed</p>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-slate-600 dark:text-slate-200 mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-400 focus:border-orange-400 bg-white dark:bg-gray-700 text-slate-600 dark:text-slate-200"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="cursor-pointer flex items-center justify-center gap-2 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-light text-white bg-orange-400 hover:bg-orange-500 hover:-translate-y-0.5 duration-300 transition-all uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </form>
            </div>

            {/* Change Password */}
            <div className="bg-slate-100 dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-slate-600 dark:text-slate-200 mb-6 flex items-center">
                <Lock className="h-5 w-5 mr-2 text-orange-400" />
                Change Password
              </h2>
              
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-bold text-slate-600 dark:text-slate-200 mb-2">
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-400 focus:border-orange-400 bg-white dark:bg-gray-700 text-slate-600 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-bold text-slate-600 dark:text-slate-200 mb-2">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-400 focus:border-orange-400 bg-white dark:bg-gray-700 text-slate-600 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label htmlFor="confirmNewPassword" className="block text-sm font-bold text-slate-600 dark:text-slate-200 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmNewPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-400 focus:border-orange-400 bg-white dark:bg-gray-700 text-slate-600 dark:text-slate-200"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="cursor-pointer flex items-center justify-center gap-2 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-light text-white bg-orange-400 hover:bg-orange-500 hover:-translate-y-0.5 duration-300 transition-all uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 disabled:opacity-50"
                >
                  <Lock className="h-4 w-4" />
                  {saving ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

