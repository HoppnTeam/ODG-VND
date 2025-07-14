'use client'

import React, { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  
  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }
  
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Navigation - Tablet Optimized */}
      <aside className="fixed left-0 top-0 bottom-0 w-[240px] md:w-[280px] lg:w-[320px] bg-white border-r border-slate-200 shadow-sm flex flex-col z-20">
        {/* Logo Area - Larger Touch Targets */}
        <div className="p-4 md:p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center" 
                 style={{ background: 'linear-gradient(135deg, #F15029 0%, #FFBF00 100%)' }}>
              <span className="text-white font-bold text-xl md:text-2xl">H</span>
            </div>
            <div className="overflow-hidden">
              <h1 className="text-lg md:text-xl font-bold text-slate-900 truncate" style={{ fontFamily: 'Montserrat, sans-serif' }}>
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
                    className={`flex items-center gap-3 md:gap-4 px-4 md:px-6 py-4 md:py-5 rounded-xl transition-all duration-200 touch-manipulation ${
                      isActive 
                        ? 'bg-[#F15029] bg-opacity-10 text-[#F15029] font-semibold shadow-sm' 
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200'
                    }`}
                    style={{ minHeight: '56px' }} // Ensures 44px+ touch target
                  >
                    <item.icon className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0" />
                    <span className={`text-base md:text-lg ${isActive ? 'font-semibold' : 'font-medium'}`}>
                      {item.name}
                    </span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <div className="ml-auto bg-[#F15029] text-white text-xs md:text-sm font-semibold rounded-full w-6 h-6 md:w-7 md:h-7 flex items-center justify-center">
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
        <div className="p-3 md:p-4 border-t border-slate-200 space-y-2">
          <Link 
            href="/dashboard/settings" 
            className={`flex items-center gap-3 md:gap-4 px-4 md:px-6 py-4 md:py-5 rounded-xl transition-all duration-200 touch-manipulation ${
              pathname === '/dashboard/settings' 
                ? 'bg-[#F15029] bg-opacity-10 text-[#F15029] font-semibold shadow-sm' 
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200'
            }`}
            style={{ minHeight: '56px' }}
          >
            <Settings className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0" />
            <span className={`text-base md:text-lg ${pathname === '/dashboard/settings' ? 'font-semibold' : 'font-medium'}`}>
              Settings
            </span>
          </Link>
          
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 md:gap-4 px-4 md:px-6 py-4 md:py-5 rounded-xl text-slate-700 hover:bg-red-50 hover:text-red-600 active:bg-red-100 transition-all duration-200 touch-manipulation"
            style={{ minHeight: '56px' }}
          >
            <LogOut className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0" />
            <span className="text-base md:text-lg font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area - Responsive Width */}
      <main className="ml-[240px] md:ml-[280px] lg:ml-[320px] w-[calc(100%-240px)] md:w-[calc(100%-280px)] lg:w-[calc(100%-320px)] min-h-screen flex flex-col">
        {/* Header - Tablet Optimized */}
        <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
          <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 truncate" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Dashboard Overview
            </h1>
            
            <div className="flex items-center gap-3 md:gap-4">
              {/* Search - Tablet Optimized */}
              <div className="relative hidden md:block">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-48 lg:w-64 pl-12 pr-4 py-3 md:py-4 rounded-xl border-2 border-slate-300 bg-white text-slate-900 placeholder-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-[#F15029] focus:ring-opacity-50 focus:border-[#F15029] transition-colors text-base"
                  style={{ minHeight: '48px' }}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-6 h-6" />
              </div>
              
              {/* Search Icon for Mobile */}
              <button className="md:hidden relative p-3 rounded-xl hover:bg-slate-100 active:bg-slate-200 transition-colors touch-manipulation" style={{ minHeight: '48px', minWidth: '48px' }}>
                <Search className="w-6 h-6 text-slate-600" />
              </button>
              
              {/* Notifications - Larger Touch Target */}
              <button className="relative p-3 rounded-xl hover:bg-slate-100 active:bg-slate-200 transition-colors touch-manipulation" style={{ minHeight: '48px', minWidth: '48px' }}>
                <Bell className="w-6 h-6 md:w-7 md:h-7 text-slate-600" />
                <span className="absolute top-2 right-2 w-3 h-3 bg-[#F15029] rounded-full"></span>
              </button>
              
              {/* User Menu - Larger Touch Target */}
              <div className="flex items-center gap-2 md:gap-3 cursor-pointer hover:bg-slate-50 active:bg-slate-100 rounded-xl p-2 md:p-3 transition-colors touch-manipulation" style={{ minHeight: '48px' }} tabIndex={0}>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#F15029] bg-opacity-10 flex items-center justify-center">
                  <span className="text-[#F15029] font-semibold text-lg md:text-xl">
                    {user?.vendorUser?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-slate-600 hidden md:block" />
              </div>
            </div>
          </div>
        </header>
        
        {/* Content Area */}
        <div className="flex-1">
          {children}
        </div>
        
        {/* Footer - Tablet Optimized */}
        <footer className="bg-white border-t border-slate-200 py-4 md:py-6">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-sm md:text-base text-slate-600 font-medium">
                © 2025 Hoppn. All rights reserved.
              </p>
              <div className="flex items-center gap-4 md:gap-6">
                <a 
                  href="/help" 
                  className="text-sm md:text-base text-slate-600 hover:text-[#F15029] font-medium transition-colors touch-manipulation rounded-lg px-3 py-2" 
                  style={{ minHeight: '44px' }}
                >
                  Help
                </a>
                <a 
                  href="/privacy" 
                  className="text-sm md:text-base text-slate-600 hover:text-[#F15029] font-medium transition-colors touch-manipulation rounded-lg px-3 py-2" 
                  style={{ minHeight: '44px' }}
                >
                  Privacy
                </a>
                <a 
                  href="/terms" 
                  className="text-sm md:text-base text-slate-600 hover:text-[#F15029] font-medium transition-colors touch-manipulation rounded-lg px-3 py-2" 
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
