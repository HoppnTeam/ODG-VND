'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle, CreditCard, ExternalLink, Key } from 'lucide-react'

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
  const [isInitialized, setIsInitialized] = useState(true) // Default to true, will check during initialization
  const [initializationLoading, setInitializationLoading] = useState(false)
  
  useEffect(() => {
    checkStripeInitialization()
    checkStripeAccount()
  }, [restaurantId])
  
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
    try {
      const response = await fetch('/api/stripe/account-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
    
    try {
      const response = await fetch('/api/stripe/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          restaurantId,
          vendorId,
          returnUrl: `${window.location.origin}/dashboard/payments`,
          refreshUrl: `${window.location.origin}/dashboard/payments?refresh=true`
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create Stripe Connect account')
      }
      
      // Redirect to Stripe Connect onboarding
      window.location.href = data.url
      
    } catch (err: any) {
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
  
  const getStatusColor = () => {
    if (!accountStatus) return 'gray'
    if (accountStatus.charges_enabled && accountStatus.payouts_enabled) return 'green'
    if (accountStatus.details_submitted) return 'yellow'
    return 'red'
  }
  
  const getStatusText = () => {
    if (!accountStatus) return 'Not connected'
    if (accountStatus.charges_enabled && accountStatus.payouts_enabled) return 'Active'
    if (accountStatus.details_submitted) return 'Pending verification'
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
            Hoppn's Stripe Connect platform needs to be initialized before vendors can connect. Please add the Hoppn platform Stripe API keys to the environment variables.
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
      
      <div className="flex items-center gap-3">
        <CreditCard className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Hoppn Payments</h3>
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {/* Account Status */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">Payment Account Status</h4>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor() === 'green' ? 'bg-green-500' : getStatusColor() === 'yellow' ? 'bg-yellow-500' : getStatusColor() === 'red' ? 'bg-red-500' : 'bg-gray-400'}`} />
            <span className={`text-sm font-medium ${getStatusColor() === 'green' ? 'text-green-700' : getStatusColor() === 'yellow' ? 'text-yellow-700' : getStatusColor() === 'red' ? 'text-red-700' : 'text-gray-600'}`}>
              {getStatusText()}
            </span>
          </div>
        </div>
        
        {accountStatus ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                {accountStatus.charges_enabled ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
                <span className="text-sm text-gray-700">Accept payments</span>
              </div>
              
              <div className="flex items-center gap-2">
                {accountStatus.payouts_enabled ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
                <span className="text-sm text-gray-700">Receive payouts</span>
              </div>
            </div>
            
            {accountStatus.requirements.currently_due.length > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <h5 className="font-medium text-yellow-800 mb-2">Action Required</h5>
                <p className="text-sm text-yellow-700">
                  You need to complete {accountStatus.requirements.currently_due.length} requirement(s) to activate your account.
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-600 text-sm">
            Connect to Hoppn's payment platform to start accepting payments from customers.
          </p>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-3">
        {!isConnected && isInitialized ? (
          <Button
            onClick={handleConnectStripe}
            disabled={loading}
            variant="hoppn"
            className="flex items-center gap-2"
          >
            {loading ? 'Connecting...' : 'Connect to Hoppn Payments'}
            <ExternalLink className="w-4 h-4" />
          </Button>
        ) : (
          <>
            {accountStatus && !accountStatus.charges_enabled && (
              <Button
                onClick={handleReturnToStripe}
                disabled={loading}
                variant="hoppn"
                className="flex items-center gap-2"
              >
                {loading ? 'Loading...' : 'Complete Setup'}
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
            
            <Button
              onClick={() => window.open('https://dashboard.stripe.com/express', '_blank')}
              variant="hoppnOutline"
              className="flex items-center gap-2"
            >
              Stripe Dashboard
              <ExternalLink className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
      
      {/* Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">About Hoppn Payments</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Securely accept credit card and digital wallet payments</li>
          <li>• Automatic payouts to your bank account</li>
          <li>• Built-in fraud protection and dispute management</li>
          <li>• Detailed transaction reporting and analytics</li>
          <li>• Industry-standard security and compliance</li>
        </ul>
      </div>
    </div>
  )
}
