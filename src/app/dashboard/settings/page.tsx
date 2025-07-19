'use client'

import { useAuth } from '@/hooks/useAuth'
import { LoadingPage } from '@/components/ui/loading'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { User, Lock, Bell, CreditCard, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const { user, loading, isAuthenticated, isVendor, hasRestaurant, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/login') // Explicit redirect for better UX
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return <LoadingPage message="Loading settings..." />
  }

  if (!isAuthenticated || !isVendor || !hasRestaurant) {
    return null // Will be handled by dashboard layout
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-6 py-8" style={{ backgroundColor: 'var(--color-earth-beige)' }}>
        <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif', color: 'var(--color-text-dark)' }}>
          Account Settings
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="rounded-lg shadow-sm overflow-hidden" style={{ backgroundColor: 'var(--color-warm-cream)' }}>
              <nav className="p-2">
                <ul className="space-y-1">
                  <li>
                    <a href="#profile" className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors" style={{ backgroundColor: 'var(--color-soft-orange)', color: 'var(--color-hoppn-orange)' }}>
                      <User className="w-5 h-5" />
                      <span className="font-medium">Profile</span>
                    </a>
                  </li>
                  <li>
                    <a href="#security" className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors" style={{ color: 'var(--color-text-medium)' }} onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-soft-orange)';
                      e.currentTarget.style.color = 'var(--color-text-dark)';
                    }} onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--color-text-medium)';
                    }}>
                      <Lock className="w-5 h-5" />
                      <span className="font-medium">Security</span>
                    </a>
                  </li>
                  <li>
                    <a href="#notifications" className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors" style={{ color: 'var(--color-text-medium)' }} onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-soft-orange)';
                      e.currentTarget.style.color = 'var(--color-text-dark)';
                    }} onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--color-text-medium)';
                    }}>
                      <Bell className="w-5 h-5" />
                      <span className="font-medium">Notifications</span>
                    </a>
                  </li>
                  <li>
                    <a href="#billing" className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors" style={{ color: 'var(--color-text-medium)' }} onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-soft-orange)';
                      e.currentTarget.style.color = 'var(--color-text-dark)';
                    }} onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--color-text-medium)';
                    }}>
                      <CreditCard className="w-5 h-5" />
                      <span className="font-medium">Billing</span>
                    </a>
                  </li>
                </ul>
              </nav>
              <div className="p-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <button 
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg w-full transition-colors" 
                  style={{ color: '#DC2626' }} 
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FEF2F2';
                  }} 
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Settings Content */}
          <div className="lg:col-span-3">
            {/* Profile Section */}
            <div id="profile" className="rounded-lg shadow-sm p-6 mb-6" style={{ backgroundColor: 'var(--color-warm-cream)' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-dark)' }}>Profile Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-dark)' }}>Full Name</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                    style={{
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-dark)',
                      backgroundColor: '#FFFFFF'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--color-hoppn-orange)';
                      e.target.style.boxShadow = '0 0 0 2px rgba(241, 80, 41, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--color-border)';
                      e.target.style.boxShadow = 'none';
                    }}
                    defaultValue={user?.vendorUser?.name || ''}
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-dark)' }}>Email Address</label>
                  <input 
                    type="email" 
                    className="w-full px-3 py-2 border rounded-md focus:outline-none"
                    style={{
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-medium)',
                      backgroundColor: '#F9F9F9'
                    }}
                    defaultValue={user?.vendorUser?.email || ''}
                    placeholder="Your email address"
                    disabled
                  />
                  <p className="text-xs mt-1" style={{ color: 'var(--color-text-light)' }}>Email cannot be changed</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-dark)' }}>Phone Number</label>
                  <input 
                    type="tel" 
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                    style={{
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-dark)',
                      backgroundColor: '#FFFFFF'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--color-hoppn-orange)';
                      e.target.style.boxShadow = '0 0 0 2px rgba(241, 80, 41, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--color-border)';
                      e.target.style.boxShadow = 'none';
                    }}
                    defaultValue={user?.vendorUser?.phone || ''}
                    placeholder="Your phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-dark)' }}>Role</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border rounded-md"
                    style={{
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-medium)',
                      backgroundColor: '#F9F9F9'
                    }}
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
            <div id="security" className="rounded-lg shadow-sm p-6 mb-6" style={{ backgroundColor: 'var(--color-warm-cream)' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-dark)' }}>Security Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3" style={{ color: 'var(--color-text-dark)' }}>Change Password</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-dark)' }}>Current Password</label>
                      <input 
                        type="password" 
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                        style={{
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-text-dark)',
                          backgroundColor: '#FFFFFF'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = 'var(--color-hoppn-orange)';
                          e.target.style.boxShadow = '0 0 0 2px rgba(241, 80, 41, 0.2)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'var(--color-border)';
                          e.target.style.boxShadow = 'none';
                        }}
                        placeholder="Enter current password"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-dark)' }}>New Password</label>
                      <input 
                        type="password" 
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                        style={{
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-text-dark)',
                          backgroundColor: '#FFFFFF'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = 'var(--color-hoppn-orange)';
                          e.target.style.boxShadow = '0 0 0 2px rgba(241, 80, 41, 0.2)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'var(--color-border)';
                          e.target.style.boxShadow = 'none';
                        }}
                        placeholder="Enter new password"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-dark)' }}>Confirm New Password</label>
                      <input 
                        type="password" 
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                        style={{
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-text-dark)',
                          backgroundColor: '#FFFFFF'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = 'var(--color-hoppn-orange)';
                          e.target.style.boxShadow = '0 0 0 2px rgba(241, 80, 41, 0.2)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'var(--color-border)';
                          e.target.style.boxShadow = 'none';
                        }}
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button variant="hoppn">Update Password</Button>
                  </div>
                </div>
                
                <div className="pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <h4 className="font-medium mb-3" style={{ color: 'var(--color-text-dark)' }}>Two-Factor Authentication</h4>
                  <p className="text-sm mb-3" style={{ color: 'var(--color-text-medium)' }}>
                    Add an extra layer of security to your account by enabling two-factor authentication.
                  </p>
                  <Button variant="hoppnOutline">Enable 2FA</Button>
                </div>
              </div>
            </div>
            
            {/* Notifications Section */}
            <div id="notifications" className="rounded-lg shadow-sm p-6" style={{ backgroundColor: 'var(--color-warm-cream)' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-dark)' }}>Notification Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <div>
                    <h4 className="font-medium" style={{ color: 'var(--color-text-dark)' }}>New Orders</h4>
                    <p className="text-sm" style={{ color: 'var(--color-text-medium)' }}>Get notified when you receive a new order</p>
                  </div>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all" style={{ '--peer-checked-bg': '#F15029', 'background': 'var(--peer-checked-bg, #E5E7EB)' }}></div>
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <div>
                    <h4 className="font-medium" style={{ color: 'var(--color-text-dark)' }}>Order Updates</h4>
                    <p className="text-sm" style={{ color: 'var(--color-text-medium)' }}>Get notified about order status changes</p>
                  </div>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all" style={{ '--peer-checked-bg': '#F15029', 'background': 'var(--peer-checked-bg, #E5E7EB)' }}></div>
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <div>
                    <h4 className="font-medium" style={{ color: 'var(--color-text-dark)' }}>Customer Messages</h4>
                    <p className="text-sm" style={{ color: 'var(--color-text-medium)' }}>Get notified when you receive a new message</p>
                  </div>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all" style={{ '--peer-checked-bg': '#F15029', 'background': 'var(--peer-checked-bg, #E5E7EB)' }}></div>
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <div>
                    <h4 className="font-medium" style={{ color: 'var(--color-text-dark)' }}>Marketing Updates</h4>
                    <p className="text-sm" style={{ color: 'var(--color-text-medium)' }}>Receive news and promotional offers from Hoppn</p>
                  </div>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all" style={{ '--peer-checked-bg': '#F15029', 'background': 'var(--peer-checked-bg, #E5E7EB)' }}></div>
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
