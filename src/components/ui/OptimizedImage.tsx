'use client'

import React, { useState, useCallback, useMemo } from 'react'
import Image from 'next/image'

interface OptimizedImageProps {
  src?: string
  alt: string
  width?: number
  height?: number
  className?: string
  fallback?: string
  sizes?: string
  priority?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  onLoad?: () => void
  onError?: () => void
}

/**
 * Optimized Image Component with progressive loading, fallbacks, and performance optimizations
 * Handles lazy loading, blur placeholders, and automatic format optimization
 */
export function OptimizedImage({
  src,
  alt,
  width = 400,
  height = 300,
  className = '',
  fallback = '/images/dish-placeholder.jpg',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  quality = 80,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Generate low-quality blur placeholder
  const generateBlurDataURL = useMemo(() => {
    return (w: number, h: number) => {
      if (typeof document === 'undefined') return ''
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = '#f3f4f6'
        ctx.fillRect(0, 0, w, h)
      }
      return canvas.toDataURL()
    }
  }, [])

  const handleLoad = useCallback(() => {
    setIsLoading(false)
    onLoad?.()
  }, [onLoad])

  const handleError = useCallback(() => {
    setImageError(true)
    setIsLoading(false)
    onError?.()
  }, [onError])

  // If no src provided or error occurred, show fallback
  const imageSrc = imageError || !src ? fallback : src

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {/* Loading skeleton */}
      {isLoading && (
        <div 
          className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]"
          style={{
            animation: 'shimmer 1.5s ease-in-out infinite'
          }}
        />
      )}
      
      {/* Optimized Image */}
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL || generateBlurDataURL(40, 30)}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          objectFit: 'cover',
          width: '100%',
          height: '100%'
        }}
        onLoad={handleLoad}
        onError={handleError}
      />
      
      {/* Error state */}
      {imageError && src && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="text-4xl mb-2">🍽️</div>
            <p className="text-xs text-gray-500">Image not available</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Add shimmer animation to global styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `
  document.head.appendChild(style)
}