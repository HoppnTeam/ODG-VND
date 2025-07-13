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
      },
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
      },
      hoppn_dishes: {
        Row: {
          id: string
          name: string
          description: string
          category: Database['public']['Enums']['dish_category']
          country_origin: string
          country_flag: string
          country_id: string
          base_spice_level: number
          origin_story: string | null
          base_ingredients: string[]
          cultural_significance: string | null
          health_benefits: string | null
          native_regions: string[]
          taste_profile: string | null
          preparation_method: string | null
          is_vegetarian: boolean
          is_vegan: boolean
          is_halal: boolean
          calories: number | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          category: Database['public']['Enums']['dish_category']
          country_origin: string
          country_flag: string
          country_id: string
          base_spice_level?: number
          origin_story?: string | null
          base_ingredients?: string[]
          cultural_significance?: string | null
          health_benefits?: string | null
          native_regions?: string[]
          taste_profile?: string | null
          preparation_method?: string | null
          is_vegetarian?: boolean
          is_vegan?: boolean
          is_halal?: boolean
          calories?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          category?: Database['public']['Enums']['dish_category']
          country_origin?: string
          country_flag?: string
          country_id?: string
          base_spice_level?: number
          origin_story?: string | null
          base_ingredients?: string[]
          cultural_significance?: string | null
          health_benefits?: string | null
          native_regions?: string[]
          taste_profile?: string | null
          preparation_method?: string | null
          is_vegetarian?: boolean
          is_vegan?: boolean
          is_halal?: boolean
          calories?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      },
      dishes: {
        Row: {
          id: string
          restaurant_id: string
          hoppn_dish_id: string | null
          name: string
          description: string
          image_url: string | null
          price: number
          size_options: string[] | null
          custom_ingredients: string | null
          restaurant_notes: string | null
          chef_special: boolean
          category: Database['public']['Enums']['dish_category']
          country_origin: string
          country_flag: string
          is_active: boolean
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          hoppn_dish_id?: string | null
          name: string
          description: string
          image_url?: string | null
          price: number
          size_options?: string[] | null
          custom_ingredients?: string | null
          restaurant_notes?: string | null
          chef_special?: boolean
          category: Database['public']['Enums']['dish_category']
          country_origin: string
          country_flag: string
          is_active?: boolean
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          hoppn_dish_id?: string | null
          name?: string
          description?: string
          image_url?: string | null
          price?: number
          size_options?: string[] | null
          custom_ingredients?: string | null
          restaurant_notes?: string | null
          chef_special?: boolean
          category?: Database['public']['Enums']['dish_category']
          country_origin?: string
          country_flag?: string
          is_active?: boolean
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dishes_restaurant_id_fkey"
            columns: ["restaurant_id"]
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dishes_hoppn_dish_id_fkey"
            columns: ["hoppn_dish_id"]
            referencedRelation: "hoppn_dishes"
            referencedColumns: ["id"]
          }
        ]
      },
      reviews: {
        Row: {
          id: string
          user_id: string
          dish_id: string
          restaurant_id: string
          order_id: string
          rating: number
          comment: string
          spice_level_rating: number | null
          authenticity_rating: number | null
          cultural_experience_rating: number | null
          overall_experience: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          dish_id: string
          restaurant_id: string
          order_id: string
          rating: number
          comment: string
          spice_level_rating?: number | null
          authenticity_rating?: number | null
          cultural_experience_rating?: number | null
          overall_experience?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          dish_id?: string
          restaurant_id?: string
          order_id?: string
          rating?: number
          comment?: string
          spice_level_rating?: number | null
          authenticity_rating?: number | null
          cultural_experience_rating?: number | null
          overall_experience?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_restaurant_id_fkey"
            columns: ["restaurant_id"]
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_dish_id_fkey"
            columns: ["dish_id"]
            referencedRelation: "dishes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
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