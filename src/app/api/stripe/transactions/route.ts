import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, serverDbHelpers } from '@/lib/supabase-server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export async function POST(request: NextRequest) {
  try {
    const { restaurantId, limit = 25 } = await request.json()

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
        transactions: [],
      })
    }

    // Get payment intents (transactions)
    const paymentIntents = await stripe.paymentIntents.list(
      {
        limit: Math.min(limit, 100),
      },
      {
        stripeAccount: restaurant.stripe_account_id,
      }
    )

    // Format transactions
    const transactions = paymentIntents.data.map(intent => ({
      id: intent.id,
      amount: intent.amount,
      description: intent.description || `Payment for order`,
      created: intent.created,
      status: intent.status,
      type: 'payment',
    }))

    // Also get payouts
    const payouts = await stripe.payouts.list(
      {
        limit: Math.min(limit, 100),
      },
      {
        stripeAccount: restaurant.stripe_account_id,
      }
    )

    const payoutTransactions = payouts.data.map(payout => ({
      id: payout.id,
      amount: payout.amount,
      description: `Payout to ${payout.destination}`,
      created: payout.created,
      status: payout.status,
      type: 'payout',
    }))

    // Combine and sort by date
    const allTransactions = [...transactions, ...payoutTransactions]
      .sort((a, b) => b.created - a.created)
      .slice(0, limit)

    return NextResponse.json({
      transactions: allTransactions,
    })
  } catch (error: any) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}