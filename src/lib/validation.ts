import { z } from 'zod'

// Vendor Registration Schema - For vendor registration with authentication
export const vendorRegistrationSchema = z.object({
  name: z.string().min(2, 'Restaurant name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone_number: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(5, 'Address is required'),
  cuisine_type: z.enum(['west_african', 'east_african', 'north_african', 'south_african', 'central_african'], {
    required_error: 'Please select a cuisine type'
  }),
  owner_name: z.string().min(2, 'Owner name must be at least 2 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

// Terms acceptance for registration
export const termsSchema = z.object({
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  })
})

// Complete registration schema with terms
export const completeRegistrationSchema = vendorRegistrationSchema
  .merge(termsSchema)

// Add status field that will be set automatically
export const pendingVendorSchema = completeRegistrationSchema.extend({
  status: z.enum(['pending', 'approved', 'rejected']).default('pending')
})

export type VendorRegistrationFormData = z.infer<typeof vendorRegistrationSchema>
export type CompleteRegistrationFormData = z.infer<typeof completeRegistrationSchema>

// Login schema
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export type LoginFormData = z.infer<typeof loginSchema>

// Utility functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/\D/g, ''))
}

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
  }
  return phone
}

export const cuisineRegionOptions = [
  { value: 'west_african', label: 'West African', description: 'Nigeria, Ghana, Senegal, Mali, etc.' },
  { value: 'east_african', label: 'East African', description: 'Ethiopia, Kenya, Tanzania, Uganda, etc.' },
  { value: 'north_african', label: 'North African', description: 'Morocco, Egypt, Tunisia, Algeria, etc.' },
  { value: 'south_african', label: 'South African', description: 'South Africa, Zimbabwe, Botswana, etc.' },
  { value: 'central_african', label: 'Central African', description: 'Cameroon, DRC, Central African Republic, etc.' }
]

export const defaultBusinessHours = {
  monday: { open: '09:00', close: '21:00', closed: false },
  tuesday: { open: '09:00', close: '21:00', closed: false },
  wednesday: { open: '09:00', close: '21:00', closed: false },
  thursday: { open: '09:00', close: '21:00', closed: false },
  friday: { open: '09:00', close: '22:00', closed: false },
  saturday: { open: '10:00', close: '22:00', closed: false },
  sunday: { open: '12:00', close: '20:00', closed: false }
}