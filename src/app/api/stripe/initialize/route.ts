import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Stripe Initialize Debug:', {
      hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
      hasPublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      secretKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 10),
      publishableKeyPrefix: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 10)
    })

    // Check if Stripe API keys are configured
    if (!process.env.STRIPE_SECRET_KEY || !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      console.log('❌ Missing Stripe API keys')
      return NextResponse.json(
        { error: 'Stripe API keys are not configured' },
        { status: 400 }
      )
    }

    // Initialize Stripe with the API key (using stable API version)
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    })

    // Temporarily skip API verification and proceed with Connect setup
    console.log('⚠️ Skipping API verification - proceeding with Connect setup')
    
    return NextResponse.json({
      success: true,
      message: 'Stripe API initialized (bypassing verification)',
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    })
    
  } catch (error: any) {
    console.error('Stripe initialization error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to initialize Stripe' },
      { status: 500 }
    )
  }
}
