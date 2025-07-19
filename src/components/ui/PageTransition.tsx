'use client'

import React, { useState, useEffect } from 'react'
import { LoadingSpinner } from './loading'

interface PageTransitionProps {
  isLoading: boolean
  error?: string | null
  children: React.ReactNode
  loadingMessage?: string
  errorTitle?: string
  onRetry?: () => void
}

/**
 * Page transition component that handles loading states and prevents
 * layout shift during page transitions
 */
export function PageTransition({
  isLoading,
  error,
  children,
  loadingMessage = "Loading...",
  errorTitle = "Something went wrong",
  onRetry
}: PageTransitionProps) {
  const [showContent, setShowContent] = useState(!isLoading)

  useEffect(() => {
    if (!isLoading) {
      // Small delay to prevent flash of content
      const timeout = setTimeout(() => setShowContent(true), 50)
      return () => clearTimeout(timeout)
    } else {
      setShowContent(false)
    }
  }, [isLoading])

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{errorTitle}</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-[#F15029] text-white rounded-lg hover:bg-[#D13D1A] transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">{loadingMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`transition-opacity duration-300 ${showContent ? 'opacity-100' : 'opacity-0'}`}
    >
      {children}
    </div>
  )
}