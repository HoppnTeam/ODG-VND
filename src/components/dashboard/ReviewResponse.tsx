'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'

interface ReviewActionProps {
  reviewId: string
  restaurantId: string
  onReviewDeleted: () => void
}

export default function ReviewAction({ 
  reviewId, 
  restaurantId,
  onReviewDeleted 
}: ReviewActionProps) {
  const { isVendor } = useAuth()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to permanently delete this review? This action cannot be undone.')) {
      return
    }

    try {
      setIsDeleting(true)
      setError('')

      const response = await fetch(`/api/reviews/delete?reviewId=${reviewId}&restaurantId=${restaurantId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete review')
      }

      onReviewDeleted()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred while deleting the review')
    } finally {
      setIsDeleting(false)
    }
  }

  if (!isVendor) {
    return null
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-sm text-gray-900">Review Actions</h4>
          <p className="text-xs text-gray-500 mt-1">
            You can permanently delete this review if needed
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-red-500 hover:text-red-700 hover:border-red-300" 
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete Review'}
        </Button>
      </div>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  )
}