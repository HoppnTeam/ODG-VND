'use client'

import Link from 'next/link'
import { CheckCircle, Clock, Mail, Phone } from 'lucide-react'

export default function RegistrationSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Application Submitted Successfully!
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for applying to join Hoppn as a vendor partner.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            {/* What's Next */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">What happens next?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Review Process</p>
                    <p className="text-sm text-gray-600">
                      Our team will review your application within 24-48 hours during business days.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email Notification</p>
                    <p className="text-sm text-gray-600">
                      You&apos;ll receive an email notification once your application is approved or if we need additional information.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FFF7ED' }}>
                    <span className="text-sm font-bold" style={{ color: '#F15029' }}>H</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Dashboard Access</p>
                    <p className="text-sm text-gray-600">
                      Once approved, you&apos;ll get immediate access to your vendor dashboard to set up your menu and start receiving orders.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Application Details</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-600">Application ID:</dt>
                    <dd className="text-sm text-gray-900">HP-APP-{Date.now().toString().slice(-6)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-600">Submitted:</dt>
                    <dd className="text-sm text-gray-900">{new Date().toLocaleDateString()}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-600">Status:</dt>
                    <dd className="text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Under Review
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Questions or Need Help?</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email Support</p>
                    <a href="mailto:vendors@hoppn.com" className="text-sm hover:underline" style={{ color: '#F15029' }}>
                      vendors@hoppn.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone Support</p>
                    <a href="tel:+16125550123" className="text-sm hover:underline" style={{ color: '#F15029' }}>
                      (612) 555-0123
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t pt-6 space-y-3">
              <Link
                href="/"
                className="w-full inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
                style={{ backgroundColor: '#F15029' }}
              >
                Back to Home
              </Link>
              <Link
                href="/login"
                className="w-full inline-flex justify-center items-center px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                style={{ color: '#F15029' }}
              >
                Sign in to Check Status
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}