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
  LogOut 
} from 'lucide-react'

interface DashboardLayoutProps {
  children: ReactNode
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Orders', href: '/dashboard/orders', icon: ShoppingBag, badge: 0 },
  { name: 'Menu', href: '/dashboard/menu', icon: Utensils },
  { name: 'Restaurant', href: '/dashboard/restaurant', icon: Store },
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
      {/* Sidebar Navigation (280px width) */}
      <aside className="fixed left-0 top-0 bottom-0 w-[280px] bg-white border-r border-slate-200 shadow-sm flex flex-col z-20">
        {/* Logo Area */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" 
                 style={{ background: 'linear-gradient(135deg, #F15029 0%, #FFBF00 100%)' }}>
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <div className="overflow-hidden">
              <h1 className="text-lg font-bold text-slate-900 truncate" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {user?.restaurant?.name || 'Restaurant Dashboard'}
              </h1>
            </div>
          </div>
        </div>
        
        {/* Navigation Items */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link 
                    href={item.href} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#F15029] focus:ring-opacity-50 ${
                      isActive 
                        ? 'bg-[#F15029] bg-opacity-10 text-[#F15029] font-semibold' 
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className={`${isActive ? 'font-semibold' : 'font-medium'}`}>{item.name}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <div className="ml-auto bg-[#F15029] text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                        {item.badge}
                      </div>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        
        {/* Settings and Sign Out at Bottom */}
        <div className="p-3 border-t border-slate-200 space-y-1">
          <Link 
            href="/dashboard/settings" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#F15029] focus:ring-opacity-50 ${
              pathname === '/dashboard/settings' 
                ? 'bg-[#F15029] bg-opacity-10 text-[#F15029] font-semibold' 
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className={`${pathname === '/dashboard/settings' ? 'font-semibold' : 'font-medium'}`}>Settings</span>
          </Link>
          
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area (calc(100vw - 280px)) */}
      <main className="ml-[280px] w-[calc(100%-280px)] min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Dashboard Overview
            </h1>
            
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-64 pl-10 pr-4 py-2.5 rounded-lg border-2 border-slate-300 bg-white text-slate-900 placeholder-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-[#F15029] focus:ring-opacity-50 focus:border-[#F15029] transition-colors"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
              </div>
              
              {/* Notifications */}
              <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#F15029] focus:ring-opacity-50">
                <Bell className="w-6 h-6 text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#F15029] rounded-full"></span>
              </button>
              
              {/* User Menu */}
              <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 rounded-lg p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#F15029] focus:ring-opacity-50" tabIndex={0}>
                <div className="w-8 h-8 rounded-full bg-[#F15029] bg-opacity-10 flex items-center justify-center">
                  <span className="text-[#F15029] font-semibold">{user?.vendorUser?.name?.charAt(0) || 'U'}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-600" />
              </div>
            </div>
          </div>
        </header>
        
        {/* Content Area */}
        <div className="flex-1">
          {children}
        </div>
        
        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-4">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600 font-medium">© 2025 Hoppn. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <a href="/help" className="text-sm text-slate-600 hover:text-[#F15029] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#F15029] focus:ring-opacity-50 rounded px-2 py-1">Help</a>
                <a href="/privacy" className="text-sm text-slate-600 hover:text-[#F15029] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#F15029] focus:ring-opacity-50 rounded px-2 py-1">Privacy</a>
                <a href="/terms" className="text-sm text-slate-600 hover:text-[#F15029] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#F15029] focus:ring-opacity-50 rounded px-2 py-1">Terms</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
