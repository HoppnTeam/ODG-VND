'use client'

import { useAuth } from '@/hooks/useAuth'
import { LoadingPage } from '@/components/ui/loading'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'

export default function MenuPage() {
  const { loading, isAuthenticated, isVendor, hasRestaurant } = useAuth()

  if (loading) {
    return <LoadingPage message="Loading menu..." />
  }

  if (!isAuthenticated || !isVendor || !hasRestaurant) {
    return null // Will be handled by dashboard layout
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Menu Management
          </h2>
          <Button variant="hoppn" className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            <span>Add New Dish</span>
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-center items-center py-8">
            <div className="text-center">
              <div className="text-6xl mb-4">🍲</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Menu Items Yet</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Start adding your authentic African dishes to your menu. Include photos and detailed descriptions to attract customers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
