import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const { restaurantId, returnUrl, refreshUrl } = await request.json()
    
    if (!restaurantId) {
      return NextResponse.json(
        { error: 'Restaurant ID is required' },
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
    
    // Get restaurant's Stripe account ID
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .select('stripe_account_id')
      .eq('id', restaurantId)
      .single()
      
    if (restaurantError || !restaurant.stripe_account_id) {
      return NextResponse.json(
        { error: 'Stripe account not found' },
        { status: 404 }
      )
    }
    
    // Create account link for continued onboarding
    const accountLink = await stripe.accountLinks.create({
      account: restaurant.stripe_account_id,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: 'account_onboarding',
    })
    
    return NextResponse.json({
      url: accountLink.url,
    })
    
  } catch (error: any) {
    console.error('Stripe account link error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create account link' },
      { status: 500 }
    )
  }
}
