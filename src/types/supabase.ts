export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      pending_vendors: {
        Row: {
          id: string
          email: string
          business_name: string
          owner_name: string
          phone: string
          business_license: string
          cuisine_region: Database['public']['Enums']['cuisine_region']
          description: string
          street_address: string
          city: string
          state: string
          zip_code: string
          latitude: number | null
          longitude: number | null
          business_hours: Json
          pickup_instructions: string
          special_notes: string | null
          business_license_file: string
          food_handler_permit: string
          restaurant_photos: string[]
          terms_accepted: boolean
          payment_processing_accepted: boolean
          marketing_consent: boolean
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          business_name: string
          owner_name: string
          phone: string
          business_license: string
          cuisine_region: Database['public']['Enums']['cuisine_region']
          description: string
          street_address: string
          city: string
          state: string
          zip_code: string
          latitude?: number | null
          longitude?: number | null
          business_hours: Json
          pickup_instructions: string
          special_notes?: string | null
          business_license_file: string
          food_handler_permit: string
          restaurant_photos?: string[]
          terms_accepted: boolean
          payment_processing_accepted: boolean
          marketing_consent?: boolean
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          business_name?: string
          owner_name?: string
          phone?: string
          business_license?: string
          cuisine_region?: Database['public']['Enums']['cuisine_region']
          description?: string
          street_address?: string
          city?: string
          state?: string
          zip_code?: string
          latitude?: number | null
          longitude?: number | null
          business_hours?: Json
          pickup_instructions?: string
          special_notes?: string | null
          business_license_file?: string
          food_handler_permit?: string
          restaurant_photos?: string[]
          terms_accepted?: boolean
          payment_processing_accepted?: boolean
          marketing_consent?: boolean
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      vendor_users: {
        Row: {
          id: string
          auth_user_id: string
          email: string
          name: string
          business_name: string
          phone: string
          status: 'active' | 'suspended' | 'pending'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_user_id: string
          email: string
          name: string
          business_name: string
          phone: string
          status?: 'active' | 'suspended' | 'pending'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          auth_user_id?: string
          email?: string
          name?: string
          business_name?: string
          phone?: string
          status?: 'active' | 'suspended' | 'pending'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      restaurants: {
        Row: {
          id: string
          vendor_user_id: string
          name: string
          description: string
          cuisine_type: Database['public']['Enums']['cuisine_region']
          address: string
          latitude: number
          longitude: number
          phone: string
          email: string
          business_hours: Json
          pickup_instructions: string
          special_notes: string | null
          logo_url: string | null
          cover_image_url: string | null
          gallery_images: string[]
          avg_rating: number
          total_reviews: number
          status: 'active' | 'inactive' | 'suspended'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vendor_user_id: string
          name: string
          description: string
          cuisine_type: Database['public']['Enums']['cuisine_region']
          address: string
          latitude: number
          longitude: number
          phone: string
          email: string
          business_hours: Json
          pickup_instructions: string
          special_notes?: string | null
          logo_url?: string | null
          cover_image_url?: string | null
          gallery_images?: string[]
          avg_rating?: number
          total_reviews?: number
          status?: 'active' | 'inactive' | 'suspended'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vendor_user_id?: string
          name?: string
          description?: string
          cuisine_type?: Database['public']['Enums']['cuisine_region']
          address?: string
          latitude?: number
          longitude?: number
          phone?: string
          email?: string
          business_hours?: Json
          pickup_instructions?: string
          special_notes?: string | null
          logo_url?: string | null
          cover_image_url?: string | null
          gallery_images?: string[]
          avg_rating?: number
          total_reviews?: number
          status?: 'active' | 'inactive' | 'suspended'
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurants_vendor_user_id_fkey"
            columns: ["vendor_user_id"]
            isOneToOne: false
            referencedRelation: "vendor_users"
            referencedColumns: ["id"]
          }
        ]
      }
      hoppn_dishes: {
        Row: {
          id: string
          restaurant_id: string
          name: string
          description: string
          cultural_story: string | null
          category: Database['public']['Enums']['dish_category']
          origin_country: string
          african_region: Database['public']['Enums']['cuisine_region']
          spice_level: number
          preparation_time: number
          ingredients: string[]
          allergens: string[]
          dietary_tags: string[]
          price: number
          sizes: Json
          primary_image_url: string | null
          additional_images: string[]
          available: boolean
          stock_quantity: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          name: string
          description: string
          cultural_story?: string | null
          category: Database['public']['Enums']['dish_category']
          origin_country: string
          african_region: Database['public']['Enums']['cuisine_region']
          spice_level: number
          preparation_time: number
          ingredients: string[]
          allergens: string[]
          dietary_tags: string[]
          price: number
          sizes?: Json
          primary_image_url?: string | null
          additional_images?: string[]
          available?: boolean
          stock_quantity?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          name?: string
          description?: string
          cultural_story?: string
          category?: Database['public']['Enums']['dish_category']
          origin_country?: string
          african_region?: Database['public']['Enums']['cuisine_region']
          spice_level?: number
          preparation_time?: number
          ingredients?: string[]
          allergens?: string[]
          dietary_tags?: string[]
          price?: number
          sizes?: Json
          primary_image_url?: string | null
          additional_images?: string[]
          available?: boolean
          stock_quantity?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hoppn_dishes_restaurant_id_fkey"
            columns: ["restaurant_id"]
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          id: string
          order_number: string
          customer_id: string
          restaurant_id: string
          items: Json
          subtotal: number
          tax: number
          service_fee: number
          total: number
          status: Database['public']['Enums']['order_status']
          special_instructions: string | null
          pickup_time: string | null
          estimated_prep_time: number
          actual_prep_time: number | null
          customer_name: string
          customer_phone: string
          customer_email: string
          payment_intent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          customer_id: string
          restaurant_id: string
          items: Json
          subtotal: number
          tax: number
          service_fee: number
          total: number
          status?: Database['public']['Enums']['order_status']
          special_instructions?: string | null
          pickup_time?: string | null
          estimated_prep_time: number
          actual_prep_time?: number | null
          customer_name: string
          customer_phone: string
          customer_email: string
          payment_intent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          customer_id?: string
          restaurant_id?: string
          items?: Json
          subtotal?: number
          tax?: number
          service_fee?: number
          total?: number
          status?: Database['public']['Enums']['order_status']
          special_instructions?: string | null
          pickup_time?: string | null
          estimated_prep_time?: number
          actual_prep_time?: number | null
          customer_name?: string
          customer_phone?: string
          customer_email?: string
          payment_intent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_restaurant_id_fkey"
            columns: ["restaurant_id"]
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      cuisine_region: 'west_african' | 'east_african' | 'north_african' | 'south_african' | 'central_african'
      order_status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'cancelled'
      dish_category: 'stews_soups' | 'meats_seafood' | 'rice_beans' | 'breakfast' | 'vegetarian_vegan' | 'snacks_street_foods' | 'salads_extras' | 'beverages' | 'desserts' | 'spices_seasonings'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}