import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe API keys are configured
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PUBLISHABLE_KEY) {
      return NextResponse.json(
        { error: 'Stripe API keys are not configured' },
        { status: 400 }
      )
    }

    // Initialize Stripe with the API key
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    })

    // Verify the API key by making a simple call to Stripe
    try {
      // Make a simple call to verify the API key works
      await stripe.balance.retrieve()
      
      return NextResponse.json({
        success: true,
        message: 'Stripe API initialized successfully',
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      })
    } catch (stripeError: any) {
      console.error('Stripe API key verification failed:', stripeError)
      return NextResponse.json(
        { 
          error: 'Invalid Stripe API key', 
          details: stripeError.message 
        },
        { status: 400 }
      )
    }
    
  } catch (error: any) {
    console.error('Stripe initialization error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to initialize Stripe' },
      { status: 500 }
    )
  }
}
