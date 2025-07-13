import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const { restaurantId, vendorId, returnUrl, refreshUrl } = await request.json()
    
    if (!restaurantId || !vendorId) {
      return NextResponse.json(
        { error: 'Restaurant ID and Vendor ID are required' },
        { status: 400 }
      )
    }
    
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Check if restaurant already has a Stripe account
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .select('stripe_account_id')
      .eq('id', restaurantId)
      .single()
      
    if (restaurantError) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      )
    }
    
    let accountId = restaurant.stripe_account_id
    
    // Create Stripe Connect account if it doesn't exist
    if (!accountId) {
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
      
      accountId = account.id
      
      // Save the Stripe account ID to the restaurant
      const { error: updateError } = await supabase
        .from('restaurants')
        .update({ stripe_account_id: accountId })
        .eq('id', restaurantId)
        
      if (updateError) {
        console.error('Error updating restaurant with Stripe account ID:', updateError)
        // Continue anyway, as the Stripe account was created successfully
      }
    }
    
    // Create account link for onboarding
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
    
  } catch (error: any) {
    console.error('Stripe Connect error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create Stripe Connect account' },
      { status: 500 }
    )
  }
}
