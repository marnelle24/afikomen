'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Power, Moon, Sun, LayoutDashboard, UserCircle } from 'lucide-react'
import TokenDisplay from './TokenDisplay'

export default function Header() {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className="bg-transparent py-4">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex lg:items-center gap-3 pt-5 cursor-pointer">
            <Image 
              src="/afikomen.png" 
              alt="Afikomen Logo" 
              width={120}
              height={40}
              className="object-contain"
            />
          </Link>
          
          {user && (
            <div className="flex lg:flex-row flex-col lg:gap-0 gap-4 items-center space-x-2 lg:space-x-4">
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="cursor-pointer flex items-center space-x-1 text-sm text-slate-600 dark:text-slate-200 hover:text-orange-400 dark:hover:text-orange-300 transition-colors"
                  title="Dashboard"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span className="hidden lg:block">Dashboard</span>
                </Link>

                <Link
                  href="/profile"
                  className="cursor-pointer flex items-center space-x-1 text-sm text-slate-600 dark:text-slate-200 hover:text-orange-400 dark:hover:text-orange-300 transition-colors"
                  title="Profile"
                >
                  <UserCircle className="h-5 w-5" />
                  <span className="hidden lg:block">Profile</span>
                </Link>

                <button
                  type="button"
                  onClick={toggleTheme}
                  className="cursor-pointer rounded-md text-slate-600 dark:text-slate-200 hover:text-orange-400 dark:hover:text-orange-300 transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                
                <button
                  type="button"
                  onClick={logout}
                  className="cursor-pointer text-sm text-slate-600 dark:text-slate-200 hover:text-orange-400 dark:hover:text-orange-300 transition-colors"
                  title="Logout"
                >
                  <Power className="h-5 w-5" />
                </button>
              </div>
              <TokenDisplay />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
