import { Database } from './supabase'

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// Core types
export type PendingVendor = Tables<'pending_vendors'>
export type VendorUser = Tables<'vendor_users'>
export type Restaurant = Tables<'restaurants'>
export type HoppnDish = Tables<'hoppn_dishes'>
export type Order = Tables<'orders'>

// Enums
export type CuisineRegion = Enums<'cuisine_region'>
export type OrderStatus = Enums<'order_status'>
export type DishCategory = Enums<'dish_category'>

// Extended types
export interface DashboardMetrics {
  todayOrders: number
  todayRevenue: number
  weeklyOrders: number
  weeklyRevenue: number
  monthlyOrders: number
  monthlyRevenue: number
  avgRating: number
  totalDishes: number
  activeDishes: number
  avgPrepTime: number
  responseRate: number
  popularDish: {
    name: string
    orders: number
  }
}

export interface OrderWithItems extends Order {
  items: OrderItem[]
  customer: {
    name: string
    phone: string
    email: string
  }
}

export interface OrderItem {
  id: string
  dish_id: string
  dish_name: string
  quantity: number
  price: number
  size?: string
  special_instructions?: string
  dish?: HoppnDish
}

export interface DishWithRestaurant extends HoppnDish {
  restaurant: Restaurant
}

export interface RestaurantWithDishes extends Restaurant {
  dishes: HoppnDish[]
  owner: VendorUser
}

export interface AnalyticsData {
  period: 'day' | 'week' | 'month' | 'year'
  revenue: Array<{ date: string; amount: number }>
  orders: Array<{ date: string; count: number }>
  topDishes: Array<{ name: string; orders: number; revenue: number }>
  categoryPerformance: Array<{ category: string; orders: number; revenue: number }>
  hourlyDistribution: Array<{ hour: number; orders: number }>
  customerInsights: {
    repeatCustomers: number
    avgOrderValue: number
    spiceLevelPreference: Array<{ level: number; percentage: number }>
    cuisinePreference: Array<{ region: CuisineRegion; percentage: number }>
  }
}

export interface PaymentData {
  grossRevenue: number
  hoppnCommission: number
  stripeFee: number
  netPayout: number
  nextPayoutDate: string
  payoutHistory: Array<{
    date: string
    grossSales: number
    hoppnFee: number
    stripeFee: number
    netPayout: number
    status: 'pending' | 'paid' | 'failed'
  }>
}

export interface VendorRegistrationData {
  // Step 1: Business Information
  businessName: string
  ownerName: string
  email: string
  phone: string
  businessLicense: string
  cuisineRegion: CuisineRegion
  description: string
  
  // Step 2: Location & Contact
  streetAddress: string
  city: string
  state: string
  zipCode: string
  latitude?: number
  longitude?: number
  businessHours: {
    [key: string]: { open: string; close: string; closed: boolean }
  }
  pickupInstructions: string
  specialNotes?: string
  
  // Step 3: Documentation
  businessLicenseFile: File
  foodHandlerPermit: File
  restaurantPhotos: File[]
  termsAccepted: boolean
  paymentProcessingAccepted: boolean
  marketingConsent: boolean
}

export interface NotificationData {
  id: string
  type: 'order' | 'payment' | 'system' | 'marketing'
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
}

export interface UserSession {
  user: VendorUser
  restaurant: Restaurant
  permissions: string[]
  lastActivity: Date
}

export interface FormErrors {
  [key: string]: string | undefined
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T = any> {
  data: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface FilterOptions {
  search?: string
  category?: DishCategory
  cuisineRegion?: CuisineRegion
  status?: OrderStatus
  dateFrom?: string
  dateTo?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface DishFormData {
  name: string
  description: string
  culturalStory: string
  category: DishCategory
  originCountry: string
  africanRegion: CuisineRegion
  spiceLevel: number
  preparationTime: number
  ingredients: string[]
  allergens: string[]
  dietaryTags: string[]
  basePrice: number
  sizes: {
    name: string
    price: number
    description: string
  }[]
  primaryImage: File | null
  additionalImages: File[]
  available: boolean
  stockQuantity?: number
}

export interface AIGeneratedDish {
  name: string
  description: string
  culturalStory: string
  category: DishCategory
  originCountry: string
  africanRegion: CuisineRegion
  spiceLevel: number
  preparationTime: number
  ingredients: string[]
  allergens: string[]
  dietaryTags: string[]
  suggestedPrice: number
}