'use client'

import { useState } from 'react'
import { Menu, X } from "lucide-react"
import Link from "next/link"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F15029 0%, #FFBF00 100%)' }}>
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Hoppn
            </span>
            <span className="text-sm text-gray-600 hidden sm:inline">
              Vendor
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-gray-600 transition-colors hover:text-orange-600" style={{ color: '#6B7280' }}>
              Features
            </Link>
            <Link href="#testimonials" className="text-gray-600 transition-colors hover:text-orange-600" style={{ color: '#6B7280' }}>
              Success Stories
            </Link>
            <Link href="#pricing" className="text-gray-600 transition-colors hover:text-orange-600" style={{ color: '#6B7280' }}>
              Pricing
            </Link>
            <Link href="/support" className="text-gray-600 transition-colors hover:text-orange-600" style={{ color: '#6B7280' }}>
              Support
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <button className="px-4 py-2 text-gray-600 hover:text-orange-600 transition-colors" style={{ color: '#6B7280' }}>
                Sign In
              </button>
            </Link>
            <Link href="/register">
              <button className="px-4 py-2 text-white rounded-lg font-semibold transition-all duration-200 hover:shadow-lg" style={{ backgroundColor: '#F15029' }}>
                Get Started
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-orange-600 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-4">
              <Link 
                href="#features" 
                className="text-gray-600 hover:text-orange-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                href="#testimonials" 
                className="text-gray-600 hover:text-orange-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Success Stories
              </Link>
              <Link 
                href="#pricing" 
                className="text-gray-600 hover:text-orange-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                href="/support" 
                className="text-gray-600 hover:text-orange-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Support
              </Link>
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-200">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <button className="w-full text-left px-4 py-2 text-gray-600 hover:text-orange-600 transition-colors" style={{ color: '#6B7280' }}>
                    Sign In
                  </button>
                </Link>
                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                  <button className="w-full px-4 py-2 text-white rounded-lg font-semibold transition-all duration-200" style={{ backgroundColor: '#F15029' }}>
                    Get Started
                  </button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}