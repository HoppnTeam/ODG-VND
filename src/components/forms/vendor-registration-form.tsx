'use client'

import { UseFormReturn } from 'react-hook-form'
import { VendorRegistrationFormData, cuisineRegionOptions } from '@/lib/validation'

interface VendorRegistrationFormProps {
  form: UseFormReturn<VendorRegistrationFormData>
}

export function VendorRegistrationForm({ form }: VendorRegistrationFormProps) {
  const { register, formState: { errors }, watch } = form

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Vendor Registration
        </h2>
        <p className="text-gray-600">
          Register your African restaurant on Hoppn to reach more customers.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Restaurant Name */}
        <div className="md:col-span-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Restaurant Name *
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none transition-colors ${
              errors.name 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-orange-500'
            }`}
            style={{ height: '44px' }}
            placeholder="e.g., Mama's Kitchen, Lagos Delights"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Owner Name */}
        <div>
          <label htmlFor="owner_name" className="block text-sm font-medium text-gray-700 mb-2">
            Owner/Manager Name *
          </label>
          <input
            id="owner_name"
            type="text"
            {...register('owner_name')}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none transition-colors ${
              errors.owner_name 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-orange-500'
            }`}
            style={{ height: '44px' }}
            placeholder="Your full name"
          />
          {errors.owner_name && (
            <p className="mt-1 text-sm text-red-600">{errors.owner_name.message}</p>
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
          <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            id="phone_number"
            type="tel"
            {...register('phone_number')}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none transition-colors ${
              errors.phone_number 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-orange-500'
            }`}
            style={{ height: '44px' }}
            placeholder="(612) 555-0123"
          />
          {errors.phone_number && (
            <p className="mt-1 text-sm text-red-600">{errors.phone_number.message}</p>
          )}
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            Restaurant Address *
          </label>
          <input
            id="address"
            type="text"
            {...register('address')}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none transition-colors ${
              errors.address 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-orange-500'
            }`}
            style={{ height: '44px' }}
            placeholder="Full restaurant address"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
          )}
        </div>

        {/* Cuisine Type */}
        <div className="md:col-span-2">
          <label htmlFor="cuisine_type" className="block text-sm font-medium text-gray-700 mb-2">
            Primary Cuisine Type *
          </label>
          <select
            id="cuisine_type"
            {...register('cuisine_type')}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none transition-colors ${
              errors.cuisine_type 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-orange-500'
            }`}
            style={{ height: '44px' }}
          >
            <option value="">Select your primary cuisine type</option>
            {cuisineRegionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} - {option.description}
              </option>
            ))}
          </select>
          {errors.cuisine_type && (
            <p className="mt-1 text-sm text-red-600">{errors.cuisine_type.message}</p>
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
            placeholder="Describe your restaurant, the type of food you serve, and what makes your cuisine special."
          />
          <div className="flex justify-between items-center mt-1">
            {errors.description ? (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            ) : (
              <p className="text-sm text-gray-500">
                {watch('description')?.length || 0}/500 characters (minimum 10)
              </p>
            )}
          </div>
        </div>

        {/* Password */}
        <div className="md:col-span-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password *
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none transition-colors ${
              errors.password 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-orange-500'
            }`}
            style={{ height: '44px' }}
            placeholder="Create a secure password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Terms Notice - Not required for form submission */}
        <div className="md:col-span-2">
          <div className="text-sm text-gray-600 mt-2">
            By submitting this form, you agree to our <a href="/terms" className="text-orange-600 hover:text-orange-800">Terms and Conditions</a> and <a href="/privacy" className="text-orange-600 hover:text-orange-800">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  )
}
