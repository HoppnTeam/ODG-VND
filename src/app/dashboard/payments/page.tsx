'use client'

import { useAuth } from '@/hooks/useAuth'
import { LoadingPage } from '@/components/ui/loading'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import StripeConnect from '@/components/dashboard/StripeConnect'

export default function PaymentsPage() {
  const { loading, isAuthenticated, isVendor, hasRestaurant, user } = useAuth()

  console.log('💳 Payments Page Debug:', {
    loading,
    isAuthenticated,
    isVendor,
    hasRestaurant,
    restaurantId: user?.restaurant?.id,
    vendorId: user?.vendorUser?.id,
    user: user
  })

  if (loading) {
    return <LoadingPage message="Loading payment information..." />
  }

  if (!isAuthenticated || !isVendor || !hasRestaurant || !user) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-6 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">
              {!user ? 'user is not defined' : 'Authentication required'}
            </p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Payments & Payouts
        </h2>
        
        <StripeConnect
          restaurantId={user.restaurant?.id || ''}
          vendorId={user.vendorUser?.id || ''}
          onSuccess={(accountId) => {
            console.log('Stripe account connected:', accountId)
          }}
        />
      </div>
    </DashboardLayout>
  )
}
