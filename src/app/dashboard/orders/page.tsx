'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useOrders } from '@/hooks/useOrders'
import { LoadingPage } from '@/components/ui/loading'
import { PageTransition } from '@/components/ui/PageTransition'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, User, DollarSign, CheckCircle, AlertCircle, Package } from 'lucide-react'
import { Database } from '@/types/supabase'
import { OrderDisplay } from '@/types/api'

type OrderStatus = Database['public']['Enums']['order_status']

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case 'pending': return 'bg-orange-500 hover:bg-orange-600'
    case 'confirmed': return 'bg-blue-500 hover:bg-blue-600'
    case 'preparing': return 'bg-purple-500 hover:bg-purple-600'
    case 'ready': return 'bg-green-500 hover:bg-green-600'
    case 'picked_up': return 'bg-gray-500 hover:bg-gray-600'
    case 'cancelled': return 'bg-red-500 hover:bg-red-600'
    default: return 'bg-gray-500 hover:bg-gray-600'
  }
}

const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case 'pending': return <AlertCircle className="w-5 h-5" />
    case 'confirmed': return <CheckCircle className="w-5 h-5" />
    case 'preparing': return <Package className="w-5 h-5" />
    case 'ready': return <CheckCircle className="w-5 h-5" />
    case 'picked_up': return <CheckCircle className="w-5 h-5" />
    case 'cancelled': return <AlertCircle className="w-5 h-5" />
    default: return <Clock className="w-5 h-5" />
  }
}

const getNextStatus = (status: OrderStatus): OrderStatus | null => {
  switch (status) {
    case 'pending': return 'confirmed'
    case 'confirmed': return 'preparing'
    case 'preparing': return 'ready'
    case 'ready': return 'picked_up'
    default: return null
  }
}

