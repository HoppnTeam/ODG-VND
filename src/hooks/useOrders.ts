'use client'

// ⚠️ DO NOT MODIFY AUTHENTICATION SETUP WITHOUT CODE OWNER APPROVAL
// This hook uses createClientComponentClient for proper auth handling
// DO NOT change to createBrowserClient or other client creation methods
// 
// If authentication modifications are needed, contact code owner first

import { useState, useEffect, useCallback } from 'react'
import { Database } from '@/types/supabase'
import { useAuth } from './useAuth'

type Order = Database['public']['Tables']['orders']['Row']

export function useOrders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const restaurantId = user?.restaurant?.id

  const fetchOrders = useCallback(async () => {
    if (!restaurantId) return
    
    try {
      setLoading(true)
      const response = await fetch('/api/orders')
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }
      
      const data = await response.json()
      setOrders(data.orders || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }, [restaurantId])

  const updateOrderStatus = async (orderId: string, status: Database['public']['Enums']['order_status']) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error('Failed to update order status')
      }

      const data = await response.json()
      fetchOrders() // Simple refetch
      return data.order
    } catch (err) {
      console.error('Error updating order status:', err)
      throw err
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  return {
    orders,
    loading,
    error,
    fetchOrders,
    updateOrderStatus,
  }
}