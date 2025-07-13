'use client'

import { useAuth } from '@/hooks/useAuth'
import { LoadingPage } from '@/components/ui/loading'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import StripeConnect from '@/components/dashboard/StripeConnect'
import { Button } from '@/components/ui/button'
import { CreditCard, DollarSign, Calendar } from 'lucide-react'

export default function PaymentsPage() {
  const { loading, isAuthenticated, isVendor, hasRestaurant, user } = useAuth()

  if (loading) {
    return <LoadingPage message="Loading payment information..." />
  }

  if (!isAuthenticated || !isVendor || !hasRestaurant) {
    return null // Will be handled by dashboard layout
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Payments & Payouts
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Payment Account</h3>
                <Button variant="hoppnOutline" className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span>Connect Bank Account</span>
                </Button>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="text-orange-500 mt-0.5">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-800 mb-1">Connect Your Bank Account</h4>
                    <p className="text-sm text-orange-700">
                      To receive payouts from customer orders, you need to connect your bank account through our secure Stripe integration.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600 mb-4">
                  Once connected, your earnings will be automatically transferred to your bank account based on your payout schedule.
                </p>
                
                <h4 className="font-medium text-gray-900 mb-2">Payout Schedule</h4>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span>Weekly payouts (every Monday)</span>
                </div>
                <p className="text-sm text-gray-500 ml-6">
                  For orders completed by Sunday at 11:59 PM
                </p>
              </div>
            </div>
            
            <div className="container mx-auto px-6 py-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Payments
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stripe Connect Setup */}
                <div className="lg:col-span-2">
                  <StripeConnect
                    restaurantId={user?.restaurant?.id || ''}
                    vendorId={user?.vendorUser?.id || ''}
                    onSuccess={(accountId) => {
                      console.log('Stripe account connected:', accountId)
                      // Optionally refresh the page or update state
                    }}
                  />
                </div>
                
                {/* Payment Summary */}
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">This Month</span>
                        <span className="font-semibold text-gray-900">$0.00</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Pending</span>
                        <span className="font-semibold text-yellow-600">$0.00</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Available</span>
                        <span className="font-semibold text-green-600">$0.00</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
                    
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">📊</div>
                      <p className="text-gray-500 text-sm">
                        No transactions yet. Start accepting orders to see your payment history here.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction History</h3>
              
              <div className="flex justify-center items-center py-8">
                <div className="text-center">
                  <div className="text-6xl mb-4">💸</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Transactions Yet</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Your transaction history will appear here once you start receiving orders and payments.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings Summary</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Available for Payout</p>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-2xl font-bold text-gray-900">$0.00</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Pending</p>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-5 h-5 text-orange-600" />
                    <span className="text-2xl font-bold text-gray-900">$0.00</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">Total Earnings (All Time)</p>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    <span className="text-2xl font-bold text-gray-900">$0.00</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Tax Information</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Complete your tax information to ensure proper reporting.
                  </p>
                  <Button variant="hoppnOutline" size="sm" className="w-full">
                    Complete Tax Info
                  </Button>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-1">Payout Method</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Add or update your payout method.
                  </p>
                  <Button variant="hoppnOutline" size="sm" className="w-full">
                    Manage Payout Method
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
