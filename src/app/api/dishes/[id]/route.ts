import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, requireAuth, serverDbHelpers } from '@/lib/supabase-server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const dishData = await request.json()
    const { id: dishId } = await params

    const supabase = await createServerSupabaseClient()

    // Get the vendor's restaurant
    const { data: restaurant, error: restaurantError } = await serverDbHelpers.getRestaurantByAuthUserId(user.id)
    
    if (restaurantError || !restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
    }

    // Verify dish belongs to this restaurant
    const { data: dish, error: dishError } = await supabase
      .from('dishes')
      .select('*')
      // @ts-expect-error - Supabase type inference issue with route params
      .eq('id', dishId)
      .eq('restaurant_id', restaurant.id)
      .single()

    if (dishError || !dish) {
      return NextResponse.json({ error: 'Dish not found' }, { status: 404 })
    }

    // Update dish
    const { data: updatedDish, error: updateError } = await supabase
      .from('dishes')
      .update({
        ...dishData,
        updated_at: new Date().toISOString()
      })
      // @ts-expect-error - Supabase type inference issue with route params
      .eq('id', dishId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating dish:', updateError)
      return NextResponse.json({ error: 'Failed to update dish' }, { status: 500 })
    }

    return NextResponse.json({ dish: updatedDish })
  } catch (error) {
    console.error('Update dish API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id: dishId } = await params

    const supabase = await createServerSupabaseClient()

    // Get the vendor's restaurant
    const { data: restaurant, error: restaurantError } = await serverDbHelpers.getRestaurantByAuthUserId(user.id)
    
    if (restaurantError || !restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
    }

    // Verify dish belongs to this restaurant
    const { data: dish, error: dishError } = await supabase
      .from('dishes')
      .select('*')
      // @ts-expect-error - Supabase type inference issue with route params
      .eq('id', dishId)
      .eq('restaurant_id', restaurant.id)
      .single()

    if (dishError || !dish) {
      return NextResponse.json({ error: 'Dish not found' }, { status: 404 })
    }

    // Delete dish
    const { error: deleteError } = await supabase
      .from('dishes')
      .delete()
      // @ts-expect-error - Supabase type inference issue with route params
      .eq('id', dishId)

    if (deleteError) {
      console.error('Error deleting dish:', deleteError)
      return NextResponse.json({ error: 'Failed to delete dish' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Dish deleted successfully' })
  } catch (error) {
    console.error('Delete dish API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}