'use client'

import { useAuth } from '@/hooks/useAuth'
import { LoadingPage } from '@/components/ui/loading'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts'

// Sample data for charts
const orderData = [
  { name: 'Mon', orders: 0 },
  { name: 'Tue', orders: 0 },
  { name: 'Wed', orders: 0 },
  { name: 'Thu', orders: 0 },
  { name: 'Fri', orders: 0 },
  { name: 'Sat', orders: 0 },
  { name: 'Sun', orders: 0 },
]

const revenueData = [
  { name: 'Week 1', revenue: 0 },
  { name: 'Week 2', revenue: 0 },
  { name: 'Week 3', revenue: 0 },
  { name: 'Week 4', revenue: 0 },
]

export default function AnalyticsPage() {
  const { loading, isAuthenticated, isVendor, hasRestaurant } = useAuth()

  if (loading) {
    return <LoadingPage message="Loading analytics..." />
  }

  if (!isAuthenticated || !isVendor || !hasRestaurant) {
    return null // Will be handled by dashboard layout
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Analytics Dashboard
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders This Week</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={orderData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#F15029" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={revenueData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Revenue']}
                />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#FFBF00" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Orders</h3>
            <div className="text-3xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              0
            </div>
            <p className="text-sm text-gray-600">All time</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Revenue</h3>
            <div className="text-3xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              $0.00
            </div>
            <p className="text-sm text-gray-600">All time</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Average Order Value</h3>
            <div className="text-3xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              $0.00
            </div>
            <p className="text-sm text-gray-600">All time</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Dishes</h3>
          <div className="flex justify-center items-center py-8">
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                As you receive orders, you'll see which dishes are most popular with your customers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
