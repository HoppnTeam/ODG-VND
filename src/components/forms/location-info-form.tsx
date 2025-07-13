'use client'

import { UseFormReturn } from 'react-hook-form'
import { LocationInfoFormData } from '@/lib/validation'

interface LocationInfoFormProps {
  form: UseFormReturn<LocationInfoFormData>
}

const daysOfWeek = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' }
] as const

export function LocationInfoForm({ form }: LocationInfoFormProps) {
  const { register, formState: { errors }, watch, setValue } = form

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Location & Contact
        </h2>
        <p className="text-gray-600">
          Help customers find you and understand your pickup process.
        </p>
      </div>

      {/* Address Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Address Information</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {/* Street Address */}
          <div className="md:col-span-2">
            <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-2">
              Street Address *
            </label>
            <input
              id="streetAddress"
              type="text"
              {...register('streetAddress')}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none transition-colors ${
                errors.streetAddress 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:border-orange-500'
              }`}
              style={{ height: '44px' }}
              placeholder="123 Main Street"
            />
            {errors.streetAddress && (
              <p className="mt-1 text-sm text-red-600">{errors.streetAddress.message}</p>
            )}
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              id="city"
              type="text"
              {...register('city')}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none transition-colors ${
                errors.city 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:border-orange-500'
              }`}
              style={{ height: '44px' }}
              placeholder="Minneapolis"
              defaultValue="Minneapolis"
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
            )}
          </div>

          {/* State */}
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
              State *
            </label>
            <input
              id="state"
              type="text"
              {...register('state')}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none transition-colors ${
                errors.state 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:border-orange-500'
              }`}
              style={{ height: '44px' }}
              placeholder="Minnesota"
              defaultValue="Minnesota"
            />
            {errors.state && (
              <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
            )}
          </div>

          {/* ZIP Code */}
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
              ZIP Code *
            </label>
            <input
              id="zipCode"
              type="text"
              {...register('zipCode')}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none transition-colors ${
                errors.zipCode 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:border-orange-500'
              }`}
              style={{ height: '44px' }}
              placeholder="55401"
            />
            {errors.zipCode && (
              <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Business Hours</h3>
        <p className="text-sm text-gray-600">
          Set your restaurant's operating hours for customer pickup.
        </p>
        
        <div className="space-y-3">
          {daysOfWeek.map((day) => (
            <div key={day.key} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-20">
                <span className="text-sm font-medium text-gray-700">{day.label}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register(`businessHours.${day.key}.closed`)}
                  className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-600">Closed</span>
              </div>

              {!watch(`businessHours.${day.key}.closed`) && (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    {...register(`businessHours.${day.key}.open`)}
                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-orange-500"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="time"
                    {...register(`businessHours.${day.key}.close`)}
                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pickup Instructions */}
      <div>
        <label htmlFor="pickupInstructions" className="block text-sm font-medium text-gray-700 mb-2">
          Pickup Instructions *
        </label>
        <textarea
          id="pickupInstructions"
          {...register('pickupInstructions')}
          rows={4}
          className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none transition-colors resize-vertical ${
            errors.pickupInstructions 
              ? 'border-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:border-orange-500'
          }`}
          placeholder="Provide detailed pickup instructions for customers. Include parking information, entrance details, contact number for pickup, and any special procedures..."
        />
        {errors.pickupInstructions && (
          <p className="mt-1 text-sm text-red-600">{errors.pickupInstructions.message}</p>
        )}
      </div>

      {/* Special Notes */}
      <div>
        <label htmlFor="specialNotes" className="block text-sm font-medium text-gray-700 mb-2">
          Special Notes (Optional)
        </label>
        <textarea
          id="specialNotes"
          {...register('specialNotes')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-orange-500 resize-vertical"
          placeholder="Any additional information about your restaurant, special services, or unique features..."
        />
      </div>
    </div>
  )
}