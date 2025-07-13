'use client'

import { UseFormReturn } from 'react-hook-form'
import { BusinessInfoFormData, cuisineRegionOptions } from '@/lib/validation'

interface BusinessInfoFormProps {
  form: UseFormReturn<BusinessInfoFormData>
}

export function BusinessInfoForm({ form }: BusinessInfoFormProps) {
  const { register, formState: { errors }, watch } = form

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Business Information
        </h2>
        <p className="text-gray-600">
          Tell us about your African restaurant and what makes it special.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Business Name */}
        <div className="md:col-span-2">
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
            Business Name *
          </label>
          <input
            id="businessName"
            type="text"
            {...register('businessName')}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none transition-colors ${
              errors.businessName 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-orange-500'
            }`}
            style={{ height: '44px' }}
            placeholder="e.g., Mama's Kitchen, Lagos Delights"
          />
          {errors.businessName && (
            <p className="mt-1 text-sm text-red-600">{errors.businessName.message}</p>
          )}
        </div>

        {/* Owner Name */}
        <div>
          <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-2">
            Owner/Manager Name *
          </label>
          <input
            id="ownerName"
            type="text"
            {...register('ownerName')}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none transition-colors ${
              errors.ownerName 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-orange-500'
            }`}
            style={{ height: '44px' }}
            placeholder="Your full name"
          />
          {errors.ownerName && (
            <p className="mt-1 text-sm text-red-600">{errors.ownerName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none transition-colors ${
              errors.email 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-orange-500'
            }`}
            style={{ height: '44px' }}
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            id="phone"
            type="tel"
            {...register('phone')}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none transition-colors ${
              errors.phone 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-orange-500'
            }`}
            style={{ height: '44px' }}
            placeholder="(612) 555-0123"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Business License */}
        <div>
          <label htmlFor="businessLicense" className="block text-sm font-medium text-gray-700 mb-2">
            Business License Number *
          </label>
          <input
            id="businessLicense"
            type="text"
            {...register('businessLicense')}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none transition-colors ${
              errors.businessLicense 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-orange-500'
            }`}
            style={{ height: '44px' }}
            placeholder="License number"
          />
          {errors.businessLicense && (
            <p className="mt-1 text-sm text-red-600">{errors.businessLicense.message}</p>
          )}
        </div>

        {/* Cuisine Region */}
        <div className="md:col-span-2">
          <label htmlFor="cuisineRegion" className="block text-sm font-medium text-gray-700 mb-2">
            Primary Cuisine Region *
          </label>
          <select
            id="cuisineRegion"
            {...register('cuisineRegion')}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none transition-colors ${
              errors.cuisineRegion 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-orange-500'
            }`}
            style={{ height: '44px' }}
          >
            <option value="">Select your primary cuisine region</option>
            {cuisineRegionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} - {option.description}
              </option>
            ))}
          </select>
          {errors.cuisineRegion && (
            <p className="mt-1 text-sm text-red-600">{errors.cuisineRegion.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Restaurant Description *
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none transition-colors resize-vertical ${
              errors.description 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-orange-500'
            }`}
            placeholder="Describe your restaurant, the type of food you serve, and what makes your cuisine special. Share your story and cultural heritage..."
          />
          <div className="flex justify-between items-center mt-1">
            {errors.description ? (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            ) : (
              <p className="text-sm text-gray-500">
                {watch('description')?.length || 0}/500 characters (minimum 50)
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}