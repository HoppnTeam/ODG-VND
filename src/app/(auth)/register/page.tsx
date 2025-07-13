'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  vendorRegistrationSchema,
  VendorRegistrationFormData
} from '@/lib/validation'
import { VendorRegistrationForm } from '@/components/forms/vendor-registration-form'
import { LoadingButton } from '@/components/ui/loading'
import { dbHelpers, authHelpers, supabaseAdmin } from '@/lib/supabase'
import type { Database } from '@/types/supabase'

export default function RegisterPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Single form for vendor registration
  const form = useForm<VendorRegistrationFormData>({
    resolver: zodResolver(vendorRegistrationSchema),
    mode: 'onChange'
  })

  const handleSubmit = async () => {
    // Validate form
    const isValid = await form.trigger()
    if (!isValid) {
      setSubmitError('Please complete all required fields')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const formData = form.getValues()
      const { email, password, ...vendorData } = formData

      // Use API route to handle registration server-side
      const response = await fetch('/api/register-vendor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          vendorData
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to register vendor')
      }

      // Redirect to success page
      router.push('/register/success')
    } catch (error: any) {
      console.error('Registration error:', error)
      setSubmitError(error.message || 'Failed to submit registration. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center">
              <img 
                src="/logo.png" 
                alt="Hoppn Logo" 
                className="h-10 w-auto" 
              />
              <span className="ml-2 text-2xl font-bold text-orange-600">Hoppn</span>
            </Link>
            <Link 
              href="/login" 
              className="text-orange-600 hover:text-orange-800 font-medium"
            >
              Already approved vendor? Sign in
            </Link>
          </div>

          {/* Registration Info */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Vendor Registration</h2>
            <p className="text-sm text-gray-600">
              Submit your application below for review. Once approved by our admin team, 
              you'll receive login credentials to access your vendor dashboard.
            </p>
          </div>

          {/* Form content */}
          <div>
            <VendorRegistrationForm form={form} />
          </div>

          {/* Error message */}
          {submitError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{submitError}</p>
            </div>
          )}

          {/* Submit button */}
          <div className="mt-8 flex justify-end">
            <LoadingButton
              onClick={handleSubmit}
              loading={isSubmitting}
              loadingText="Submitting..."
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Submit Application
            </LoadingButton>
          </div>
        </div>
      </div>
    </div>
  )
}