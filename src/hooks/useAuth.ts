'use client'

// ⚠️ CRITICAL: DO NOT MODIFY WITHOUT CODE OWNER APPROVAL
// Central authentication hook used throughout the entire application
// This hook manages user state, vendor verification, and restaurant data
// 
// IMPORTANT: This hook is used by:
// - Dashboard layout for route protection
// - All dashboard pages for user verification
// - Components that need user/vendor/restaurant data
// 
// DO NOT modify the authentication logic or state management
// Changes can break login/logout functionality across the app
// 
// If you need to modify this file:
// 1. Contact the code owner first
// 2. Test all authentication flows (login, logout, registration)
// 3. Verify vendor and restaurant data loading
// 4. Test protected route access
// 5. Update the AUTHENTICATION_FLOW.md documentation

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, authHelpers, dbHelpers } from '@/lib/supabase'
import { VendorUser, Restaurant } from '@/types'

interface AuthUser extends User {
  vendorUser?: VendorUser
  restaurant?: Restaurant
}

interface AuthState {
  user: AuthUser | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { session } = await authHelpers.getCurrentSession()
        
        if (session?.user) {
          await loadUserData(session.user)
        } else {
          setState({ user: null, loading: false, error: null })
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
        setState({ user: null, loading: false, error: 'Failed to load session' })
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await loadUserData(session.user)
        } else {
          setState({ user: null, loading: false, error: null })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadUserData = async (user: User) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      console.log('Auth user details:')
      console.log('- ID:', user.id)
      console.log('- Email:', user.email)
      console.log('- Created at:', user.created_at)

      // Get vendor user data
      const { data: vendorUser, error: vendorError } = await dbHelpers.getVendorUser(user.id)
      
      console.log('Vendor user found:', vendorUser ? 'Yes' : 'No')
      if (vendorError) {
        console.log('Vendor error:', vendorError)
      }
      
      if (vendorError && vendorError.code !== 'PGRST116') { // PGRST116 is "not found"
        throw vendorError
      }

      let restaurant = null
      if (vendorUser) {
        // Get restaurant data using auth_user_id directly
        const { data: restaurantData, error: restaurantError } = await supabase
          .from('restaurants')
          .select('*')
          .eq('vendor_id', user.id) // Use auth_user_id directly
          .single()
        
        if (restaurantError && restaurantError.code !== 'PGRST116') {
          throw restaurantError
        }
        
        restaurant = restaurantData
        
        console.log('Restaurant lookup result:', restaurant ? 'Found' : 'Not found')
        if (restaurantError) {
          console.log('Restaurant lookup error:', restaurantError)
        }
      }

      const authUser: AuthUser = {
        ...user,
        vendorUser: vendorUser || undefined,
        restaurant: restaurant || undefined
      }

      console.log('isVendor value:', !!vendorUser)
      console.log('hasRestaurant value:', !!restaurant)
      
      setState({ user: authUser, loading: false, error: null })
    } catch (error) {
      console.error('Error loading user data:', error)
      setState({ 
        user: { ...user }, 
        loading: false, 
        error: 'Failed to load user data' 
      })
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const { data, error } = await authHelpers.signIn(email, password)
      
      if (error) {
        throw error
      }

      // User data will be loaded by the auth state change listener
      return { success: true, error: null }
    } catch (error: any) {
      setState(prev => ({ ...prev, loading: false, error: error.message }))
      return { success: false, error: error.message }
    }
  }

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const { data, error } = await authHelpers.signUp(email, password, userData)
      
      if (error) {
        throw error
      }

      return { success: true, error: null, data }
    } catch (error: any) {
      setState(prev => ({ ...prev, loading: false, error: error.message }))
      return { success: false, error: error.message }
    }
  }

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const { error } = await authHelpers.signOut()
      
      if (error) {
        throw error
      }

      setState({ user: null, loading: false, error: null })
      return { success: true, error: null }
    } catch (error: any) {
      setState(prev => ({ ...prev, loading: false, error: error.message }))
      return { success: false, error: error.message }
    }
  }

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }))
  }

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    clearError,
    isVendor: !!state.user?.vendorUser,
    hasRestaurant: !!state.user?.restaurant,
    isAuthenticated: !!state.user
  }
}