'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import DishForm from './DishForm'
import { Database } from '@/types/supabase'

type Dish = Database['public']['Tables']['dishes']['Row']

interface DishModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  restaurantId: string
  dish?: Dish | null
  mode: 'create' | 'edit'
}

export default function DishModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  restaurantId, 
  dish, 
  mode 
}: DishModalProps) {

  if (!isOpen) return null

  const handleSuccess = () => {
    onSuccess()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-start justify-center p-4">
      <div className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 md:p-6 flex items-center justify-between rounded-t-xl">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {mode === 'create' ? 'Add New Dish' : `Edit ${dish?.name}`}
          </h2>
          <Button
            onClick={onClose}
            variant="ghost"
            className="h-10 w-10 p-0 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          <DishForm 
            restaurantId={restaurantId} 
            onSuccess={handleSuccess}
            dish={dish}
            mode={mode}
          />
        </div>
      </div>
    </div>
  )
}