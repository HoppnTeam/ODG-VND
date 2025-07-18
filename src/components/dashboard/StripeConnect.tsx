'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle, CreditCard, ExternalLink, Key, DollarSign, Calendar, FileText } from 'lucide-react'

type StripeConnectProps = {
  restaurantId: string
  vendorId: string
  onSuccess?: (accountId: string) => void
}

type StripeAccountStatus = {
  id: string | null
  charges_enabled: boolean
  details_submitted: boolean
  payouts_enabled: boolean
  requirements: {
    currently_due: string[]
    eventually_due: string[]
    past_due: string[]
  }
}

type EarningsData = {
  available: number
  pending: number
  total_volume: number
}

type Transaction = {
  id: string
  amount: number
  description: string
  created: number
  status: string
  type: string
}

export default function StripeConnect({ 
  restaurantId, 
  vendorId, 
  onSuccess 
}: StripeConnectProps) {
  const supabase = createClientComponentClient()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [accountStatus, setAccountStatus] = useState<StripeAccountStatus | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isInitialized, setIsInitialized] = useState(true)
  const [initializationLoading, setInitializationLoading] = useState(false)
  const [earnings, setEarnings] = useState<EarningsData>({ available: 0, pending: 0, total_volume: 0 })
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'payouts'>('overview')
  const [syncLoading, setSyncLoading] = useState(false)
  const [syncMessage, setSyncMessage] = useState<string | null>(null)
  
  useEffect(() => {
    // Check for return parameters from Stripe redirect
    const urlParams = new URLSearchParams(window.location.search)
    const isRefresh = urlParams.get('refresh')
    
    if (isRefresh) {
      // Force refresh account status after Stripe redirect
      setTimeout(() => {
        checkStripeAccount()
      }, 1000)
    }
    
    checkStripeInitialization()
    checkStripeAccount()
    if (isConnected && accountStatus?.id) {
      fetchEarningsData()
      fetchTransactions()
    }
  }, [restaurantId, isConnected, accountStatus?.id])
  
  const checkStripeInitialization = async () => {
    try {
      const response = await fetch('/api/stripe/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        setIsInitialized(true)
      } else {
        setIsInitialized(false)
      }
    } catch (err) {
      console.error('Error checking Stripe initialization:', err)
      setIsInitialized(false)
    }
  }


  const fetchEarningsData = async () => {
    try {
      const response = await fetch('/api/stripe/earnings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ restaurantId }),
      })

      if (response.ok) {
        const data = await response.json()
        setEarnings(data)
      }
    } catch (err) {
      console.error('Error fetching earnings:', err)
    }
  }

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/stripe/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ restaurantId }),
      })

      if (response.ok) {
        const data = await response.json()
        setTransactions(data.transactions || [])
      }
    } catch (err) {
      console.error('Error fetching transactions:', err)
    }
  }

  const handleInitializeStripe = async () => {
    setInitializationLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/stripe/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize Stripe')
      }
      
      setIsInitialized(true)
      alert('Hoppn Stripe Platform initialized successfully! Vendors can now connect to the platform.')
      
    } catch (err: any) {
      setError(err.message)
    } finally {
      setInitializationLoading(false)
    }
  }
  
  const checkStripeAccount = async () => {
    console.log('🔍 StripeConnect Debug:', { restaurantId, vendorId })
    
    if (!restaurantId) {
      console.log('❌ No restaurant ID in StripeConnect component')
      setError('Restaurant ID is missing')
      return
    }
    
    try {
      const response = await fetch('/api/stripe/account-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ restaurantId }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setAccountStatus(data.account)
        setIsConnected(data.connected)
      }
    } catch (err) {
      console.error('Error checking Stripe account:', err)
    }
  }
  
  const handleConnectStripe = async () => {
    setLoading(true)
    setError(null)
    
    console.log('🔍 Connecting to Stripe with:', {
      restaurantId,
      vendorId,
      returnUrl: `${window.location.origin}/dashboard/payments`,
      refreshUrl: `${window.location.origin}/dashboard/payments?refresh=true`
    })
    
    try {
      const response = await fetch('/api/stripe/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          restaurantId,
          vendorId,
          returnUrl: `${window.location.origin}/dashboard/payments`,
          refreshUrl: `${window.location.origin}/dashboard/payments?refresh=true`
        }),
      })
      
      const data = await response.json()
      console.log('📡 Stripe connect response:', { response: response.status, data })
      
      if (!response.ok) {
        console.error('❌ Stripe connect failed:', data)
        throw new Error(data.error || 'Failed to create Stripe Connect account')
      }
      
      console.log('✅ Redirecting to Stripe:', data.url)
      // Redirect to Stripe's hosted onboarding
      window.location.href = data.url
      
    } catch (err: any) {
      console.error('❌ Connect error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const handleReturnToStripe = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/stripe/account-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          restaurantId,
          returnUrl: `${window.location.origin}/dashboard/payments`,
          refreshUrl: `${window.location.origin}/dashboard/payments?refresh=true`
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account link')
      }
      
      // Redirect to Stripe Connect onboarding
      window.location.href = data.url
      
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const handleSyncAccount = async () => {
    setSyncLoading(true)
    setSyncMessage(null)
    setError(null)
    
    try {
      const response = await fetch('/api/stripe/sync-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ restaurantId }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to sync account')
      }
      
      setSyncMessage('Account successfully synced! Refreshing status...')
      
      // Wait a moment then refresh the account status
      setTimeout(() => {
        checkStripeAccount()
        if (data.details_submitted) {
          fetchEarningsData()
          fetchTransactions()
        }
        setSyncMessage(null)
      }, 2000)
      
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSyncLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString()
  }
  
  const getStatusColor = () => {
    if (!accountStatus) return 'gray'
    if (accountStatus.charges_enabled && accountStatus.payouts_enabled) return 'green'
    if (accountStatus.details_submitted) return 'yellow'
    return 'red'
  }
  
  const getStatusText = () => {
    if (!accountStatus) return 'Not connected'
    if (accountStatus.charges_enabled && accountStatus.payouts_enabled) return 'Active'
    if (accountStatus.details_submitted) return 'Connected (Test Mode)'
    return 'Setup required'
  }
  

  return (
    <div className="space-y-6">
      {!isInitialized && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Key className="w-5 h-5 text-yellow-600" />
            <h4 className="font-medium text-yellow-800">Hoppn Stripe Platform Not Initialized</h4>
          </div>
          <p className="text-sm text-yellow-700 mb-3">
            Hoppn's Stripe Connect platform needs to be initialized before vendors can connect.
          </p>
          <Button
            onClick={handleInitializeStripe}
            disabled={initializationLoading}
            variant="hoppn"
            size="sm"
            className="flex items-center gap-2"
          >
            {initializationLoading ? 'Initializing...' : 'Initialize Hoppn Stripe Platform'}
          </Button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {syncMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
          <p className="text-green-700">{syncMessage}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CreditCard className="w-6 h-6 text-amber-600" />
          <h3 className="text-lg font-semibold text-gray-900">Payments Dashboard</h3>
        </div>
        
        {isConnected && accountStatus?.charges_enabled && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm font-medium text-green-700">Connected & Active</span>
          </div>
        )}
      </div>

      {/* Connection Status */}
      {!isConnected && !accountStatus?.details_submitted ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-amber-600" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Connect Your Bank Account
            </h4>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Set up your Hoppn Payments account to start accepting payments from customers and receiving automatic payouts.
            </p>
            
            {isInitialized && (
              <div className="flex flex-col items-center gap-3">
                <Button
                  onClick={handleConnectStripe}
                  disabled={loading}
                  variant="hoppn"
                  className="flex items-center gap-2"
                >
                  {loading ? 'Setting up...' : 'Connect Bank Account'}
                  <CreditCard className="w-4 h-4" />
                </Button>
                
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">Already completed onboarding?</p>
                  <Button
                    onClick={handleSyncAccount}
                    disabled={syncLoading}
                    variant="hoppnOutline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {syncLoading ? 'Syncing...' : 'Sync Account'}
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Earnings Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <h4 className="font-medium text-gray-900">Available</h4>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(earnings.available)}
              </p>
              <p className="text-sm text-gray-500">Ready for payout</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                <h4 className="font-medium text-gray-900">Pending</h4>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(earnings.pending)}
              </p>
              <p className="text-sm text-gray-500">Processing</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h4 className="font-medium text-gray-900">Total Volume</h4>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(earnings.total_volume)}
              </p>
              <p className="text-sm text-gray-500">All time</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Account Overview', icon: CreditCard },
                { id: 'transactions', label: 'Transactions', icon: FileText },
                { id: 'payouts', label: 'Payouts', icon: DollarSign },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === id
                      ? 'border-amber-500 text-amber-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Account Status</h4>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor() === 'green' ? 'bg-green-500' : getStatusColor() === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                    <span className={`text-sm font-medium ${getStatusColor() === 'green' ? 'text-green-700' : getStatusColor() === 'yellow' ? 'text-yellow-700' : 'text-red-700'}`}>
                      {getStatusText()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    {accountStatus?.charges_enabled ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm text-gray-700">Accept payments</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {accountStatus?.payouts_enabled ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm text-gray-700">Receive payouts</span>
                  </div>
                </div>

                {accountStatus?.requirements?.currently_due && accountStatus.requirements.currently_due.length > 0 && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <h5 className="font-medium text-yellow-800 mb-2">Action Required</h5>
                    <p className="text-sm text-yellow-700 mb-3">
                      Complete {accountStatus.requirements.currently_due.length} requirement(s) to fully activate your account.
                    </p>
                    <Button
                      onClick={handleReturnToStripe}
                      disabled={loading}
                      variant="hoppn"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      {loading ? 'Loading...' : 'Complete Setup'}
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={() => window.open('https://dashboard.stripe.com/express', '_blank')}
                    variant="hoppnOutline"
                    className="flex items-center gap-2"
                  >
                    Stripe Dashboard
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Payout Schedule</h4>
                <div className="flex items-center gap-2 text-blue-800 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Weekly payouts every Monday</span>
                </div>
                <p className="text-sm text-blue-700">
                  Automatic transfers to your connected bank account for orders completed by Sunday 11:59 PM.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-medium text-gray-900 mb-4">Recent Transactions</h4>
              
              {transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500">{formatDate(transaction.created)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{formatCurrency(transaction.amount)}</p>
                        <p className={`text-sm ${transaction.status === 'succeeded' ? 'text-green-600' : transaction.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>
                          {transaction.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📊</div>
                  <p className="text-gray-500">
                    No transactions yet. Start accepting orders to see your payment history.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'payouts' && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-medium text-gray-900 mb-4">Payout History</h4>
              
              <div className="text-center py-8">
                <div className="text-4xl mb-2">💰</div>
                <p className="text-gray-500">
                  Payout history will appear here once you start receiving payments.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
