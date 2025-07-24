// API-specific type definitions

import { Database } from './supabase'
import { User } from '@supabase/supabase-js'

// Stripe types
export interface StripeAccount {
  id: string
  charges_enabled: boolean
  details_submitted: boolean
  payouts_enabled: boolean
  requirements?: {
    currently_due: string[]
    eventually_due: string[]
    past_due: string[]
  }
}

export interface StripeTransaction {
  id: string
  amount: number
  description: string
  created: number
  status: string
  type: 'payment' | 'payout'
}

export interface StripeBalance {
  available: Array<{
    amount: number
    currency: string
  }>
  pending: Array<{
    amount: number
    currency: string
  }>
}

// Supabase Admin types
export interface SupabaseAdminUser extends User {
  user_metadata?: {
    user_type?: string
    registration_type?: string
  }
}

export interface AdminUserListResponse {
  users?: SupabaseAdminUser[]
}

// Vendor registration types
export interface VendorRegistrationPayload {
  email: string
  password: string
  vendorData: {
    name: string
    description: string
    phone_number: string
    address: string
    cuisine_type: string
    owner_name: string
  }
}

export interface PendingVendorData {
  id: string
  name: string
  description: string
  email: string
  phone_number: string
  address: string
  cuisine_type: string
  owner_name: string
  business_license: string
  status: string
}

// Cookie options type
export interface CookieOptions {
  name: string
  value: string
  httpOnly?: boolean
  secure?: boolean
  sameSite?: 'lax' | 'strict' | 'none'
  maxAge?: number
  path?: string
  domain?: string
}

// Cache item types
export interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

// Order item types for Orders page
export interface OrderItemDisplay {
  name: string
  quantity: number
  price: number
}

export interface OrderDisplay {
  id: string
  order_number: string
  customer_name: string
  status: Database['public']['Enums']['order_status']
  created_at: string
  pickup_time?: string
  estimated_prep_time: number
  items: OrderItemDisplay[]
  special_instructions?: string
  total: number
}

// Error types
export interface ErrorWithMessage {
  message: string
  code?: string
}

export interface SupabaseError {
  message: string
  code: string
  details?: string
}

// File upload types
export interface FileUploadResult {
  path: string
  id: string
  fullPath: string
}

// Realtime subscription types
export type PostgresChangePayload<T = unknown> = {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new: T
  old: T
  schema: string
  table: string
}

// Form data types
export interface SignUpFormData {
  email: string
  password: string
  userData?: Record<string, unknown>
}

// Utility types
export type AsyncFunction<T extends unknown[], R> = (...args: T) => Promise<R>

export type DebounceFunction<T extends unknown[]> = (...args: T) => void