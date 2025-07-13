'use client'

import { useAuth } from '@/hooks/useAuth'
import { LoadingPage } from '@/components/ui/loading'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { User, Lock, Bell, CreditCard, LogOut } from 'lucide-react'

export default function SettingsPage() {
  const { user, loading, isAuthenticated, isVendor, hasRestaurant } = useAuth()

  if (loading) {
    return <LoadingPage message="Loading settings..." />
  }

  if (!isAuthenticated || !isVendor || !hasRestaurant) {
    return null // Will be handled by dashboard layout
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Account Settings
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <nav className="p-2">
                <ul className="space-y-1">
                  <li>
                    <a href="#profile" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-orange-50 text-orange-600">
                      <User className="w-5 h-5" />
                      <span className="font-medium">Profile</span>
                    </a>
                  </li>
                  <li>
                    <a href="#security" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
                      <Lock className="w-5 h-5" />
                      <span className="font-medium">Security</span>
                    </a>
                  </li>
                  <li>
                    <a href="#notifications" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
                      <Bell className="w-5 h-5" />
                      <span className="font-medium">Notifications</span>
                    </a>
                  </li>
                  <li>
                    <a href="#billing" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
                      <CreditCard className="w-5 h-5" />
                      <span className="font-medium">Billing</span>
                    </a>
                  </li>
                </ul>
              </nav>
              <div className="p-2 border-t border-gray-200">
                <button className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-red-600 hover:bg-red-50">
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Settings Content */}
          <div className="lg:col-span-3">
            {/* Profile Section */}
            <div id="profile" className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    defaultValue={user?.vendorUser?.name || ''}
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    defaultValue={user?.vendorUser?.email || ''}
                    placeholder="Your email address"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    defaultValue={user?.vendorUser?.phone || ''}
                    placeholder="Your phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    defaultValue="Restaurant Owner"
                    disabled
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="hoppn">Save Changes</Button>
              </div>
            </div>
            
            {/* Security Section */}
            <div id="security" className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Change Password</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                      <input 
                        type="password" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter current password"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <input 
                        type="password" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter new password"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                      <input 
                        type="password" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button variant="hoppn">Update Password</Button>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Add an extra layer of security to your account by enabling two-factor authentication.
                  </p>
                  <Button variant="hoppnOutline">Enable 2FA</Button>
                </div>
              </div>
            </div>
            
            {/* Notifications Section */}
            <div id="notifications" className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <h4 className="font-medium text-gray-900">New Orders</h4>
                    <p className="text-sm text-gray-600">Get notified when you receive a new order</p>
                  </div>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <h4 className="font-medium text-gray-900">Order Updates</h4>
                    <p className="text-sm text-gray-600">Get notified about order status changes</p>
                  </div>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <h4 className="font-medium text-gray-900">Customer Messages</h4>
                    <p className="text-sm text-gray-600">Get notified when you receive a new message</p>
                  </div>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <div>
                    <h4 className="font-medium text-gray-900">Marketing Updates</h4>
                    <p className="text-sm text-gray-600">Receive news and promotional offers from Hoppn</p>
                  </div>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button variant="hoppn">Save Preferences</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
