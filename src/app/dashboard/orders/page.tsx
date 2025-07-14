'use client'

import { useAuth } from '@/hooks/useAuth'
import { LoadingPage } from '@/components/ui/loading'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, User, DollarSign, CheckCircle, AlertCircle, Package } from 'lucide-react'

// Mock order data for tablet demonstration
const mockOrders = [
  {
    id: 'ORD-001',
    customerName: 'Sarah Johnson',
    items: [
      { name: 'Jollof Rice with Chicken', quantity: 2, price: 15.99 },
      { name: 'Plantain Chips', quantity: 1, price: 5.99 }
    ],
    total: 37.97,
    status: 'new',
    orderTime: '2:45 PM',
    estimatedPickup: '3:15 PM',
    specialInstructions: 'Extra spicy please'
  },
  {
    id: 'ORD-002',
    customerName: 'Michael Chen',
    items: [
      { name: 'Egusi Soup with Pounded Yam', quantity: 1, price: 18.99 },
      { name: 'Chin Chin', quantity: 1, price: 4.99 }
    ],
    total: 23.98,
    status: 'preparing',
    orderTime: '2:30 PM',
    estimatedPickup: '3:00 PM',
    specialInstructions: ''
  },
  {
    id: 'ORD-003',
    customerName: 'Emma Davis',
    items: [
      { name: 'Suya Platter', quantity: 1, price: 22.99 }
    ],
    total: 22.99,
    status: 'ready',
    orderTime: '2:15 PM',
    estimatedPickup: '2:45 PM',
    specialInstructions: 'No onions'
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'new': return 'bg-orange-500 hover:bg-orange-600'
    case 'preparing': return 'bg-blue-500 hover:bg-blue-600'
    case 'ready': return 'bg-green-500 hover:bg-green-600'
    default: return 'bg-gray-500 hover:bg-gray-600'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'new': return <AlertCircle className="w-5 h-5" />
    case 'preparing': return <Package className="w-5 h-5" />
    case 'ready': return <CheckCircle className="w-5 h-5" />
    default: return <Clock className="w-5 h-5" />
  }
}

const getNextStatus = (status: string) => {
  switch (status) {
    case 'new': return 'preparing'
    case 'preparing': return 'ready'
    case 'ready': return 'completed'
    default: return status
  }
}

const getNextStatusText = (status: string) => {
  switch (status) {
    case 'new': return 'Accept Order'
    case 'preparing': return 'Mark Ready'
    case 'ready': return 'Complete Order'
    default: return 'Update Status'
  }
}

export default function OrdersPage() {
  const { loading, isAuthenticated, isVendor, hasRestaurant } = useAuth()

  if (loading) {
    return <LoadingPage message="Loading orders..." />
  }

  if (!isAuthenticated || !isVendor || !hasRestaurant) {
    return null // Will be handled by dashboard layout
  }

  const handleStatusUpdate = (orderId: string, currentStatus: string) => {
    // This would typically update the order status via API
    console.log(`Updating order ${orderId} from ${currentStatus} to ${getNextStatus(currentStatus)}`)
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 md:px-6 py-4 md:py-8">
        {/* Header - Tablet Optimized */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Kitchen Orders
              </h2>
              <p className="text-base md:text-lg text-gray-600">
                {mockOrders.length} active orders • Tap to update status
              </p>
            </div>
            <div className="flex gap-2 md:gap-4">
              <Badge variant="outline" className="text-sm md:text-base px-3 md:px-4 py-2">
                🔴 {mockOrders.filter(o => o.status === 'new').length} New
              </Badge>
              <Badge variant="outline" className="text-sm md:text-base px-3 md:px-4 py-2">
                🔵 {mockOrders.filter(o => o.status === 'preparing').length} Preparing
              </Badge>
              <Badge variant="outline" className="text-sm md:text-base px-3 md:px-4 py-2">
                🟢 {mockOrders.filter(o => o.status === 'ready').length} Ready
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Orders Grid - Tablet Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {mockOrders.map((order) => (
            <div 
              key={order.id}
              className="bg-white rounded-xl shadow-sm border-2 border-gray-100 hover:border-gray-200 transition-all duration-200"
            >
              {/* Order Header */}
              <div className="p-4 md:p-6 border-b border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                      {order.id}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="text-base md:text-lg font-medium">{order.customerName}</span>
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
                    <span>Ordered: {order.orderTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Pickup: {order.estimatedPickup}</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4 md:p-6 border-b border-gray-100">
                <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-3">Order Items</h4>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <span className="text-sm md:text-base font-medium text-gray-900">
                          {item.quantity}x {item.name}
                        </span>
                      </div>
                      <span className="text-sm md:text-base font-semibold text-gray-900">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                
                {order.specialInstructions && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm md:text-base text-yellow-800 font-medium">
                      <strong>Special Instructions:</strong> {order.specialInstructions}
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
                  onClick={() => handleStatusUpdate(order.id, order.status)}
                  className={`w-full ${getStatusColor(order.status)} text-white font-semibold text-base md:text-lg py-3 md:py-4 h-12 md:h-16 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3`}
                  disabled={order.status === 'ready'}
                >
                  {getStatusIcon(order.status)}
                  {getNextStatusText(order.status)}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State - If no orders */}
        {mockOrders.length === 0 && (
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
    </DashboardLayout>
  )
}
