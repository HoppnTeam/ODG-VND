import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { OrderItemDisplay } from '@/types/api'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatTime(date: Date | string) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date))
}

export function getStatusColor(status: string) {
  const colors = {
    pending: 'text-yellow-600 bg-yellow-50',
    confirmed: 'text-blue-600 bg-blue-50',
    preparing: 'text-orange-600 bg-orange-50',
    ready: 'text-green-600 bg-green-50',
    picked_up: 'text-gray-600 bg-gray-50',
    cancelled: 'text-red-600 bg-red-50',
  }
  return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-50'
}

export function getCuisineColor(cuisine: string) {
  const colors = {
    west_african: 'text-orange-600 bg-orange-50',
    east_african: 'text-blue-600 bg-blue-50',
    north_african: 'text-yellow-600 bg-yellow-50',
    south_african: 'text-green-600 bg-green-50',
    central_african: 'text-purple-600 bg-purple-50',
  }
  return colors[cuisine as keyof typeof colors] || 'text-gray-600 bg-gray-50'
}

export function getSpiceLevelColor(level: number) {
  const colors = {
    1: 'text-green-600',
    2: 'text-yellow-600',
    3: 'text-orange-600',
    4: 'text-red-600',
    5: 'text-red-700',
  }
  return colors[level as keyof typeof colors] || 'text-gray-600'
}

export function generateOrderId() {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substr(2, 5)
  return `HP-${new Date().getFullYear().toString().slice(-2)}-${timestamp}${randomStr}`.toUpperCase()
}

export function calculateOrderTotal(items: OrderItemDisplay[]) {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0)
}

export function calculateCommission(subtotal: number, rate: number = 0.18) {
  return subtotal * rate
}

export function calculateStripeFee(total: number) {
  return (total * 0.029) + 0.30
}

export function calculateNetPayout(subtotal: number, commission: number, stripeFee: number) {
  return subtotal - commission - stripeFee
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncate(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function capitalizeWords(text: string) {
  return text.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
}

export function getTimeAgo(date: Date | string) {
  const now = new Date()
  const then = new Date(date)
  const diff = now.getTime() - then.getTime()
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  return 'Just now'
}

export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string) {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/\D/g, ''))
}

export function formatPhoneNumber(phone: string) {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
  }
  return phone
}