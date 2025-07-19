'use client'

// ⚠️ DO NOT MODIFY AUTHENTICATION SETUP WITHOUT CODE OWNER APPROVAL
// This hook uses createClientComponentClient for proper auth handling
// DO NOT change to createBrowserClient or other client creation methods
// 
// If authentication modifications are needed, contact code owner first

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/supabase'
import { useAuth } from './useAuth'

type Dish = Database['public']['Tables']['dishes']['Row']
type DishInsert = Database['public']['Tables']['dishes']['Insert']
type DishUpdate = Database['public']['Tables']['dishes']['Update']

export function useDishes() {
  const { user } = useAuth()
  const [dishes, setDishes] = useState<Dish[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const restaurantId = user?.restaurant?.id

  const fetchDishes = useCallback(async () => {
    if (!restaurantId) return
    
    try {
      setLoading(true)
      const response = await fetch('/api/dishes')
      
      if (!response.ok) {
        throw new Error('Failed to fetch dishes')
      }
      
      const data = await response.json()
      setDishes(data.dishes || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching dishes:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch dishes')
    } finally {
      setLoading(false)
    }
  }, [restaurantId])

  const createDish = async (dishData: Omit<DishInsert, 'id' | 'restaurant_id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('/api/dishes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dishData),
      })

      if (!response.ok) {
        throw new Error('Failed to create dish')
      }

      const data = await response.json()
      fetchDishes() // Simple refetch
      return data.dish
    } catch (err) {
      console.error('Error creating dish:', err)
      throw err
    }
  }

  const updateDish = async (dishId: string, dishData: Partial<DishUpdate>) => {
    try {
      const response = await fetch(`/api/dishes/${dishId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dishData),
      })

      if (!response.ok) {
        throw new Error('Failed to update dish')
      }

      const data = await response.json()
      fetchDishes() // Simple refetch
      return data.dish
    } catch (err) {
      console.error('Error updating dish:', err)
      throw err
    }
  }

  const deleteDish = async (dishId: string) => {
    try {
      const response = await fetch(`/api/dishes/${dishId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete dish')
      }
      
      fetchDishes() // Simple refetch
    } catch (err) {
      console.error('Error deleting dish:', err)
      throw err
    }
  }

  const toggleDishAvailability = async (dishId: string, isActive: boolean) => {
    return updateDish(dishId, { is_active: isActive })
  }

  useEffect(() => {
    fetchDishes()
  }, [fetchDishes])

  return {
    dishes,
    loading,
    error,
    fetchDishes,
    createDish,
    updateDish,
    deleteDish,
    toggleDishAvailability,
  }
}