const getNextStatusText = (status: OrderStatus) => {
  switch (status) {
    case 'pending': return 'Accept Order'
    case 'confirmed': return 'Start Preparing'
    case 'preparing': return 'Mark Ready'
    case 'ready': return 'Mark Picked Up'
    default: return 'Update Status'
  }
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

const formatPickupTime = (orderTime: string, estimatedPrepTime: number) => {
  const orderDate = new Date(orderTime)
  const pickupDate = new Date(orderDate.getTime() + estimatedPrepTime * 60000)
  return formatTime(pickupDate.toISOString())
}

// Memoized Order Card Component for performance
const OrderCard = React.memo(({ 
  order, 
  isUpdating, 
  onStatusUpdate 
}: { 
  order: OrderDisplay, 
  isUpdating: boolean, 
  onStatusUpdate: (orderId: string, status: OrderStatus) => void 
}) => {
  const nextStatus = getNextStatus(order.status)
  
  return (
    <div 
      className="bg-white rounded-xl shadow-sm border-2 transition-all duration-200"
      style={{ 
        borderColor: 'var(--color-border)'
      }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-hoppn-orange)'}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
    >
      {/* Order Header */}
      <div className="p-4 md:p-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-1" style={{ color: 'var(--color-text-dark)' }}>
              {order.order_number}
            </h3>
            <div className="flex items-center gap-2" style={{ color: 'var(--color-text-medium)' }}>
              <User className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-base md:text-lg font-medium" style={{ color: 'var(--color-text-medium)' }}>{order.customer_name}</span>
            </div>
          </div>
          <Badge 
            className={`${getStatusColor(order.status)} text-white text-sm md:text-base px-3 py-1 capitalize`}
          >
            {order.status}
          </Badge>
        </div>
        
        {/* Time Info */}
        <div className="grid grid-cols-2 gap-4 text-sm md:text-base">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Ordered: {formatTime(order.created_at)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Pickup: {order.pickup_time ? formatTime(order.pickup_time) : formatPickupTime(order.created_at, order.estimated_prep_time)}</span>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="p-4 md:p-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <h4 className="text-base md:text-lg font-semibold mb-3" style={{ color: 'var(--color-text-dark)' }}>Order Items</h4>
        <div className="space-y-3">
          {Array.isArray(order.items) && order.items.map((item, index) => (
            <div key={`${order.id}-item-${index}`} className="flex justify-between items-center">
              <div>
                <span className="text-sm md:text-base font-medium text-gray-900">
                  {item.quantity}x {item.name}
                </span>
              </div>
              <span className="text-sm md:text-base font-semibold text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        
        {order.special_instructions && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm md:text-base text-yellow-800 font-medium">
              <strong>Special Instructions:</strong> {order.special_instructions}
            </p>
          </div>
        )}
      </div>

      {/* Order Footer */}
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
            <span className="text-xl md:text-2xl font-bold text-gray-900">
              ${order.total.toFixed(2)}
            </span>
          </div>
        </div>
        
        {/* Action Button - Large Touch Target */}
        <Button 
          onClick={() => onStatusUpdate(order.id, order.status)}
          className={`w-full ${getStatusColor(order.status)} text-white font-semibold text-base md:text-lg py-3 md:py-4 h-12 md:h-16 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3`}
          disabled={isUpdating || !nextStatus}
        >
          {getStatusIcon(order.status)}
          {isUpdating ? 'Updating...' : getNextStatusText(order.status)}
        </Button>
      </div>
    </div>
  )
})

OrderCard.displayName = 'OrderCard'

function OrdersPage() {
  const { loading: authLoading, isAuthenticated, isVendor, hasRestaurant } = useAuth()
  const { orders, loading: ordersLoading, error, updateOrderStatus } = useOrders()
  const [updatingOrders, setUpdatingOrders] = useState<Set<string>>(new Set())

  // Memoized status update handler
  const handleStatusUpdate = useCallback(async (orderId: string, currentStatus: OrderStatus) => {
    const nextStatus = getNextStatus(currentStatus)
    if (!nextStatus) return

    setUpdatingOrders(prev => new Set(prev).add(orderId))
    
    try {
      await updateOrderStatus(orderId, nextStatus)
    } catch (error) {
      console.error('Failed to update order status:', error)
      // You could add a toast notification here
    } finally {
      setUpdatingOrders(prev => {
        const newSet = new Set(prev)
        newSet.delete(orderId)
        return newSet
      })
    }
  }, [updateOrderStatus])

  // Memoized status counts for performance
  const statusCounts = useMemo(() => ({
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length
  }), [orders])

  if (authLoading) {
    return <LoadingPage message="Loading orders..." />
  }

  if (!isAuthenticated || !isVendor || !hasRestaurant) {
    return null // Will be handled by dashboard layout
  }

  return (
    <DashboardLayout>
      <PageTransition 
        isLoading={ordersLoading}
        error={error}
        loadingMessage="Loading orders..."
        errorTitle="Error Loading Orders"
        onRetry={() => window.location.reload()}
      >
        <div className="container mx-auto px-4 md:px-6 py-4 md:py-8" style={{ backgroundColor: 'var(--color-earth-beige)' }}>
        {/* Header - Tablet Optimized */}
        <div className="rounded-xl shadow-sm p-4 md:p-6 mb-4 md:mb-6" style={{ backgroundColor: 'var(--color-warm-cream)' }}>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: 'Montserrat, sans-serif', color: 'var(--color-text-dark)' }}>
                Kitchen Orders
              </h2>
              <p className="text-base md:text-lg" style={{ color: 'var(--color-text-medium)' }}>
                {orders.length} total orders • Tap to update status
              </p>
            </div>
            <div className="flex gap-2 md:gap-4">
              <Badge variant="outline" className="text-sm md:text-base px-3 md:px-4 py-2" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-dark)', backgroundColor: '#FFFFFF' }}>
                <span style={{ color: '#F15029' }}>●</span> {statusCounts.pending} Pending
              </Badge>
              <Badge variant="outline" className="text-sm md:text-base px-3 md:px-4 py-2" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-dark)', backgroundColor: '#FFFFFF' }}>
                <span style={{ color: '#2563EB' }}>●</span> {statusCounts.preparing} Preparing
              </Badge>
              <Badge variant="outline" className="text-sm md:text-base px-3 md:px-4 py-2" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-dark)', backgroundColor: '#FFFFFF' }}>
                <span style={{ color: '#10B981' }}>●</span> {statusCounts.ready} Ready
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Orders Grid - Tablet Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              isUpdating={updatingOrders.has(order.id)}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </div>

        {/* Empty State - If no orders */}
        {orders.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
            <div className="flex justify-center items-center py-8">
              <div className="text-center">
                <div className="text-6xl md:text-8xl mb-6">📋</div>
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">No Orders Yet</h3>
                <p className="text-base md:text-lg text-gray-600 max-w-md mx-auto">
                  When customers place orders, they will appear here. Make sure your menu is set up to start receiving orders.
                </p>
              </div>
            </div>
          </div>
        )}
        </div>
      </PageTransition>
    </DashboardLayout>
  )
}

// Export memoized component for better performance
export default React.memo(OrdersPage)
