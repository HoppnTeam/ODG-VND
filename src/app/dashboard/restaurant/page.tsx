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
      <div className="container mx-auto px-6 py-8" style={{ backgroundColor: 'var(--color-earth-beige)' }}>
        <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif', color: 'var(--color-text-dark)' }}>
          Restaurant Profile
        </h2>
        
        {/* Tab Navigation */}
        <div className="border-b mb-6" style={{ borderColor: 'var(--color-border)' }}>
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className="py-2 px-1 border-b-2 font-medium text-sm transition-colors"
              style={{
                borderColor: activeTab === 'profile' ? 'var(--color-hoppn-orange)' : 'transparent',
                color: activeTab === 'profile' ? 'var(--color-hoppn-orange)' : 'var(--color-text-medium)'
              }}
              onMouseEnter={activeTab !== 'profile' ? (e) => {
                e.currentTarget.style.color = 'var(--color-text-dark)';
                e.currentTarget.style.borderColor = 'var(--color-border)';
              } : undefined}
              onMouseLeave={activeTab !== 'profile' ? (e) => {
                e.currentTarget.style.color = 'var(--color-text-medium)';
                e.currentTarget.style.borderColor = 'transparent';
              } : undefined}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className="py-2 px-1 border-b-2 font-medium text-sm transition-colors"
              style={{
                borderColor: activeTab === 'photos' ? 'var(--color-hoppn-orange)' : 'transparent',
                color: activeTab === 'photos' ? 'var(--color-hoppn-orange)' : 'var(--color-text-medium)'
              }}
              onMouseEnter={activeTab !== 'photos' ? (e) => {
                e.currentTarget.style.color = 'var(--color-text-dark)';
                e.currentTarget.style.borderColor = 'var(--color-border)';
              } : undefined}
              onMouseLeave={activeTab !== 'photos' ? (e) => {
                e.currentTarget.style.color = 'var(--color-text-medium)';
                e.currentTarget.style.borderColor = 'transparent';
              } : undefined}
            >
              Photos
            </button>
            <button
              onClick={() => setActiveTab('hours')}
              className="py-2 px-1 border-b-2 font-medium text-sm transition-colors"
              style={{
                borderColor: activeTab === 'hours' ? 'var(--color-hoppn-orange)' : 'transparent',
                color: activeTab === 'hours' ? 'var(--color-hoppn-orange)' : 'var(--color-text-medium)'
              }}
              onMouseEnter={activeTab !== 'hours' ? (e) => {
                e.currentTarget.style.color = 'var(--color-text-dark)';
                e.currentTarget.style.borderColor = 'var(--color-border)';
              } : undefined}
              onMouseLeave={activeTab !== 'hours' ? (e) => {
                e.currentTarget.style.color = 'var(--color-text-medium)';
                e.currentTarget.style.borderColor = 'transparent';
              } : undefined}
            >
              Hours & Availability
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="rounded-lg shadow-sm p-6" style={{ backgroundColor: 'var(--color-warm-cream)' }}>
            <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--color-text-dark)' }}>Restaurant Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-dark)' }}>
                  Restaurant Name
                </label>
                <input
                  type="text"
                  defaultValue={user?.restaurant?.name || ''}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                  style={{
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-dark)',
                    backgroundColor: '#FFFFFF'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-hoppn-orange)';
                    e.target.style.boxShadow = '0 0 0 2px rgba(241, 80, 41, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--color-border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-dark)' }}>
                  Cuisine Type
                </label>
                <input
                  type="text"
                  defaultValue={user?.restaurant?.cuisine_type || ''}
                  placeholder="e.g., West African, Ethiopian, Nigerian"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                  style={{
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-dark)',
                    backgroundColor: '#FFFFFF'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-hoppn-orange)';
                    e.target.style.boxShadow = '0 0 0 2px rgba(241, 80, 41, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--color-border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-dark)' }}>
                  Description
                </label>
                <textarea
                  rows={4}
                  defaultValue={user?.restaurant?.description || ''}
                  placeholder="Tell customers about your restaurant, specialties, and what makes you unique..."
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                  style={{
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-dark)',
                    backgroundColor: '#FFFFFF'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-hoppn-orange)';
                    e.target.style.boxShadow = '0 0 0 2px rgba(241, 80, 41, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--color-border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-dark)' }}>
                  <MapPin className="w-4 h-4 inline mr-1" style={{ color: 'var(--color-text-medium)' }} />
                  Address
                </label>
                <input
                  type="text"
                  defaultValue={user?.restaurant?.address || ''}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                  style={{
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-dark)',
                    backgroundColor: '#FFFFFF'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-hoppn-orange)';
                    e.target.style.boxShadow = '0 0 0 2px rgba(241, 80, 41, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--color-border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-dark)' }}>
                  <Phone className="w-4 h-4 inline mr-1" style={{ color: 'var(--color-text-medium)' }} />
                  Phone Number
                </label>
                <input
                  type="tel"
                  defaultValue={user?.restaurant?.phone || ''}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                  style={{
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-dark)',
                    backgroundColor: '#FFFFFF'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-hoppn-orange)';
                    e.target.style.boxShadow = '0 0 0 2px rgba(241, 80, 41, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--color-border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-dark)' }}>
                  <Mail className="w-4 h-4 inline mr-1" style={{ color: 'var(--color-text-medium)' }} />
                  Email
                </label>
                <input
                  type="email"
                  defaultValue={user?.restaurant?.email || ''}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                  style={{
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-dark)',
                    backgroundColor: '#FFFFFF'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-hoppn-orange)';
                    e.target.style.boxShadow = '0 0 0 2px rgba(241, 80, 41, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--color-border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-dark)' }}>
                  <Globe className="w-4 h-4 inline mr-1" style={{ color: 'var(--color-text-medium)' }} />
                  Website (Optional)
                </label>
                <input
                  type="url"
                  defaultValue={user?.restaurant?.special_notes || ''}
                  placeholder="https://yourrestaurant.com"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                  style={{
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-dark)',
                    backgroundColor: '#FFFFFF'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-hoppn-orange)';
                    e.target.style.boxShadow = '0 0 0 2px rgba(241, 80, 41, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--color-border)';
                    e.target.style.boxShadow = 'none';
                  }}
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
          <div className="rounded-lg shadow-sm p-6" style={{ backgroundColor: 'var(--color-warm-cream)' }}>
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
          <div className="rounded-lg shadow-sm p-6" style={{ backgroundColor: 'var(--color-warm-cream)' }}>
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
