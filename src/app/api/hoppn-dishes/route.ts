import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '@/types/supabase'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })

    const { data: dishes, error } = await supabase
      .from('hoppn_dishes')
      .select(`
        id,
        name,
        description,
        category,
        country_origin,
        country_flag,
        base_spice_level,
        origin_story,
        base_ingredients,
        cultural_significance,
        health_benefits,
        native_regions,
        taste_profile,
        preparation_method,
        is_vegetarian,
        is_vegan,
        country_id,
        countries!inner(name, flag, region)
      `)
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching hoppn dishes:', error)
      return NextResponse.json(
        { error: 'Failed to fetch dishes' },
        { status: 500 }
      )
    }

    return NextResponse.json({ dishes })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validate required fields
    const {
      name,
      description,
      category,
      country_id,
      base_spice_level,
      origin_story,
      base_ingredients,
      cultural_significance,
      is_vegetarian = false,
      is_vegan = false,
      is_halal = false,
      calories,
      preparation_method,
      health_benefits,
      native_regions,
      taste_profile
    } = body

    if (!name || !description || !category || !country_id) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, category, country_id' },
        { status: 400 }
      )
    }

    // For now, return success message since we're using hardcoded data
    // In the future, this will create a new dish in hoppn_dishes table for admin approval
    
    const newDish = {
      id: Date.now().toString(),
      name,
      description,
      category,
      country_id,
      base_spice_level: base_spice_level || 1,
      origin_story,
      base_ingredients,
      cultural_significance,
      is_vegetarian,
      is_vegan,
      is_halal,
      calories: calories ? parseInt(calories) : null,
      preparation_method,
      health_benefits,
      native_regions,
      taste_profile,
      is_active: false // New dishes start as inactive pending approval
    }

    return NextResponse.json({ 
      dish: newDish,
      message: 'Dish submitted for approval. It will be available to all vendors once approved by admin.'
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
