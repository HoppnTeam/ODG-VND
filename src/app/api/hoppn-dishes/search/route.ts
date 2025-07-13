import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '@/types/supabase'

// Hardcoded master dishes until hoppn_dishes table is properly set up
const masterDishes = [
  {
    id: '1',
    name: 'Jollof Rice',
    description: 'A beloved West African rice dish cooked in a flavorful tomato-based sauce',
    category: 'rice_beans',
    country_origin: 'Nigeria',
    country_flag: '🇳🇬',
    base_spice_level: 2,
    origin_story: 'Originating from the Wolof people of Senegal, Jollof rice has become a staple across West Africa',
    base_ingredients: ['rice', 'tomatoes', 'onions', 'peppers', 'spices'],
    cultural_significance: 'Symbol of celebration and unity across West Africa',
    is_vegetarian: true,
    is_vegan: true,
    is_halal: true
  },
  {
    id: '2',
    name: 'Injera',
    description: 'Traditional Ethiopian sourdough flatbread with a unique spongy texture',
    category: 'breads_grains',
    country_origin: 'Ethiopia',
    country_flag: '🇪🇹',
    base_spice_level: 1,
    origin_story: 'Ancient bread dating back thousands of years, central to Ethiopian dining culture',
    base_ingredients: ['teff flour', 'water'],
    cultural_significance: 'Sacred bread that brings families together for communal meals',
    is_vegetarian: true,
    is_vegan: true,
    is_halal: true
  },
  {
    id: '3',
    name: 'Tagine',
    description: 'Slow-cooked North African stew named after the conical clay pot it\'s cooked in',
    category: 'stews_soups',
    country_origin: 'Morocco',
    country_flag: '🇲🇦',
    base_spice_level: 3,
    origin_story: 'Berber cooking method perfected over centuries in the Atlas Mountains',
    base_ingredients: ['meat or vegetables', 'dried fruits', 'aromatic spices'],
    cultural_significance: 'Represents the art of slow cooking and hospitality in Moroccan culture',
    is_vegetarian: false,
    is_vegan: false,
    is_halal: true
  },
  {
    id: '4',
    name: 'Bobotie',
    description: 'South African spiced meat casserole with an egg-based topping',
    category: 'meats_seafood',
    country_origin: 'South Africa',
    country_flag: '🇿🇦',
    base_spice_level: 2,
    origin_story: 'Fusion dish reflecting South Africa\'s diverse culinary heritage',
    base_ingredients: ['ground meat', 'curry spices', 'bread', 'eggs', 'milk'],
    cultural_significance: 'National dish representing South Africa\'s rainbow nation identity',
    is_vegetarian: false,
    is_vegan: false,
    is_halal: false
  },
  {
    id: '5',
    name: 'Fufu',
    description: 'Starchy staple food made from cassava, yam, or plantain',
    category: 'sides_starches',
    country_origin: 'Ghana',
    country_flag: '🇬🇭',
    base_spice_level: 1,
    origin_story: 'Ancient food preparation method passed down through generations',
    base_ingredients: ['cassava', 'yam', 'plantain'],
    cultural_significance: 'Sacred food that connects communities to their ancestors',
    is_vegetarian: true,
    is_vegan: true,
    is_halal: true
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ dishes: [] })
    }

    // Filter dishes based on search query
    const filteredDishes = masterDishes.filter(dish => 
      dish.name.toLowerCase().includes(query.toLowerCase()) ||
      dish.description.toLowerCase().includes(query.toLowerCase()) ||
      dish.country_origin.toLowerCase().includes(query.toLowerCase())
    )

    return NextResponse.json({ dishes: filteredDishes })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
