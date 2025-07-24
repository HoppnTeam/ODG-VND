import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, serverDbHelpers } from '@/lib/supabase-server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
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
    
    // Require authentication
    const user = await requireAuth()
    
    // Get restaurant and verify ownership
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
    
    if (!restaurant.stripe_account_id) {
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
    
  } catch (error) {
    console.error('Stripe account link error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create account link'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
