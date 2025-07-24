'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { LoadingPage } from '@/components/ui/loading'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import DishForm from '@/components/dashboard/DishForm'
import { Button } from '@/components/ui/button'
import { 
  ShoppingBag, 
  DollarSign, 
  UtensilsCrossed, 
  Star,
  Plus,
  CreditCard,
  Clock,
  X,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react'

export default function DashboardPage() {
  const { user, loading, isAuthenticated, isVendor, hasRestaurant } = useAuth()
  const [showDishForm, setShowDishForm] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  if (loading) {
    return <LoadingPage message="Loading your dashboard..." />
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  // User is authenticated but not a vendor (shouldn't happen with proper flow)
  if (!isVendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Application Pending
              </h2>
              <p className="text-gray-600 mb-6">
                Your vendor application is still being reviewed. You&apos;ll receive an email notification once it&apos;s approved.
              </p>
              <button
                onClick={() => router.push('/login')}
                className="w-full px-4 py-2 text-white font-medium rounded-lg transition-colors"
                style={{ backgroundColor: '#F15029' }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Vendor doesn't have restaurant set up yet
  if (!hasRestaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Restaurant Setup Required
              </h2>
              <p className="text-gray-600 mb-6">
                Your vendor account has been approved! Please complete your restaurant setup to start receiving orders.
              </p>
              <button
                onClick={() => router.push('/restaurant/setup')}
                className="w-full px-4 py-2 text-white font-medium rounded-lg transition-colors"
                style={{ backgroundColor: '#F15029' }}
              >
                Complete Restaurant Setup
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Full dashboard for approved vendors with restaurant setup
  return (
    <DashboardLayout>
      <div className="container mx-auto px-6 py-8" style={{ backgroundColor: 'var(--color-earth-beige)' }}>
        {/* Welcome Card */}
        <div className="rounded-lg shadow-sm p-6 mb-6" style={{ backgroundColor: 'var(--color-warm-cream)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Montserrat, sans-serif', color: 'var(--color-text-dark)' }}>
                Welcome to Your Hoppn Dashboard!
              </h2>
              <p style={{ color: 'var(--color-text-medium)' }}>
                Your restaurant is now live on the Hoppn platform. Start managing your orders and growing your business.
              </p>
            </div>
            <div className="text-6xl">🎉</div>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Today&apos;s Orders */}
          <div className="rounded-lg shadow-sm p-6" style={{ backgroundColor: 'var(--color-soft-orange)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-dark)' }}>Today&apos;s Orders</h3>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-hoppn-orange)' }}>
                <ShoppingBag className="w-4 h-4" style={{ color: 'var(--color-text-on-colored)' }} />
              </div>
            </div>
            <div className="text-3xl font-bold mb-2" style={{ fontFamily: 'Montserrat, sans-serif', color: 'var(--color-text-dark)' }}>
              0
            </div>
            <p className="text-sm" style={{ color: 'var(--color-text-medium)' }}>No orders yet today</p>
          </div>
          
          {/* Revenue */}
          <div className="rounded-lg shadow-sm p-6" style={{ backgroundColor: 'var(--color-gentle-blue)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-dark)' }}>Revenue</h3>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-hoppn-blue)' }}>
                <DollarSign className="w-4 h-4" style={{ color: 'var(--color-text-on-colored)' }} />
              </div>
            </div>
            <div className="text-3xl font-bold mb-2" style={{ fontFamily: 'Montserrat, sans-serif', color: 'var(--color-text-dark)' }}>
              $0.00
            </div>
            <p className="text-sm" style={{ color: 'var(--color-text-medium)' }}>Ready to start earning</p>
          </div>
          
          {/* Menu Items */}
          <div className="rounded-lg shadow-sm p-6" style={{ backgroundColor: 'var(--color-earth-green)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-dark)' }}>Menu Items</h3>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-hoppn-green)' }}>
                <UtensilsCrossed className="w-4 h-4" style={{ color: 'var(--color-text-on-colored)' }} />
              </div>
            </div>
            <div className="text-3xl font-bold mb-2" style={{ fontFamily: 'Montserrat, sans-serif', color: 'var(--color-text-dark)' }}>
              0
            </div>
            <p className="text-sm" style={{ color: 'var(--color-text-medium)' }}>Add your first dish</p>
          </div>
          
          {/* Customer Ratings */}
          <div className="rounded-lg shadow-sm p-6" style={{ backgroundColor: 'var(--color-sunset-gold)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-dark)' }}>Customer Ratings</h3>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-hoppn-yellow)' }}>
                <Star className="w-4 h-4" style={{ color: 'var(--color-text-on-colored)' }} />
              </div>
            </div>
            <div className="text-3xl font-bold mb-2" style={{ fontFamily: 'Montserrat, sans-serif', color: 'var(--color-text-dark)' }}>
              N/A
            </div>
            <p className="text-sm" style={{ color: 'var(--color-text-medium)' }}>No ratings yet</p>
          </div>
        </div>
        
        {/* Next Steps Section */}
        <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Montserrat, sans-serif', color: 'var(--color-text-dark)' }}>
          Next Steps to Get Started
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Add Menu Items */}
          <div className="rounded-lg shadow-sm p-6" style={{ backgroundColor: 'var(--color-warm-cream)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-soft-orange)' }}>
                <Plus className="w-5 h-5" style={{ color: 'var(--color-hoppn-orange)' }} />
              </div>
              <div>
                <h3 className="font-semibold" style={{ color: 'var(--color-text-dark)' }}>Add Menu Items</h3>
                <p className="text-sm" style={{ color: 'var(--color-text-medium)' }}>Start building your menu</p>
              </div>
            </div>
            <Button 
              variant="hoppnOutline" 
              className="w-full"
              onClick={() => setShowDishForm(true)}
            >
              Add Your First Dish
            </Button>
          </div>
          
          {/* Upload Photos */}
          <div className="rounded-lg shadow-sm p-6 flex gap-4" style={{ backgroundColor: 'var(--color-warm-cream)' }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--color-gentle-blue)' }}>
              <ImageIcon className="w-5 h-5" style={{ color: 'var(--color-hoppn-blue)' }} />
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-1" style={{ color: 'var(--color-text-dark)' }}>Upload Photos</h4>
              <p className="text-sm mb-3" style={{ color: 'var(--color-text-medium)' }}>Add high-quality photos of your restaurant and dishes</p>
              <button 
                onClick={() => router.push('/dashboard/restaurant?tab=photos')}
                className="text-sm font-medium transition-colors"
                style={{ color: 'var(--color-hoppn-orange)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#D13D1A'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-hoppn-orange)'}
              >
                Upload Photos →
              </button>
            </div>
          </div>
          
          {/* Set Up Payments */}
          <div className="rounded-lg shadow-sm p-6 flex gap-4" style={{ backgroundColor: 'var(--color-warm-cream)' }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--color-earth-green)' }}>
              <CreditCard className="w-5 h-5" style={{ color: 'var(--color-hoppn-green)' }} />
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-1" style={{ color: 'var(--color-text-dark)' }}>Set Up Payments</h4>
              <p className="text-sm mb-3" style={{ color: 'var(--color-text-medium)' }}>Connect your bank account to receive payouts from orders</p>
              <button 
                onClick={() => router.push('/dashboard/payments')}
                className="text-sm font-medium transition-colors"
                style={{ color: 'var(--color-hoppn-orange)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#D13D1A'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-hoppn-orange)'}
              >
                Setup Payments →
              </button>
            </div>
          </div>
          
          {/* Set Hours */}
          <div className="rounded-lg shadow-sm p-6 flex gap-4" style={{ backgroundColor: 'var(--color-warm-cream)' }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--color-sunset-gold)' }}>
              <Clock className="w-5 h-5" style={{ color: 'var(--color-hoppn-yellow)' }} />
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-1" style={{ color: 'var(--color-text-dark)' }}>Set Hours</h4>
              <p className="text-sm mb-3" style={{ color: 'var(--color-text-medium)' }}>Configure your restaurant hours and availability</p>
              <button 
                onClick={() => router.push('/dashboard/restaurant?tab=hours')}
                className="text-sm font-medium transition-colors"
                style={{ color: 'var(--color-hoppn-orange)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#D13D1A'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-hoppn-orange)'}
              >
                Set Hours →
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dish Form Modal */}
      {showDishForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'var(--color-warm-cream)' }}>
            <div className="sticky top-0 border-b px-6 py-4 flex items-center justify-between" style={{ backgroundColor: 'var(--color-warm-cream)', borderColor: 'var(--color-border)' }}>
              <h2 className="text-xl font-semibold" style={{ fontFamily: 'Montserrat, sans-serif', color: 'var(--color-text-dark)' }}>
                Add New Dish
              </h2>
              <button
                onClick={() => setShowDishForm(false)}
                className="transition-colors"
                style={{ color: 'var(--color-text-medium)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text-dark)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-medium)'}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <DishForm
                restaurantId={user?.restaurant?.id || ''}
                onSuccess={() => {
                  setShowDishForm(false)
                  // Optionally refresh the page or update state
                  window.location.reload()
                }}
              />
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}