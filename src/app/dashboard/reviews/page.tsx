'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { LoadingSpinner } from '@/components/ui/loading'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

interface Review {
  id: string
  rating: number
  comment: string
  created_at: string
  customer_name: string
  dish_name: string
  spice_level: number
  hidden: boolean
}

interface Dish {
  id: string
  name: string
}

export default function ReviewsPage() {
  const { user, isVendor, hasRestaurant } = useAuth()
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState<Review[]>([])
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([])
  const [filterRating, setFilterRating] = useState<string>('all')
  const [filterDish, setFilterDish] = useState<string>('all')
  const [filterDate, setFilterDate] = useState<string>('all')
  const [filterHidden, setFilterHidden] = useState<string>('visible')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [dishes, setDishes] = useState<Dish[]>([])
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    averageSpiceLevel: 0,
    averageAuthenticity: 0,
    averageCulturalExperience: 0,
    averageOverallExperience: 0
  })

  useEffect(() => {
    console.log('Auth Debug - isVendor:', isVendor)
    console.log('Auth Debug - hasRestaurant:', hasRestaurant)
    console.log('Auth Debug - user:', user)
    console.log('Auth Debug - restaurant:', user?.restaurant)
    
    if (user?.restaurant?.id) {
      fetchReviews()
      fetchDishes()
    }
  }, [user?.restaurant?.id, isVendor, user, hasRestaurant, fetchReviews, fetchDishes])

  useEffect(() => {
    if (reviews.length > 0) {
      applyFilters()
      calculateStats()
    }
  }, [reviews, filterRating, filterDish, filterDate, filterHidden, searchTerm, applyFilters, calculateStats])

  const fetchReviews = useCallback(async () => {
    if (!user?.restaurant?.id) return
    
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          user:user_id(*),
          dish:dish_id(*),
          order:order_id(*)
        `)
        .eq('restaurant_id', user.restaurant.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      setReviews(data || [])
      setFilteredReviews(data || [])
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }, [user?.restaurant?.id])

  const fetchDishes = useCallback(async () => {
    if (!user?.restaurant?.id) return
    
    try {
      const { data, error } = await supabase
        .from('dishes')
        .select('id, name')
        .eq('restaurant_id', user.restaurant.id)

      if (error) throw error
      setDishes(data || [])
    } catch (error) {
      console.error('Error fetching dishes:', error)
    }
  }, [user?.restaurant?.id])

  const applyFilters = useCallback(() => {
    let filtered = [...reviews]

    // Apply rating filter
    if (filterRating !== 'all') {
      filtered = filtered.filter(review => review.rating === parseInt(filterRating))
    }

    // Apply dish filter
    if (filterDish !== 'all') {
      filtered = filtered.filter(review => review.dish_id === filterDish)
    }

    // Apply date filter
    if (filterDate !== 'all') {
      const now = new Date()
      const dateLimit = new Date()
      
      switch (filterDate) {
        case 'today':
          dateLimit.setDate(now.getDate() - 1)
          break
        case 'week':
          dateLimit.setDate(now.getDate() - 7)
          break
        case 'month':
          dateLimit.setMonth(now.getMonth() - 1)
          break
        case 'year':
          dateLimit.setFullYear(now.getFullYear() - 1)
          break
      }
      
      filtered = filtered.filter(review => new Date(review.created_at) >= dateLimit)
    }

    // Apply hidden filter
    if (filterHidden === 'visible') {
      filtered = filtered.filter(review => !review.hidden_by_vendor)
    } else if (filterHidden === 'hidden') {
      filtered = filtered.filter(review => review.hidden_by_vendor)
    }
    // 'all' option shows everything

    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(review => 
        review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.dish?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredReviews(filtered)
  }, [reviews, filterRating, filterDish, filterDate, filterHidden, searchTerm])

  const calculateStats = useCallback(() => {
    if (reviews.length === 0) return

    const totalReviews = reviews.length
    const sumRatings = reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = sumRatings / totalReviews

    // Calculate rating distribution
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        ratingDistribution[review.rating as 1|2|3|4|5]++
      }
    })

    // Calculate average specialty ratings
    const validSpiceRatings = reviews.filter(r => r.spice_level_rating !== null)
    const validAuthenticityRatings = reviews.filter(r => r.authenticity_rating !== null)
    const validCulturalRatings = reviews.filter(r => r.cultural_experience_rating !== null)
    const validOverallRatings = reviews.filter(r => r.overall_experience !== null)

    const averageSpiceLevel = validSpiceRatings.length > 0 
      ? validSpiceRatings.reduce((sum, r) => sum + (r.spice_level_rating || 0), 0) / validSpiceRatings.length 
      : 0
    
    const averageAuthenticity = validAuthenticityRatings.length > 0 
      ? validAuthenticityRatings.reduce((sum, r) => sum + (r.authenticity_rating || 0), 0) / validAuthenticityRatings.length 
      : 0
    
    const averageCulturalExperience = validCulturalRatings.length > 0 
      ? validCulturalRatings.reduce((sum, r) => sum + (r.cultural_experience_rating || 0), 0) / validCulturalRatings.length 
      : 0
    
    const averageOverallExperience = validOverallRatings.length > 0 
      ? validOverallRatings.reduce((sum, r) => sum + (r.overall_experience || 0), 0) / validOverallRatings.length 
      : 0

    setStats({
      averageRating,
      totalReviews,
      ratingDistribution,
      averageSpiceLevel,
      averageAuthenticity,
      averageCulturalExperience,
      averageOverallExperience
    })
  }, [reviews])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const handleHideReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to hide this review? It will not be visible to customers but will still be included in your overall ratings.')) {
      return
    }

    try {
      setActionLoading(reviewId)
      const response = await fetch('/api/reviews/hide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewId,
          restaurantId: user?.restaurant?.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to hide review')
      }

      // Refresh reviews
      fetchReviews()
    } catch (error) {
      console.error('Error hiding review:', error)
      alert('Failed to hide review. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleUnhideReview = async (reviewId: string) => {
    try {
      setActionLoading(reviewId)
      const response = await fetch(`/api/reviews/hide?reviewId=${reviewId}&restaurantId=${user?.restaurant?.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to unhide review')
      }

      // Refresh reviews
      fetchReviews()
    } catch (error) {
      console.error('Error unhiding review:', error)
      alert('Failed to unhide review. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to permanently delete this review? This action cannot be undone.')) {
      return
    }

    try {
      setActionLoading(reviewId)
      const response = await fetch(`/api/reviews/delete?reviewId=${reviewId}&restaurantId=${user?.restaurant?.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete review')
      }

      // Refresh reviews
      fetchReviews()
    } catch (error) {
      console.error('Error deleting review:', error)
      alert('Failed to delete review. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg 
            key={star} 
            className="w-5 h-5"
            style={{ color: star <= rating ? 'var(--color-hoppn-yellow)' : '#D1D5DB' }} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-2" style={{ color: 'var(--color-text-medium)' }}>{rating.toFixed(1)}</span>
      </div>
    )
  }

  if (!isVendor || !hasRestaurant) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-dark)' }}>Access Denied</h1>
        <p style={{ color: 'var(--color-text-medium)' }}>You need to be logged in as a vendor with a restaurant to view this page.</p>
        <div className="mt-4 text-sm" style={{ color: 'var(--color-text-light)' }}>
          <p>Debug info:</p>
          <p>isVendor: {isVendor ? 'true' : 'false'}</p>
          <p>hasRestaurant: {hasRestaurant ? 'true' : 'false'}</p>
          <p>user?.restaurant?.id: {user?.restaurant?.id || 'undefined'}</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-6 py-8" style={{ backgroundColor: 'var(--color-earth-beige)' }}>
        <h1 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif', color: 'var(--color-text-dark)' }}>Customer Reviews</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 shadow-sm border" style={{ backgroundColor: 'var(--color-warm-cream)', borderColor: 'var(--color-border)' }}>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-dark)' }}>Average Rating</h3>
          <div className="flex items-center">
            {renderStars(stats.averageRating)}
            <span className="ml-2 text-2xl font-bold">{stats.averageRating.toFixed(1)}</span>
          </div>
          <p className="text-sm mt-2" style={{ color: 'var(--color-text-light)' }}>Based on {stats.totalReviews} reviews</p>
        </Card>
        
        <Card className="p-6 shadow-sm border" style={{ backgroundColor: 'var(--color-warm-cream)', borderColor: 'var(--color-border)' }}>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-dark)' }}>Rating Distribution</h3>
          <div className="space-y-1">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center">
                <span className="w-3">{rating}</span>
                <div className="w-full rounded-full h-2 mx-2" style={{ backgroundColor: '#E5E7EB' }}>
                  <div 
                    className="h-2 rounded-full"
                    style={{ 
                      backgroundColor: 'var(--color-hoppn-orange)',
                      width: `${stats.totalReviews > 0 
                        ? (stats.ratingDistribution[rating as 1|2|3|4|5] / stats.totalReviews) * 100 
                        : 0}%` 
                    }}
                  ></div>
                </div>
                <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                  {stats.ratingDistribution[rating as 1|2|3|4|5]}
                </span>
              </div>
            ))}
          </div>
        </Card>
        
        <Card className="p-6 shadow-sm border" style={{ backgroundColor: 'var(--color-warm-cream)', borderColor: 'var(--color-border)' }}>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-dark)' }}>Specialty Ratings</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm" style={{ color: 'var(--color-text-medium)' }}>Spice Level:</span>
              <span className="ml-2 font-medium" style={{ color: 'var(--color-text-dark)' }}>{stats.averageSpiceLevel.toFixed(1)}</span>
            </div>
            <div>
              <span className="text-sm" style={{ color: 'var(--color-text-medium)' }}>Authenticity:</span>
              <span className="ml-2 font-medium" style={{ color: 'var(--color-text-dark)' }}>{stats.averageAuthenticity.toFixed(1)}</span>
            </div>
            <div>
              <span className="text-sm" style={{ color: 'var(--color-text-medium)' }}>Cultural Experience:</span>
              <span className="ml-2 font-medium" style={{ color: 'var(--color-text-dark)' }}>{stats.averageCulturalExperience.toFixed(1)}</span>
            </div>
            <div>
              <span className="text-sm" style={{ color: 'var(--color-text-medium)' }}>Overall Experience:</span>
              <span className="ml-2 font-medium" style={{ color: 'var(--color-text-dark)' }}>{stats.averageOverallExperience.toFixed(1)}</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 shadow-sm border" style={{ backgroundColor: 'var(--color-warm-cream)', borderColor: 'var(--color-border)' }}>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-dark)' }}>Review Insights</h3>
          <p className="text-sm" style={{ color: 'var(--color-text-medium)' }}>
            {stats.totalReviews === 0 
              ? "No reviews yet" 
              : `${Math.round((stats.ratingDistribution[4] + stats.ratingDistribution[5]) / stats.totalReviews * 100)}% of customers rated 4 stars or higher`
            }
          </p>
          {/* We could add more insights here as we gather more data */}
        </Card>
      </div>
      
      {/* Filters */}
      <div className="rounded-lg shadow-sm border p-6 mb-6" style={{ backgroundColor: 'var(--color-soft-orange)', borderColor: 'var(--color-border)' }}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-dark)',
                backgroundColor: '#FFFFFF'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-hoppn-orange)';
                e.target.style.boxShadow = '0 0 0 2px rgba(241, 80, 41, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--color-border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        
        <div className="flex flex-wrap gap-2">
          <Select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="w-full md:w-32"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </Select>
          
          <Select
            value={filterDish}
            onChange={(e) => setFilterDish(e.target.value)}
            className="w-full md:w-40"
          >
            <option value="all">All Dishes</option>
            {dishes.map(dish => (
              <option key={dish.id} value={dish.id}>{dish.name}</option>
            ))}
          </Select>
          
          <Select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full md:w-40"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </Select>
          
          <Select
            value={filterHidden}
            onChange={(e) => setFilterHidden(e.target.value)}
            className="w-full md:w-40"
          >
            <option value="visible">Visible Reviews</option>
            <option value="hidden">Hidden Reviews</option>
            <option value="all">All Reviews</option>
          </Select>
        </div>
        </div>
      </div>
      
      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center my-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl" style={{ color: 'var(--color-text-medium)' }}>No reviews found</p>
          {reviews.length > 0 && (
            <p className="mt-2" style={{ color: 'var(--color-text-light)' }}>Try adjusting your filters</p>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredReviews.map(review => (
            <Card key={review.id} className="p-6 shadow-sm border" style={{ 
              backgroundColor: review.hidden_by_vendor ? 'var(--color-soft-orange)' : '#FFFFFF', 
              borderColor: 'var(--color-border)',
              opacity: review.hidden_by_vendor ? 0.8 : 1
            }}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center mb-2">
                    {renderStars(review.rating)}
                    <span className="ml-4 text-sm" style={{ color: 'var(--color-text-light)' }}>
                      {formatDate(review.created_at)}
                    </span>
                  </div>
                  <h3 className="font-semibold" style={{ color: 'var(--color-text-dark)' }}>
                    {review.user?.name || 'Anonymous Customer'}
                  </h3>
                  {review.dish && (
                    <Badge variant="outline" className="mt-1">
                      {review.dish.name}
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
                    Order #{review.order?.order_number?.substring(0, 8) || 'N/A'}
                  </p>
                </div>
              </div>
              
              {review.comment && (
                <div className="mb-4">
                  <p style={{ color: 'var(--color-text-medium)' }}>{review.comment}</p>
                </div>
              )}
              
              {/* Specialty Ratings */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                {review.spice_level_rating !== null && (
                  <div className="text-sm">
                    <span style={{ color: 'var(--color-text-light)' }}>Spice Level:</span>
                    <span className="ml-1 font-medium" style={{ color: 'var(--color-text-dark)' }}>{review.spice_level_rating}/5</span>
                  </div>
                )}
                {review.authenticity_rating !== null && (
                  <div className="text-sm">
                    <span style={{ color: 'var(--color-text-light)' }}>Authenticity:</span>
                    <span className="ml-1 font-medium" style={{ color: 'var(--color-text-dark)' }}>{review.authenticity_rating}/5</span>
                  </div>
                )}
                {review.cultural_experience_rating !== null && (
                  <div className="text-sm">
                    <span style={{ color: 'var(--color-text-light)' }}>Cultural:</span>
                    <span className="ml-1 font-medium" style={{ color: 'var(--color-text-dark)' }}>{review.cultural_experience_rating}/5</span>
                  </div>
                )}
                {review.overall_experience !== null && (
                  <div className="text-sm">
                    <span style={{ color: 'var(--color-text-light)' }}>Overall:</span>
                    <span className="ml-1 font-medium" style={{ color: 'var(--color-text-dark)' }}>{review.overall_experience}/5</span>
                  </div>
                )}
              </div>
              
              {/* Review Management Actions */}
              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex gap-2">
                  {review.hidden_by_vendor ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={actionLoading === review.id}
                      onClick={() => handleUnhideReview(review.id)}
                    >
                      {actionLoading === review.id ? 'Processing...' : 'Unhide Review'}
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={actionLoading === review.id}
                      onClick={() => handleHideReview(review.id)}
                    >
                      {actionLoading === review.id ? 'Processing...' : 'Hide Review'}
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    style={{ color: '#DC2626' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#991B1B'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#DC2626'}
                    disabled={actionLoading === review.id}
                    onClick={() => handleDeleteReview(review.id)}
                  >
                    {actionLoading === review.id ? 'Processing...' : 'Delete Review'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      </div>
    </DashboardLayout>
  )
}
