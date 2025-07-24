import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, serverDbHelpers } from '@/lib/supabase-server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
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
        { error: 'Stripe account not found for this restaurant' },
        { status: 404 }
      )
    }

    // Create account session for embedded Connect
    const accountSession = await stripe.accountSessions.create({
      account: restaurant.stripe_account_id,
      components: {
        account_onboarding: {
          enabled: true,
        },
        payments: {
          enabled: true,
          features: {
            refund_management: true,
            dispute_management: true,
            capture_payments: true,
          },
        },
        payouts: {
          enabled: true,
          features: {
            instant_payouts: true,
            standard_payouts: true,
          },
        },
        balances: {
          enabled: true,
          features: {
            instant_payouts: true,
          },
        },
      },
    })

    return NextResponse.json({
      client_secret: accountSession.client_secret,
    })
  } catch (error) {
    console.error('Error creating connect session:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create connect session'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}