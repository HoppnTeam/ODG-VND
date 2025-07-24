import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, serverDbHelpers } from '@/lib/supabase-server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export async function POST(request: NextRequest) {
  try {
    const { restaurantId, vendorId, returnUrl, refreshUrl } = await request.json()
    
    console.log('🔍 Stripe Connect API called with:', {
      restaurantId,
      vendorId,
      returnUrl,
      refreshUrl,
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      stripeKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 15)
    })
    
    if (!restaurantId || !vendorId) {
      console.log('❌ Missing required parameters')
      return NextResponse.json(
        { error: 'Restaurant ID and Vendor ID are required' },
        { status: 400 }
      )
    }
    
    // Require authentication
    const user = await requireAuth()
    console.log('✅ User authenticated:', user.id)
    
    // Check if restaurant already has a Stripe account and verify ownership
    const { data: restaurant, error: restaurantError } = await serverDbHelpers.getRestaurantByAuthUserId(user.id)
    
    if (restaurantError || !restaurant) {
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
    
    let accountId = restaurant.stripe_account_id
    
    // Create Stripe Connect account if it doesn't exist
    if (!accountId) {
      console.log('🔍 Creating Stripe Express account...', {
        userEmail: user.email,
        restaurantId,
        vendorId
      })
      
      try {
        const account = await stripe.accounts.create({
          type: 'express',
          country: 'US',
          email: user.email,
          capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
          },
          business_type: 'individual',
          metadata: {
            restaurant_id: restaurantId,
            vendor_id: vendorId,
          },
        })
        
        console.log('✅ Stripe Express account created:', account.id)
        accountId = account.id
      } catch (stripeError) {
        interface StripeErrorExtended extends Error {
          type?: string
          code?: string
        }
        const errorDetails = stripeError instanceof Error ? {
          error: stripeError.message,
          type: (stripeError as StripeErrorExtended).type,
          code: (stripeError as StripeErrorExtended).code,
          rawError: stripeError
        } : { error: 'Unknown error', rawError: stripeError }
        console.error('❌ Failed to create Stripe Express account:', errorDetails)
        throw stripeError
      }
      
      // Save the Stripe account ID to the restaurant
      const { error: updateError } = await serverDbHelpers.updateRestaurant(restaurantId, {
        stripe_account_id: accountId
      })
        
      if (updateError) {
        console.error('Error updating restaurant with Stripe account ID:', updateError)
        // Continue anyway, as the Stripe account was created successfully
      }
    }
    
    // Create account link for hosted onboarding
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: 'account_onboarding',
    })
    
    return NextResponse.json({
      url: accountLink.url,
      accountId,
    })
    
  } catch (error) {
    console.error('Stripe Connect error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create Stripe Connect account'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
