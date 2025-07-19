import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, requireAuth, serverDbHelpers } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const supabase = await createServerSupabaseClient()

    // Get the vendor's restaurant
    const { data: restaurant, error: restaurantError } = await serverDbHelpers.getRestaurantByAuthUserId(user.id)
    
    if (restaurantError || !restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
    }

    // Get dishes for this restaurant
    const { data: dishes, error: dishesError } = await supabase
      .from('dishes')
      .select('*')
      .eq('restaurant_id', restaurant.id)
      .order('created_at', { ascending: false })

    if (dishesError) {
      console.error('Error fetching dishes:', dishesError)
      return NextResponse.json({ error: 'Failed to fetch dishes' }, { status: 500 })
    }

    return NextResponse.json({ dishes })
  } catch (error) {
    console.error('Dishes API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const dishData = await request.json()
    const supabase = await createServerSupabaseClient()

    // Get the vendor's restaurant
    const { data: restaurant, error: restaurantError } = await serverDbHelpers.getRestaurantByAuthUserId(user.id)
    
    if (restaurantError || !restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
    }

    // Create new dish
    const { data: newDish, error: createError } = await supabase
      .from('dishes')
      .insert({
        restaurant_id: restaurant.id,
        name: dishData.name,
        description: dishData.description,
        price: dishData.price,
        category: dishData.category,
        country_origin: dishData.country_origin || restaurant.cuisine_type,
        country_flag: dishData.country_flag || '',
        image_url: dishData.image_url,
        is_active: dishData.is_active ?? true,
        status: 'active',
        chef_special: dishData.chef_special ?? false,
        size_options: dishData.size_options,
        custom_ingredients: dishData.custom_ingredients,
        restaurant_notes: dishData.restaurant_notes
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating dish:', createError)
      return NextResponse.json({ error: 'Failed to create dish' }, { status: 500 })
    }

    return NextResponse.json({ dish: newDish }, { status: 201 })
  } catch (error) {
    console.error('Create dish API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}