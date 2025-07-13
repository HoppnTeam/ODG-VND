'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { AlertCircle, Clock } from 'lucide-react'

type DayHours = {
  day: string
  isOpen: boolean
  openTime: string
  closeTime: string
}

type RestaurantHoursProps = {
  restaurantId: string
  currentHours?: DayHours[]
  onSuccess?: (hours: DayHours[]) => void
}

const defaultHours: DayHours[] = [
  { day: 'Monday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
  { day: 'Tuesday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
  { day: 'Wednesday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
  { day: 'Thursday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
  { day: 'Friday', isOpen: true, openTime: '09:00', closeTime: '22:00' },
  { day: 'Saturday', isOpen: true, openTime: '10:00', closeTime: '22:00' },
  { day: 'Sunday', isOpen: true, openTime: '10:00', closeTime: '20:00' },
]

export default function RestaurantHours({ 
  restaurantId, 
  currentHours, 
  onSuccess 
}: RestaurantHoursProps) {
  const supabase = createClientComponentClient()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hours, setHours] = useState<DayHours[]>(currentHours || defaultHours)
  
  useEffect(() => {
    if (currentHours) {
      setHours(currentHours)
    }
  }, [currentHours])
  
  const handleDayToggle = (dayIndex: number) => {
    const newHours = [...hours]
    newHours[dayIndex].isOpen = !newHours[dayIndex].isOpen
    setHours(newHours)
  }
  
  const handleTimeChange = (dayIndex: number, field: 'openTime' | 'closeTime', value: string) => {
    const newHours = [...hours]
    newHours[dayIndex][field] = value
    setHours(newHours)
  }
  
  const validateHours = () => {
    for (const dayHour of hours) {
      if (dayHour.isOpen) {
        if (!dayHour.openTime || !dayHour.closeTime) {
          throw new Error(`Please set both open and close times for ${dayHour.day}`)
        }
        
        const openTime = new Date(`2000-01-01T${dayHour.openTime}:00`)
        const closeTime = new Date(`2000-01-01T${dayHour.closeTime}:00`)
        
        if (closeTime <= openTime) {
          throw new Error(`Close time must be after open time for ${dayHour.day}`)
        }
      }
    }
  }
  
  const handleSave = async () => {
    setLoading(true)
    setError(null)
    
    try {
      validateHours()
      
      // Update restaurant hours in database
      const { error: updateError } = await supabase
        .from('restaurants')
        .update({ 
          operating_hours: hours.reduce((acc, dayHour) => {
            acc[dayHour.day.toLowerCase()] = dayHour.isOpen 
              ? { open: dayHour.openTime, close: dayHour.closeTime }
              : { open: null, close: null }
            return acc
          }, {} as Record<string, { open: string | null, close: string | null }>)
        })
        .eq('id', restaurantId)
        
      if (updateError) {
        throw new Error(`Failed to update restaurant hours: ${updateError.message}`)
      }
      
      if (onSuccess) {
        onSuccess(hours)
      }
      
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const copyToAll = (sourceIndex: number) => {
    const sourceHour = hours[sourceIndex]
    const newHours = hours.map(hour => ({
      ...hour,
      isOpen: sourceHour.isOpen,
      openTime: sourceHour.openTime,
      closeTime: sourceHour.closeTime
    }))
    setHours(newHours)
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Clock className="w-6 h-6 text-orange-600" />
        <h3 className="text-lg font-semibold text-gray-900">Restaurant Hours</h3>
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <div className="bg-white rounded-lg border border-gray-200">
        {hours.map((dayHour, index) => (
          <div key={dayHour.day} className={`p-4 ${index !== hours.length - 1 ? 'border-b border-gray-200' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20">
                  <span className="font-medium text-gray-900">{dayHour.day}</span>
                </div>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={dayHour.isOpen}
                    onChange={() => handleDayToggle(index)}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Open</span>
                </label>
              </div>
              
              {dayHour.isOpen ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={dayHour.openTime}
                      onChange={(e) => handleTimeChange(index, 'openTime', e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      value={dayHour.closeTime}
                      onChange={(e) => handleTimeChange(index, 'closeTime', e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => copyToAll(index)}
                    className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Copy to all
                  </button>
                </div>
              ) : (
                <span className="text-gray-500 text-sm">Closed</span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Quick Presets */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Quick Presets</h4>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              const newHours = hours.map(hour => ({
                ...hour,
                isOpen: true,
                openTime: '09:00',
                closeTime: '21:00'
              }))
              setHours(newHours)
            }}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            9 AM - 9 PM (All Days)
          </button>
          
          <button
            type="button"
            onClick={() => {
              const newHours = hours.map((hour, index) => ({
                ...hour,
                isOpen: index < 5, // Monday to Friday
                openTime: '08:00',
                closeTime: '18:00'
              }))
              setHours(newHours)
            }}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Weekdays Only (8 AM - 6 PM)
          </button>
          
          <button
            type="button"
            onClick={() => {
              const newHours = hours.map((hour, index) => ({
                ...hour,
                isOpen: true,
                openTime: index < 5 ? '11:00' : '10:00', // Weekdays vs Weekends
                closeTime: index < 5 ? '22:00' : '23:00'
              }))
              setHours(newHours)
            }}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Restaurant Hours
          </button>
        </div>
      </div>
      
      {/* Current Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Current Status</h4>
        <p className="text-sm text-blue-800">
          Your restaurant hours will be displayed to customers when they browse your menu. 
          Make sure to keep them updated, especially during holidays or special events.
        </p>
      </div>
      
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={loading}
          variant="hoppn"
        >
          {loading ? 'Saving...' : 'Save Hours'}
        </Button>
      </div>
    </div>
  )
}
