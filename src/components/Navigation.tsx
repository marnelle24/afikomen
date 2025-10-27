'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Power, Moon, Sun, LayoutDashboard, UserCircle, LogIn } from 'lucide-react'

export default function Navigation() {
  const { user, logout, loading } = useAuth()
  const { isDark, toggleTheme } = useTheme()

  return (
    <div className="flex items-center space-x-4">
      {/* Dark Theme Toggle - Always visible */}
      <button
        type="button"
        onClick={toggleTheme}
        className="cursor-pointer rounded-md text-slate-600 dark:text-slate-200 hover:text-orange-400 dark:hover:text-orange-300 transition-colors"
        aria-label="Toggle dark mode"
      >
        {isDark ? <Sun className="lg:h-5 lg:w-5 h-7 w-7" /> : <Moon className="lg:h-5 lg:w-5 h-7 w-7" />}
      </button>

      {/* Show loading state while auth is initializing */}
      {loading ? (
        <div className="flex items-center space-x-1 text-sm text-slate-400 dark:text-slate-500">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-400"></div>
          <span className="hidden lg:block">Loading...</span>
        </div>
      ) : user ? (
        // Authenticated User Navigation
        <>
          <Link
            href="/dashboard"
            className="cursor-pointer flex items-center space-x-1 text-sm text-slate-600 dark:text-slate-200 hover:text-orange-400 dark:hover:text-orange-300 transition-colors"
            title="Dashboard"
          >
            <LayoutDashboard className="lg:h-5 lg:w-5 h-7 w-7" />
            <span className="hidden lg:block">Dashboard</span>
          </Link>

          <Link
            href="/profile"
            className="cursor-pointer flex items-center space-x-1 text-sm text-slate-600 dark:text-slate-200 hover:text-orange-400 dark:hover:text-orange-300 transition-colors"
            title="Profile"
          >
            <UserCircle className="lg:h-5 lg:w-5 h-7 w-7" />
            <span className="hidden lg:block">Profile</span>
          </Link>

          <button
            type="button"
            onClick={logout}
            className="cursor-pointer text-sm text-slate-600 dark:text-slate-200 hover:text-orange-400 dark:hover:text-orange-300 transition-colors"
            title="Logout"
          >
            <Power className="lg:h-5 lg:w-5 h-7 w-7" />
          </button>
        </>
      ) : (
        // Non-authenticated User Navigation
        <Link
          href="/login"
          className="cursor-pointer flex items-center space-x-1 text-sm text-slate-600 dark:text-slate-200 hover:text-orange-400 dark:hover:text-orange-300 transition-colors"
          title="Login"
        >
          <LogIn className="lg:h-5 lg:w-5 h-7 w-7" />
          <span className="hidden lg:block">Login</span>
        </Link>
      )}
    </div>
  )
}
