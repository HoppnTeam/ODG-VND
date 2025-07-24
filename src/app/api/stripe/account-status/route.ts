import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, serverDbHelpers } from '@/lib/supabase-server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export async function POST(request: NextRequest) {
  try {
    const { restaurantId } = await request.json()
    
    console.log('🔍 Account Status Debug:', { restaurantId })
    
    if (!restaurantId) {
      console.log('❌ No restaurant ID provided')
      return NextResponse.json(
        { error: 'Restaurant ID is required' },
        { status: 400 }
      )
    }
    
    // Require authentication
    const user = await requireAuth()
    console.log('✅ User authenticated:', user.id)
    
    // Get restaurant and verify ownership
    const { data: restaurant, error: restaurantError } = await serverDbHelpers.getRestaurantByAuthUserId(user.id)
    
    if (restaurantError || !restaurant) {
      console.log('❌ Restaurant not found or access denied:', restaurantError)
      return NextResponse.json(
        { error: 'Restaurant not found or access denied' },
        { status: 404 }
      )
    }
    
    // Verify the restaurant ID matches the authenticated user's restaurant
    if (restaurant.id !== restaurantId) {
      return NextResponse.json(
        { error: 'Unauthorized access to restaurant' },
        { status: 403 }
      )
    }
    
    console.log('🏪 Restaurant verified:', { 
      restaurantId: restaurant.id,
      userId: user.id,
      hasStripeAccount: !!restaurant.stripe_account_id
    })
    
    if (!restaurant.stripe_account_id) {
      return NextResponse.json({
        connected: false,
        account: null,
      })
    }
    
    // Get Stripe account details
    const account = await stripe.accounts.retrieve(restaurant.stripe_account_id)
    
    return NextResponse.json({
      connected: true,
      account: {
        id: account.id,
        charges_enabled: account.charges_enabled,
        details_submitted: account.details_submitted,
        payouts_enabled: account.payouts_enabled,
        requirements: account.requirements,
      },
    })
    
  } catch (error) {
    console.error('Stripe account status error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to get account status'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
