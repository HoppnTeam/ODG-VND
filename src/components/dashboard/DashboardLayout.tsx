'use client'

import React, { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { 
  Home, 
  ShoppingBag, 
  Utensils, 
  Store, 
  BarChart, 
  CreditCard, 
  MessageCircle, 
  Settings, 
  Search, 
  Bell, 
  ChevronDown,
  LogOut,
  Star
} from 'lucide-react'

interface DashboardLayoutProps {
  children: ReactNode
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Orders', href: '/dashboard/orders', icon: ShoppingBag, badge: 0 },
  { name: 'Menu', href: '/dashboard/menu', icon: Utensils },
  { name: 'Restaurant', href: '/dashboard/restaurant', icon: Store },
  { name: 'Reviews', href: '/dashboard/reviews', icon: Star },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart },
  { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
  { name: 'Messages', href: '/dashboard/messages', icon: MessageCircle },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  
  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/login') // Explicit redirect for better UX
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }
  
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--color-earth-beige)' }}>
      {/* Sidebar Navigation - Tablet Optimized */}
      <aside className="fixed left-0 top-0 bottom-0 w-[240px] md:w-[280px] lg:w-[320px] border-r shadow-sm flex flex-col z-20" style={{ backgroundColor: '#F15029', borderColor: 'var(--color-border)' }}>
        {/* Logo Area - Larger Touch Targets */}
        <div className="p-4 md:p-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center" 
                 style={{ backgroundColor: '#FFFFFF' }}>
              <span className="font-bold text-xl md:text-2xl" style={{ color: '#F15029' }}>H</span>
            </div>
            <div className="overflow-hidden">
              <h1 className="text-lg md:text-xl font-bold truncate text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {user?.restaurant?.name || 'Restaurant Dashboard'}
              </h1>
            </div>
          </div>
        </div>
        
        {/* Navigation Items - Tablet Touch Targets */}
        <nav className="flex-1 py-4 md:py-6 overflow-y-auto">
          <ul className="space-y-2 px-3 md:px-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link 
                    href={item.href} 
                    className={`flex items-center gap-3 md:gap-4 px-4 md:px-6 py-4 md:py-5 rounded-xl touch-manipulation`}
                    style={{
                      border: isActive ? '2px solid #000000' : '2px solid transparent',
                      color: '#FFFFFF',
                      minHeight: '56px'
                    }}
                  >
                    <item.icon className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0" />
                    <span className="text-base md:text-lg font-semibold">
                      {item.name}
                    </span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <div className="ml-auto text-xs md:text-sm font-semibold rounded-full w-6 h-6 md:w-7 md:h-7 flex items-center justify-center" style={{ backgroundColor: '#000000', color: '#FFFFFF' }}>
                        {item.badge}
                      </div>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        
        {/* Settings and Sign Out at Bottom - Larger Touch Targets */}
        <div className="p-3 md:p-4 border-t space-y-2" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
          <Link 
            href="/dashboard/settings" 
            className="flex items-center gap-3 md:gap-4 px-4 md:px-6 py-4 md:py-5 rounded-xl touch-manipulation"
            style={{
              border: pathname === '/dashboard/settings' ? '2px solid #000000' : '2px solid transparent',
              color: '#FFFFFF',
              minHeight: '56px'
            }}
          >
            <Settings className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0" />
            <span className="text-base md:text-lg font-semibold">
              Settings
            </span>
          </Link>
          
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 md:gap-4 px-4 md:px-6 py-4 md:py-5 rounded-xl touch-manipulation"
            style={{ 
              color: '#FFFFFF',
              minHeight: '56px',
              border: '2px solid transparent'
            }}
          >
            <LogOut className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0" />
            <span className="text-base md:text-lg font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area - Responsive Width */}
      <main className="ml-[240px] md:ml-[280px] lg:ml-[320px] w-[calc(100%-240px)] md:w-[calc(100%-280px)] lg:w-[calc(100%-320px)] min-h-screen flex flex-col">
        {/* Header - Tablet Optimized */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-10" style={{ borderColor: 'var(--color-border)' }}>
          <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-bold truncate" style={{ fontFamily: 'Montserrat, sans-serif', color: 'var(--color-text-dark)' }}>
              Dashboard Overview
            </h1>
            
            <div className="flex items-center gap-3 md:gap-4">
              {/* Search - Tablet Optimized */}
              <div className="relative hidden md:block">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-48 lg:w-64 pl-12 pr-4 py-3 md:py-4 rounded-xl border-2 bg-white font-medium focus:outline-none focus:ring-2 transition-colors text-base"
                  style={{
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-dark)',
                    '--placeholder-color': 'var(--color-text-light)',
                    '::placeholder': { color: 'var(--color-text-light)' }
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-hoppn-orange)';
                    e.target.style.boxShadow = '0 0 0 2px rgba(241, 80, 41, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--color-border)';
                    e.target.style.boxShadow = 'none';
                  }}
                  style={{ minHeight: '48px' }}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6" style={{ color: 'var(--color-text-light)' }} />
              </div>
              
              {/* Search Icon for Mobile */}
              <button className="md:hidden relative p-3 rounded-xl transition-colors touch-manipulation" style={{ minHeight: '48px', minWidth: '48px' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-soft-orange)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <Search className="w-6 h-6" style={{ color: 'var(--color-text-medium)' }} />
              </button>
              
              {/* Notifications - Larger Touch Target */}
              <button className="relative p-3 rounded-xl transition-colors touch-manipulation" style={{ minHeight: '48px', minWidth: '48px' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-soft-orange)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <Bell className="w-6 h-6 md:w-7 md:h-7" style={{ color: 'var(--color-text-medium)' }} />
                <span className="absolute top-2 right-2 w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--color-hoppn-orange)' }}></span>
              </button>
              
              {/* User Menu - Larger Touch Target */}
              <div className="flex items-center gap-2 md:gap-3 cursor-pointer rounded-xl p-2 md:p-3 transition-colors touch-manipulation" style={{ minHeight: '48px' }} tabIndex={0} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-soft-orange)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-soft-orange)' }}>
                  <span className="font-semibold text-lg md:text-xl" style={{ color: 'var(--color-hoppn-orange)' }}>
                    {user?.vendorUser?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <ChevronDown className="w-5 h-5 md:w-6 md:h-6 hidden md:block" style={{ color: 'var(--color-text-medium)' }} />
              </div>
            </div>
          </div>
        </header>
        
        {/* Content Area */}
        <div className="flex-1">
          {children}
        </div>
        
        {/* Footer - Tablet Optimized */}
        <footer className="bg-white border-t py-4 md:py-6" style={{ borderColor: 'var(--color-border)' }}>
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-sm md:text-base font-medium" style={{ color: 'var(--color-text-light)' }}>
                © 2025 Hoppn. All rights reserved.
              </p>
              <div className="flex items-center gap-4 md:gap-6">
                <a 
                  href="/help" 
                  className="text-sm md:text-base font-medium transition-colors touch-manipulation rounded-lg px-3 py-2"
                  style={{ color: 'var(--color-text-light)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-hoppn-orange)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-light)'} 
                  style={{ minHeight: '44px' }}
                >
                  Help
                </a>
                <a 
                  href="/privacy" 
                  className="text-sm md:text-base font-medium transition-colors touch-manipulation rounded-lg px-3 py-2"
                  style={{ color: 'var(--color-text-light)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-hoppn-orange)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-light)'} 
                  style={{ minHeight: '44px' }}
                >
                  Privacy
                </a>
                <a 
                  href="/terms" 
                  className="text-sm md:text-base font-medium transition-colors touch-manipulation rounded-lg px-3 py-2"
                  style={{ color: 'var(--color-text-light)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-hoppn-orange)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-light)'} 
                  style={{ minHeight: '44px' }}
                >
                  Terms
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
