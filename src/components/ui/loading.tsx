import * as React from "react"
import { cn } from "@/lib/utils"

// Loading spinner component
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'white'
  className?: string
}

export function LoadingSpinner({ size = 'md', color = 'primary', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  const colorClasses = {
    primary: 'text-hoppn-primary',
    secondary: 'text-hoppn-secondary',
    white: 'text-white'
  }

  return (
    <div className={cn("animate-spin", sizeClasses[size], colorClasses[color], className)}>
      <svg className="w-full h-full" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  )
}

// Loading skeleton component
interface LoadingSkeletonProps {
  className?: string
}

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={cn("animate-pulse bg-gray-200 rounded", className)} />
  )
}

// Loading card skeleton
export function LoadingCardSkeleton() {
  return (
    <div className="hoppn-card p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <LoadingSkeleton className="h-4 w-24" />
        <LoadingSkeleton className="h-4 w-4 rounded-full" />
      </div>
      <LoadingSkeleton className="h-8 w-32 mb-2" />
      <LoadingSkeleton className="h-3 w-20" />
    </div>
  )
}

// Loading table skeleton
export function LoadingTableSkeleton({ rows = 5, columns = 4 }: { rows?: number, columns?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4 p-4 border rounded-lg">
          {Array.from({ length: columns }).map((_, j) => (
            <LoadingSkeleton key={j} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

// Loading overlay component
interface LoadingOverlayProps {
  show: boolean
  message?: string
  children?: React.ReactNode
}

export function LoadingOverlay({ show, message = "Loading...", children }: LoadingOverlayProps) {
  if (!show) return <>{children}</>

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-white bg-opacity-75 z-10 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-2 text-sm text-gray-600">{message}</p>
        </div>
      </div>
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
    </div>
  )
}

// Loading button component
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  loadingText?: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
}

export function LoadingButton({ 
  loading = false, 
  loadingText = "Loading...", 
  variant = 'primary',
  children,
  className,
  disabled,
  ...props 
}: LoadingButtonProps) {
  const baseClasses = "hoppn-button flex items-center justify-center gap-2"
  const variantClasses = {
    primary: "hoppn-button-primary",
    secondary: "hoppn-button-secondary",
    outline: "hoppn-button-outline",
    ghost: "hoppn-button-ghost"
  }

  return (
    <button
      className={cn(baseClasses, variantClasses[variant], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" color={variant === 'primary' ? 'white' : 'primary'} />}
      {loading ? loadingText : children}
    </button>
  )
}

// Loading page component
export function LoadingPage({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-lg text-gray-600">{message}</p>
      </div>
    </div>
  )
}