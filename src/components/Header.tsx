'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from './Navigation'
import TokenDisplay from './TokenDisplay'

export default function Header() {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  
  // Hide logo on main page (landing page)
  const isMainPage = pathname === '/'

  return (
    <header className="bg-transparent py-4">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className={`flex items-center h-16 ${isMainPage ? 'justify-end' : 'justify-between'}`}>
          {!isMainPage && (
            <Link href="/" className="flex lg:items-center gap-3 pt-5 cursor-pointer">
              <Image 
                src="/afikomen.png" 
                alt="Afikomen Logo" 
                width={120}
                height={40}
                style={{ width: "auto", height: "auto" }}
                className="object-contain"
              />
            </Link>
          )}
          
          <div className="flex lg:flex-row flex-col lg:gap-0 gap-4 items-center space-x-2 lg:space-x-4">
            <Navigation />
            {!loading && user && <TokenDisplay />}
          </div>
        </div>
      </div>
    </header>
  )
}
