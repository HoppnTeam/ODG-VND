'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { LoadingButton } from '@/components/ui/loading'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { signIn, loading, error, clearError } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({})

  const validateForm = () => {
    const errors: {[key: string]: string} = {}

    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    if (!validateForm()) {
      return
    }

    const result = await signIn(formData.email, formData.password)

    if (result.success) {
      router.push('/dashboard')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-gray-600">Back to home</span>
          </Link>
          
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F15029 0%, #FFBF00 100%)' }}>
              <span className="text-white font-bold text-lg">H</span>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Sign in to your vendor account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Manage your restaurant and track your orders
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none transition-colors ${
                  formErrors.email 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:border-orange-500'
                }`}
                style={{ height: '44px' }}
                placeholder="Enter your email"
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg shadow-sm focus:outline-none transition-colors ${
                    formErrors.password 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:border-orange-500'
                  }`}
                  style={{ height: '44px' }}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {formErrors.password && (
                <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium hover:underline" style={{ color: '#F15029' }}>
                  Forgot your password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <LoadingButton
              type="submit"
              loading={loading}
              loadingText="Signing in..."
              variant="primary"
              className="w-full h-11 text-white font-semibold rounded-lg transition-all duration-200"
              style={{ backgroundColor: '#F15029' }}
            >
              Sign in
            </LoadingButton>
          </form>

          {/* Register Link */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">New to Hoppn?</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link 
                href="/register" 
                className="font-medium hover:underline"
                style={{ color: '#F15029' }}
              >
                Register your restaurant →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}