'use client'

import { useAuth } from '@/hooks/useAuth'
import { LoadingPage } from '@/components/ui/loading'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

export default function OrdersPage() {
  const { loading, isAuthenticated, isVendor, hasRestaurant } = useAuth()

  if (loading) {
    return <LoadingPage message="Loading orders..." />
  }

  if (!isAuthenticated || !isVendor || !hasRestaurant) {
    return null // Will be handled by dashboard layout
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Orders
          </h2>
          <p className="text-gray-600">
            Manage your customer orders here. You'll be able to view, accept, and track all your orders.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-center items-center py-8">
            <div className="text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                When customers place orders, they will appear here. Make sure your menu is set up to start receiving orders.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
