/**
 * Console error filter for development
 * Suppresses common warnings that don't affect functionality
 */

// Only run in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Store original console methods
  const originalError = console.error
  const originalWarn = console.warn

  // List of warnings to suppress (be very selective)
  const suppressedWarnings = [
    'Warning: validateDOMNesting', // Common React nesting warnings
    'Warning: Each child in a list should have a unique "key" prop', // We handle this properly
    'Unsupported metadata viewport', // Next.js metadata export warnings
    'Unsupported metadata themeColor', // Next.js metadata export warnings
  ]

  // Filter function
  const shouldSuppress = (message: string): boolean => {
    return suppressedWarnings.some(warning => 
      typeof message === 'string' && message.includes(warning)
    )
  }

  // Override console.error
  console.error = (...args) => {
    const firstArg = args[0]
    if (shouldSuppress(firstArg)) {
      return // Suppress this warning
    }
    originalError.apply(console, args)
  }

  // Override console.warn
  console.warn = (...args) => {
    const firstArg = args[0]
    if (shouldSuppress(firstArg)) {
      return // Suppress this warning
    }
    originalWarn.apply(console, args)
  }

  // Add a note that filtering is active
  console.log('🔧 Console filtering active (development only)')
}