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
      return NextResponse.json({
        available: 0,
        pending: 0,
        total_volume: 0,
      })
    }

    // Get balance from Stripe
    const balance = await stripe.balance.retrieve({
      stripeAccount: restaurant.stripe_account_id,
    })

    // Calculate totals
    const available = balance.available.reduce((sum, balance) => sum + balance.amount, 0)
    const pending = balance.pending.reduce((sum, balance) => sum + balance.amount, 0)

    // Get total volume from payment intents
    const charges = await stripe.charges.list(
      {
        limit: 100,
      },
      {
        stripeAccount: restaurant.stripe_account_id,
      }
    )

    const total_volume = charges.data
      .filter(charge => charge.status === 'succeeded')
      .reduce((sum, charge) => sum + charge.amount, 0)

    return NextResponse.json({
      available,
      pending,
      total_volume,
    })
  } catch (error: any) {
    console.error('Error fetching earnings:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch earnings' },
      { status: 500 }
    )
  }
}