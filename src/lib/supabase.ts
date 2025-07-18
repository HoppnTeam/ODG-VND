import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

// Check if environment variables are defined
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl) {
  console.error('NEXT_PUBLIC_SUPABASE_URL is not defined')
}

if (!supabaseAnonKey) {
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined')
}

// Create browser client with proper session handling
export const supabase = createBrowserClient<Database>(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// For server-side operations
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseServiceRoleKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is not defined')
} else {
  // Log partial key for debugging (safely)
  const keyLength = supabaseServiceRoleKey.length;
  const firstChars = supabaseServiceRoleKey.substring(0, 3);
  const lastChars = supabaseServiceRoleKey.substring(keyLength - 3);
  console.log(`Service key found with length ${keyLength}: ${firstChars}...${lastChars}`)
}

export const supabaseAdmin = createClient<Database>(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseServiceRoleKey || 'placeholder-service-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

// Helper functions for common operations
export const authHelpers = {
  async signUp(email: string, password: string, userData: any) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    })
    return { data, error }
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  async getCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },
}

// Database helpers
export const dbHelpers = {
  async getVendorUser(authUserId: string) {
    const { data, error } = await supabase
      .from('vendor_users')
      .select('*')
      .eq('auth_user_id', authUserId)
      .single()
    return { data, error }
  },

  async getRestaurantByVendorId(vendorUserId: string) {
    // Get the auth_user_id from vendor_users first
    const { data: vendorUser } = await supabase
      .from('vendor_users')
      .select('auth_user_id')
      .eq('id', vendorUserId)
      .single()
    
    if (!vendorUser) {
      return { data: null, error: { message: 'Vendor user not found', code: 'PGRST116' } }
    }
    
    // Use the auth_user_id to find the restaurant
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('vendor_user_id', vendorUser.auth_user_id)
      .single()
    
    return { data, error }
  },

  async getRestaurantOrders(restaurantId: string, limit = 50) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false })
      .limit(limit)
    return { data, error }
  },

  async getRestaurantDishes(restaurantId: string) {
    const { data, error } = await supabase
      .from('hoppn_dishes')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async updateOrderStatus(orderId: string, status: Database['public']['Enums']['order_status']) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select()
      .single()
    return { data, error }
  },

  async createPendingVendor(vendorData: any) {
    const { data, error } = await supabase
      .from('pending_vendors')
      .insert(vendorData)
      .select()
      .single()
    return { data, error }
  },

  async createVendorUser(vendorData: any) {
    const { data, error } = await supabase
      .from('vendor_users')
      .insert(vendorData)
      .select()
      .single()
    return { data, error }
  },

  async createRestaurant(restaurantData: any) {
    const { data, error } = await supabase
      .from('restaurants')
      .insert(restaurantData)
      .select()
      .single()
    return { data, error }
  },

  async createDish(dishData: any) {
    const { data, error } = await supabase
      .from('hoppn_dishes')
      .insert(dishData)
      .select()
      .single()
    return { data, error }
  },

  async updateDish(dishId: string, dishData: any) {
    const { data, error } = await supabase
      .from('hoppn_dishes')
      .update({ ...dishData, updated_at: new Date().toISOString() })
      .eq('id', dishId)
      .select()
      .single()
    return { data, error }
  },

  async deleteDish(dishId: string) {
    const { error } = await supabase
      .from('hoppn_dishes')
      .delete()
      .eq('id', dishId)
    return { error }
  },

  async updateRestaurant(restaurantId: string, restaurantData: any) {
    const { data, error } = await supabase
      .from('restaurants')
      .update({ ...restaurantData, updated_at: new Date().toISOString() })
      .eq('id', restaurantId)
      .select()
      .single()
    return { data, error }
  },

  async uploadFile(bucket: string, path: string, file: File) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      })
    return { data, error }
  },

  async deleteFile(bucket: string, path: string) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])
    return { error }
  },

  async getPublicUrl(bucket: string, path: string) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    return data.publicUrl
  },
}

// Real-time subscriptions
export const subscriptions = {
  subscribeToOrders(restaurantId: string, callback: (orders: any[]) => void) {
    return supabase
      .channel('orders')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders',
        filter: `restaurant_id=eq.${restaurantId}`,
      }, (payload) => {
        callback([payload.new])
      })
      .subscribe()
  },

  subscribeToOrderStatus(orderId: string, callback: (order: any) => void) {
    return supabase
      .channel('order_status')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${orderId}`,
      }, (payload) => {
        callback(payload.new)
      })
      .subscribe()
  },

  unsubscribe(channel: any) {
    return supabase.removeChannel(channel)
  },
}

export default supabase