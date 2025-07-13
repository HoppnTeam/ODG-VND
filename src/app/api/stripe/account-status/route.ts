import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
})

export async function POST(request: NextRequest) {
  try {
    const { restaurantId } = await request.json()
    
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
      
    if (restaurantError) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      )
    }
    
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
    
  } catch (error: any) {
    console.error('Stripe account status error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get account status' },
      { status: 500 }
    )
  }
}
