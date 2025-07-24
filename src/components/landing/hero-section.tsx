'use client'

import { ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="py-20" style={{ background: 'linear-gradient(135deg, #FFF7ED 0%, #FEFCE8 100%)' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Grow Your{" "}
                  <span style={{ color: '#F15029' }}>
                    African Restaurant
                  </span>{" "}
                  with Hoppn
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Join Minnesota&apos;s premier platform for authentic African cuisine. 
                  Connect with customers who appreciate cultural authenticity and 
                  grow your business with our powerful vendor tools.
                </p>
              </div>

              {/* Value Propositions */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Real-time order management</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Cultural storytelling tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Revenue analytics</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Easy payments</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <button 
                    className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-white rounded-lg w-full sm:w-auto transition-all duration-200 hover:shadow-lg"
                    style={{ backgroundColor: '#F15029', fontFamily: 'Open Sans, sans-serif' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D13D1A'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F15029'}
                  >
                    Start Your Restaurant Journey
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                </Link>
                <Link href="/login">
                  <button 
                    className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold rounded-lg w-full sm:w-auto border-2 transition-all duration-200"
                    style={{ 
                      color: '#F15029', 
                      borderColor: '#F15029',
                      backgroundColor: 'transparent',
                      fontFamily: 'Open Sans, sans-serif'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(241, 80, 41, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    Already have an account?
                  </button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-col sm:flex-row gap-6 pt-4">
                <div className="text-center sm:text-left">
                  <div className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>50+</div>
                  <div className="text-sm text-gray-600">African Restaurants</div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>10K+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>$500K+</div>
                  <div className="text-sm text-gray-600">Revenue Generated</div>
                </div>
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Mock Dashboard Preview */}
                <div className="p-4" style={{ background: 'linear-gradient(135deg, #F15029 0%, #FFBF00 100%)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#F15029' }}></div>
                    </div>
                    <div className="text-white font-semibold" style={{ fontFamily: 'Open Sans, sans-serif' }}>Hoppn Vendor Dashboard</div>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Mock metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Today&apos;s Orders</div>
                      <div className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>23</div>
                      <div className="text-sm text-green-600">+15% from yesterday</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Revenue</div>
                      <div className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>$542</div>
                      <div className="text-sm text-green-600">+8% from yesterday</div>
                    </div>
                  </div>

                  {/* Mock order list */}
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-gray-900">Recent Orders</div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#FFF7ED' }}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold" style={{ backgroundColor: '#F15029' }}>
                            J
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">Jollof Rice</div>
                            <div className="text-sm text-gray-600">Sarah Johnson</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>$18.50</div>
                          <div className="text-xs px-2 py-1 rounded" style={{ color: '#F15029', backgroundColor: '#FFF7ED' }}>
                            Preparing
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#EFF6FF' }}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold" style={{ backgroundColor: '#4C8BF5' }}>
                            F
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">Fufu & Soup</div>
                            <div className="text-sm text-gray-600">Mike Thompson</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>$22.00</div>
                          <div className="text-xs px-2 py-1 rounded" style={{ color: '#4C8BF5', backgroundColor: '#EFF6FF' }}>
                            Confirmed
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl">🍛</span>
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-xl">⭐</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}