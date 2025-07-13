'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { LoadingPage } from '@/components/ui/loading'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import PhotoUpload from '@/components/dashboard/PhotoUpload'
import RestaurantHours from '@/components/dashboard/RestaurantHours'
import { Button } from '@/components/ui/button'
import { MapPin, Phone, Mail, Globe } from 'lucide-react'

export default function RestaurantPage() {
  const { user, loading, isAuthenticated, isVendor, hasRestaurant } = useAuth()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState(tabParam || 'profile')
  
  // Update activeTab when URL param changes
  useEffect(() => {
    if (tabParam && ['profile', 'photos', 'hours'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  if (loading) {
    return <LoadingPage message="Loading restaurant profile..." />
  }

  if (!isAuthenticated || !isVendor || !hasRestaurant) {
    return <div>Access denied</div>
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Restaurant Profile
        </h2>
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'photos'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Photos
            </button>
            <button
              onClick={() => setActiveTab('hours')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'hours'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Hours & Availability
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Restaurant Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  defaultValue={user?.restaurant?.name || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cuisine Type
                </label>
                <input
                  type="text"
                  defaultValue={user?.restaurant?.cuisine_type || ''}
                  placeholder="e.g., West African, Ethiopian, Nigerian"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  defaultValue={user?.restaurant?.description || ''}
                  placeholder="Tell customers about your restaurant, specialties, and what makes you unique..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Address
                </label>
                <input
                  type="text"
                  defaultValue={user?.restaurant?.address || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  defaultValue={user?.restaurant?.phone || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  defaultValue={user?.restaurant?.email || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Globe className="w-4 h-4 inline mr-1" />
                  Website (Optional)
                </label>
                <input
                  type="url"
                  defaultValue={user?.restaurant?.special_notes || ''}
                  placeholder="https://yourrestaurant.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button variant="hoppn">
                Save Changes
              </Button>
            </div>
          </div>
        )}
        
        {activeTab === 'photos' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <PhotoUpload
              restaurantId={user?.restaurant?.id || ''}
              currentPhotos={user?.restaurant?.gallery_images || []}
              onSuccess={(photos) => {
                console.log('Photos updated:', photos)
                // Optionally refresh the page or update state
              }}
            />
          </div>
        )}
        
        {activeTab === 'hours' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <RestaurantHours
              restaurantId={user?.restaurant?.id || ''}
              currentHours={user?.restaurant?.business_hours ? 
                Object.entries(user.restaurant.business_hours as Record<string, any>).map(([day, hours]: [string, any]) => ({
                  day: day.charAt(0).toUpperCase() + day.slice(1),
                  isOpen: hours.open !== null,
                  openTime: hours.open || '09:00',
                  closeTime: hours.close || '21:00'
                })) : undefined
              }
              onSuccess={(hours) => {
                console.log('Hours updated:', hours)
                // Optionally refresh the page or update state
              }}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
