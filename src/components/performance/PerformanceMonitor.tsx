'use client'

import { useEffect, useRef } from 'react'

interface LayoutShiftEntry extends PerformanceEntry {
  value: number
  hadRecentInput: boolean
}

interface PerformanceMemory {
  usedJSHeapSize: number
  totalJSHeapSize: number
  jsHeapSizeLimit: number
}

interface PerformanceWithMemory extends Performance {
  memory?: PerformanceMemory
}

interface PerformanceMetrics {
  pageLoadTime: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
  firstInputDelay: number
  timeToInteractive: number
}

interface PerformanceMonitorProps {
  enabled?: boolean
  onMetrics?: (metrics: Partial<PerformanceMetrics>) => void
}

/**
 * Performance monitoring component that tracks Core Web Vitals
 * and other performance metrics for optimization insights
 */
export function PerformanceMonitor({ 
  enabled = process.env.NODE_ENV === 'development',
  onMetrics 
}: PerformanceMonitorProps) {
  const metricsRef = useRef<Partial<PerformanceMetrics>>({})
  const observerRef = useRef<PerformanceObserver | null>(null)

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    // Track page load time
    const trackPageLoad = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigation) {
        const pageLoadTime = navigation.loadEventEnd - navigation.fetchStart
        metricsRef.current.pageLoadTime = pageLoadTime
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`📊 Page Load Time: ${pageLoadTime.toFixed(2)}ms`)
        }
      }
    }

    // Track Core Web Vitals
    const trackWebVitals = () => {
      // First Contentful Paint
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
            metricsRef.current.firstContentfulPaint = entry.startTime
            
            if (process.env.NODE_ENV === 'development') {
              console.log(`🎨 First Contentful Paint: ${entry.startTime.toFixed(2)}ms`)
            }
          }
        }
      })

      observer.observe({ entryTypes: ['paint'] })
      observerRef.current = observer

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        
        if (lastEntry) {
          metricsRef.current.largestContentfulPaint = lastEntry.startTime
          
          if (process.env.NODE_ENV === 'development') {
            console.log(`🖼️ Largest Contentful Paint: ${lastEntry.startTime.toFixed(2)}ms`)
          }
        }
      })

      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

      // Cumulative Layout Shift
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as LayoutShiftEntry[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        }
        
        metricsRef.current.cumulativeLayoutShift = clsValue
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`📐 Cumulative Layout Shift: ${clsValue.toFixed(4)}`)
        }
      })

      clsObserver.observe({ entryTypes: ['layout-shift'] })

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as PerformanceEventTiming[]) {
          const delay = entry.processingStart - entry.startTime
          metricsRef.current.firstInputDelay = delay
          
          if (process.env.NODE_ENV === 'development') {
            console.log(`⚡ First Input Delay: ${delay.toFixed(2)}ms`)
          }
        }
      })

      fidObserver.observe({ entryTypes: ['first-input'] })
    }

    // Track memory usage (if available)
    const trackMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as PerformanceWithMemory).memory
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`🧠 Memory Usage:`, {
            used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
            total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
            limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`
          })
        }
      }
    }

    // Track resource loading times
    const trackResourceTiming = () => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
      const slowResources = resources.filter(resource => resource.duration > 100)
      
      if (slowResources.length > 0 && process.env.NODE_ENV === 'development') {
        console.log('🐌 Slow loading resources (>100ms):', 
          slowResources.map(r => ({
            name: r.name.split('/').pop(),
            duration: `${r.duration.toFixed(2)}ms`,
            size: r.transferSize ? `${(r.transferSize / 1024).toFixed(2)}KB` : 'unknown'
          }))
        )
      }
    }

    // Initialize tracking
    trackPageLoad()
    trackWebVitals()
    trackMemoryUsage()
    trackResourceTiming()

    // Send metrics to callback after page load
    const sendMetrics = () => {
      onMetrics?.(metricsRef.current)
      
      if (process.env.NODE_ENV === 'development') {
        console.log('📈 Performance Summary:', metricsRef.current)
      }
    }

    // Send metrics after a delay to ensure all are collected
    const timeoutId = setTimeout(sendMetrics, 3000)

    return () => {
      clearTimeout(timeoutId)
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [enabled, onMetrics])

  // Performance warnings in development
  useEffect(() => {
    if (!enabled || process.env.NODE_ENV !== 'development') return

    const checkPerformance = () => {
      const { pageLoadTime, largestContentfulPaint, cumulativeLayoutShift } = metricsRef.current

      if (pageLoadTime && pageLoadTime > 2000) {
        console.warn('⚠️ Slow page load detected:', `${pageLoadTime.toFixed(2)}ms > 2000ms`)
      }

      if (largestContentfulPaint && largestContentfulPaint > 2500) {
        console.warn('⚠️ Poor LCP detected:', `${largestContentfulPaint.toFixed(2)}ms > 2500ms`)
      }

      if (cumulativeLayoutShift && cumulativeLayoutShift > 0.1) {
        console.warn('⚠️ High layout shift detected:', `${cumulativeLayoutShift.toFixed(4)} > 0.1`)
      }
    }

    const timeoutId = setTimeout(checkPerformance, 5000)
    return () => clearTimeout(timeoutId)
  }, [enabled])

  return null // This component doesn't render anything
}

// Hook for manual performance tracking
export function usePerformanceTracking() {
  const markStart = (name: string) => {
    performance.mark(`${name}-start`)
  }

  const markEnd = (name: string) => {
    performance.mark(`${name}-end`)
    performance.measure(name, `${name}-start`, `${name}-end`)
    
    const measure = performance.getEntriesByName(name)[0]
    if (measure && process.env.NODE_ENV === 'development') {
      console.log(`⏱️ ${name}: ${measure.duration.toFixed(2)}ms`)
    }
    
    return measure?.duration || 0
  }

  const trackAsync = async <T,>(name: string, fn: () => Promise<T>): Promise<T> => {
    markStart(name)
    try {
      const result = await fn()
      markEnd(name)
      return result
    } catch (error) {
      markEnd(name)
      throw error
    }
  }

  return { markStart, markEnd, trackAsync }
}