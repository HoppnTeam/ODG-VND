import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// This endpoint handles deleting reviews from the database
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const reviewId = searchParams.get('reviewId')
    const restaurantId = searchParams.get('restaurantId')

    if (!reviewId || !restaurantId) {
      return NextResponse.json(
        { error: 'Review ID and Restaurant ID are required' },
        { status: 400 }
      )
    }

    // First verify that this review belongs to the restaurant
    const { data: reviewData, error: reviewError } = await supabase
      .from('reviews')
      .select('restaurant_id')
      .eq('id', reviewId)
      .single()

    if (reviewError) {
      console.error('Error fetching review:', reviewError)
      return NextResponse.json(
        { error: 'Failed to fetch review' },
        { status: 500 }
      )
    }

    if (reviewData.restaurant_id !== restaurantId) {
      return NextResponse.json(
        { error: 'Unauthorized: Review does not belong to this restaurant' },
        { status: 403 }
      )
    }

    // Delete the review
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId)

    if (error) {
      console.error('Error deleting review:', error)
      return NextResponse.json(
        { error: 'Failed to delete review' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in delete review API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
