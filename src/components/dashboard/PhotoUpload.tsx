'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Upload, X, AlertCircle } from 'lucide-react'
import Image from 'next/image'

type PhotoUploadProps = {
  restaurantId: string
  currentPhotos?: string[]
  onSuccess?: (photos: string[]) => void
  maxPhotos?: number
}

export default function PhotoUpload({ 
  restaurantId, 
  currentPhotos = [], 
  onSuccess, 
  maxPhotos = 10 
}: PhotoUploadProps) {
  const supabase = createClientComponentClient()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [photos, setPhotos] = useState<string[]>(currentPhotos)
  const [uploading, setUploading] = useState<boolean[]>([])
  
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    
    // Check if adding these files would exceed the limit
    if (photos.length + files.length > maxPhotos) {
      setError(`You can only upload up to ${maxPhotos} photos`)
      return
    }
    
    setError(null)
    setUploading(new Array(files.length).fill(true))
    
    try {
      const uploadPromises = files.map(async (file, index) => {
        // Validate file
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} is too large. Maximum size is 5MB.`)
        }
        
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
          throw new Error(`${file.name} is not a supported format. Use JPEG, PNG, or WebP.`)
        }
        
        // Generate unique filename
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const filePath = `restaurant-photos/${restaurantId}/${fileName}`
        
        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('restaurant-images')
          .upload(filePath, file)
          
        if (uploadError) {
          throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`)
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('restaurant-images')
          .getPublicUrl(filePath)
          
        return publicUrl
      })
      
      const uploadedUrls = await Promise.all(uploadPromises)
      const newPhotos = [...photos, ...uploadedUrls]
      
      // Update restaurant photos in database
      const { error: updateError } = await supabase
        .from('restaurants')
        .update({ photos: newPhotos })
        .eq('id', restaurantId)
        
      if (updateError) {
        throw new Error(`Failed to update restaurant photos: ${updateError.message}`)
      }
      
      setPhotos(newPhotos)
      if (onSuccess) {
        onSuccess(newPhotos)
      }
      
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading([])
    }
  }
  
  const removePhoto = async (photoUrl: string, index: number) => {
    setLoading(true)
    setError(null)
    
    try {
      // Extract file path from URL for deletion
      const urlParts = photoUrl.split('/')
      const fileName = urlParts[urlParts.length - 1]
      const filePath = `restaurant-photos/${restaurantId}/${fileName}`
      
      // Delete from storage
      const { error: deleteError } = await supabase.storage
        .from('restaurant-images')
        .remove([filePath])
        
      if (deleteError) {
        console.warn('Failed to delete file from storage:', deleteError.message)
      }
      
      // Update photos array
      const newPhotos = photos.filter((_, i) => i !== index)
      
      // Update restaurant photos in database
      const { error: updateError } = await supabase
        .from('restaurants')
        .update({ photos: newPhotos })
        .eq('id', restaurantId)
        
      if (updateError) {
        throw new Error(`Failed to update restaurant photos: ${updateError.message}`)
      }
      
      setPhotos(newPhotos)
      if (onSuccess) {
        onSuccess(newPhotos)
      }
      
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Restaurant Photos</h3>
        <span className="text-sm text-gray-500">
          {photos.length} / {maxPhotos} photos
        </span>
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {/* Photo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div key={index} className="relative group">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={photo}
                alt={`Restaurant photo ${index + 1}`}
                width={200}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => removePhoto(photo, index)}
              disabled={loading}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        
        {/* Upload Button */}
        {photos.length < maxPhotos && (
          <div className="aspect-square">
            <label className="flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                <p className="text-sm text-gray-500 text-center">
                  <span className="font-semibold">Click to upload</span>
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, WebP</p>
                <p className="text-xs text-gray-500">Max 5MB</p>
              </div>
              <input
                type="file"
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                disabled={loading || uploading.some(Boolean)}
              />
            </label>
          </div>
        )}
      </div>
      
      {/* Upload Progress */}
      {uploading.some(Boolean) && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
          <span>Uploading photos...</span>
        </div>
      )}
      
      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Photo Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Upload high-quality photos of your restaurant interior and exterior</li>
          <li>• Show your food preparation area and dining space</li>
          <li>• Include photos of your signature dishes</li>
          <li>• Good lighting makes your photos more appealing</li>
        </ul>
      </div>
    </div>
  )
}
