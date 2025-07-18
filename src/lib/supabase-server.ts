import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle the case where cookies can't be set during API route execution
            console.warn('Failed to set cookie:', error)
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            console.warn('Failed to remove cookie:', error)
          }
        },
      },
    }
  )
}

export async function createServerSupabaseAdmin() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get() { return undefined },
        set() {},
        remove() {},
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

// Helper function to get the current user from server context
export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Error getting user:', error)
      return { user: null, error }
    }
    
    return { user, error: null }
  } catch (error) {
    console.error('Failed to get current user:', error)
    return { user: null, error }
  }
}

// Helper function to get the current session from server context
export async function getCurrentSession() {
  const supabase = await createServerSupabaseClient()
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Error getting session:', error)
      return { session: null, error }
    }
    
    return { session, error: null }
  } catch (error) {
    console.error('Failed to get current session:', error)
    return { session: null, error }
  }
}

// Helper function to verify user authentication
export async function requireAuth() {
  const { user, error } = await getCurrentUser()
  
  if (!user || error) {
    throw new Error('Unauthorized - Please login to access this resource')
  }
  
  return user
}

// Database helpers that work with server-side auth
export const serverDbHelpers = {
  async getVendorUser(authUserId: string) {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('vendor_users')
      .select('*')
      .eq('auth_user_id', authUserId)
      .single()
    return { data, error }
  },

  async getRestaurantByVendorId(vendorUserId: string) {
    const supabase = await createServerSupabaseClient()
    
    // Get the auth_user_id from vendor_users first
    const { data: vendorUser, error: vendorError } = await supabase
      .from('vendor_users')
      .select('auth_user_id')
      .eq('id', vendorUserId)
      .single()
    
    if (vendorError || !vendorUser) {
      return { data: null, error: vendorError || new Error('Vendor user not found') }
    }
    
    // Then get the restaurant using auth_user_id
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('vendor_id', vendorUser.auth_user_id)
      .single()
    
    return { data, error }
  },

  async getRestaurantByAuthUserId(authUserId: string) {
    const supabase = await createServerSupabaseClient()
    
    // Get the restaurant using auth_user_id directly
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('vendor_id', authUserId)
      .single()
    
    return { data, error }
  },

  async createVendorUser(vendorData: any) {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('vendor_users')
      .insert(vendorData)
      .select()
      .single()
    return { data, error }
  },

  async createRestaurant(restaurantData: any) {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('restaurants')
      .insert(restaurantData)
      .select()
      .single()
    return { data, error }
  },

  async updateRestaurant(restaurantId: string, restaurantData: any) {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('restaurants')
      .update({ ...restaurantData, updated_at: new Date().toISOString() })
      .eq('id', restaurantId)
      .select()
    
    if (error) {
      return { data: null, error }
    }
    
    if (!data || data.length === 0) {
      return { data: null, error: new Error(`No restaurant found with ID: ${restaurantId}`) }
    }
    
    return { data: data[0], error: null }
  },

  async updateRestaurantStripeAccount(restaurantId: string, stripeAccountId: string, onboardingStatus: string) {
    // Use service role key for Stripe account updates to bypass RLS
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
    
    console.log('🔧 updateRestaurantStripeAccount called with:', { 
      restaurantId, 
      stripeAccountId, 
      onboardingStatus 
    })
    
    // First verify restaurant exists
    const { data: existingRestaurant, error: checkError } = await supabase
      .from('restaurants')
      .select('id, name, stripe_account_id, vendor_id')
      .eq('id', restaurantId)
      .single()
    
    console.log('🔍 Restaurant verification:', { existingRestaurant, checkError })
    
    if (checkError || !existingRestaurant) {
      return { data: null, error: new Error(`Restaurant not found: ${restaurantId}`) }
    }
    
    // Update with service role key
    const { data, error } = await supabase
      .from('restaurants')
      .update({ 
        stripe_account_id: stripeAccountId,
        stripe_onboarding_status: onboardingStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', restaurantId)
      .select()
    
    console.log('🔧 Service role update result:', { data, error })
    
    if (error) {
      return { data: null, error }
    }
    
    if (!data || data.length === 0) {
      return { data: null, error: new Error(`Failed to update restaurant ${restaurantId}`) }
    }
    
    return { data: data[0], error: null }
  },
}