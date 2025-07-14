'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { LoadingSpinner } from '@/components/ui/loading'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

export default function ReviewsPage() {
  const { user, isVendor, hasRestaurant } = useAuth()
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState<any[]>([])
  const [filteredReviews, setFilteredReviews] = useState<any[]>([])
  const [filterRating, setFilterRating] = useState<string>('all')
  const [filterDish, setFilterDish] = useState<string>('all')
  const [filterDate, setFilterDate] = useState<string>('all')
  const [filterHidden, setFilterHidden] = useState<string>('visible')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [dishes, setDishes] = useState<any[]>([])
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
  }, [user?.restaurant?.id, isVendor, user, hasRestaurant])

  useEffect(() => {
    if (reviews.length > 0) {
      applyFilters()
      calculateStats()
    }
  }, [reviews, filterRating, filterDish, filterDate, filterHidden, searchTerm])

  const fetchReviews = async () => {
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
        .eq('restaurant_id', user?.restaurant?.id!)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      setReviews(data || [])
      setFilteredReviews(data || [])
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDishes = async () => {
    try {
      const { data, error } = await supabase
        .from('dishes')
        .select('id, name')
        .eq('restaurant_id', user?.restaurant?.id!)

      if (error) throw error
      setDishes(data || [])
    } catch (error) {
      console.error('Error fetching dishes:', error)
    }
  }

  const applyFilters = () => {
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
      let dateLimit = new Date()
      
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
  }

  const calculateStats = () => {
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
  }

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
            className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-2 text-gray-600">{rating.toFixed(1)}</span>
      </div>
    )
  }

  if (!isVendor || !hasRestaurant) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>You need to be logged in as a vendor with a restaurant to view this page.</p>
        <div className="mt-4 text-sm text-gray-600">
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
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6 text-slate-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>Customer Reviews</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-white shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-2 text-slate-900">Average Rating</h3>
          <div className="flex items-center">
            {renderStars(stats.averageRating)}
            <span className="ml-2 text-2xl font-bold">{stats.averageRating.toFixed(1)}</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Based on {stats.totalReviews} reviews</p>
        </Card>
        
        <Card className="p-6 bg-white shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-2 text-slate-900">Rating Distribution</h3>
          <div className="space-y-1">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center">
                <span className="w-3">{rating}</span>
                <div className="w-full bg-gray-200 rounded-full h-2 mx-2">
                  <div 
                    className="bg-[#F15029] h-2 rounded-full" 
                    style={{ 
                      width: `${stats.totalReviews > 0 
                        ? (stats.ratingDistribution[rating as 1|2|3|4|5] / stats.totalReviews) * 100 
                        : 0}%` 
                    }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">
                  {stats.ratingDistribution[rating as 1|2|3|4|5]}
                </span>
              </div>
            ))}
          </div>
        </Card>
        
        <Card className="p-6 bg-white shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-2 text-slate-900">Specialty Ratings</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-600">Spice Level:</span>
              <span className="ml-2 font-medium">{stats.averageSpiceLevel.toFixed(1)}</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Authenticity:</span>
              <span className="ml-2 font-medium">{stats.averageAuthenticity.toFixed(1)}</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Cultural Experience:</span>
              <span className="ml-2 font-medium">{stats.averageCulturalExperience.toFixed(1)}</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Overall Experience:</span>
              <span className="ml-2 font-medium">{stats.averageOverallExperience.toFixed(1)}</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-white shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-2 text-slate-900">Review Insights</h3>
          <p className="text-sm text-gray-600">
            {stats.totalReviews === 0 
              ? "No reviews yet" 
              : `${Math.round((stats.ratingDistribution[4] + stats.ratingDistribution[5]) / stats.totalReviews * 100)}% of customers rated 4 stars or higher`
            }
          </p>
          {/* We could add more insights here as we gather more data */}
        </Card>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-slate-300 focus:ring-[#F15029] focus:border-[#F15029]"
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
          <p className="text-xl text-gray-500">No reviews found</p>
          {reviews.length > 0 && (
            <p className="text-gray-400 mt-2">Try adjusting your filters</p>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredReviews.map(review => (
            <Card key={review.id} className={`p-6 bg-white shadow-sm border border-slate-200 ${review.hidden_by_vendor ? 'bg-gray-50' : ''}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center mb-2">
                    {renderStars(review.rating)}
                    <span className="ml-4 text-gray-500 text-sm">
                      {formatDate(review.created_at)}
                    </span>
                  </div>
                  <h3 className="font-semibold">
                    {review.user?.name || 'Anonymous Customer'}
                  </h3>
                  {review.dish && (
                    <Badge variant="outline" className="mt-1">
                      {review.dish.name}
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Order #{review.order?.order_number?.substring(0, 8) || 'N/A'}
                  </p>
                </div>
              </div>
              
              {review.comment && (
                <div className="mb-4">
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              )}
              
              {/* Specialty Ratings */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                {review.spice_level_rating !== null && (
                  <div className="text-sm">
                    <span className="text-gray-500">Spice Level:</span>
                    <span className="ml-1 font-medium">{review.spice_level_rating}/5</span>
                  </div>
                )}
                {review.authenticity_rating !== null && (
                  <div className="text-sm">
                    <span className="text-gray-500">Authenticity:</span>
                    <span className="ml-1 font-medium">{review.authenticity_rating}/5</span>
                  </div>
                )}
                {review.cultural_experience_rating !== null && (
                  <div className="text-sm">
                    <span className="text-gray-500">Cultural:</span>
                    <span className="ml-1 font-medium">{review.cultural_experience_rating}/5</span>
                  </div>
                )}
                {review.overall_experience !== null && (
                  <div className="text-sm">
                    <span className="text-gray-500">Overall:</span>
                    <span className="ml-1 font-medium">{review.overall_experience}/5</span>
                  </div>
                )}
              </div>
              
              {/* Review Management Actions */}
              <div className="mt-4 pt-4 border-t border-gray-200">
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
                    className="text-red-500 hover:text-red-700"
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
