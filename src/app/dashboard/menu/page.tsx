'use client'

import { useAuth } from '@/hooks/useAuth'
import { LoadingPage } from '@/components/ui/loading'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PlusCircle, Edit3, Eye, EyeOff, DollarSign, Clock, Star, Trash2 } from 'lucide-react'
import { useState } from 'react'

// Mock menu data for tablet demonstration
const mockDishes = [
  {
    id: 'dish-001',
    name: 'Jollof Rice with Chicken',
    description: 'Traditional Nigerian jollof rice served with perfectly seasoned grilled chicken, mixed vegetables, and plantain.',
    price: 15.99,
    category: 'Main Dishes',
    image: '/api/placeholder/300/200',
    available: true,
    prepTime: '20-25 min',
    rating: 4.8,
    reviews: 34,
    allergens: ['Gluten-Free', 'Dairy-Free']
  },
  {
    id: 'dish-002',
    name: 'Egusi Soup with Pounded Yam',
    description: 'Rich and flavorful egusi soup made with ground melon seeds, spinach, and assorted meat, served with smooth pounded yam.',
    price: 18.99,
    category: 'Main Dishes',
    image: '/api/placeholder/300/200',
    available: true,
    prepTime: '25-30 min',
    rating: 4.9,
    reviews: 28,
    allergens: ['Gluten-Free']
  },
  {
    id: 'dish-003',
    name: 'Suya Platter',
    description: 'Spicy grilled beef skewers marinated in traditional suya spice blend, served with onions, tomatoes, and spicy sauce.',
    price: 22.99,
    category: 'Grilled Items',
    image: '/api/placeholder/300/200',
    available: false,
    prepTime: '15-20 min',
    rating: 4.7,
    reviews: 45,
    allergens: ['Spicy', 'Dairy-Free']
  },
  {
    id: 'dish-004',
    name: 'Plantain Chips',
    description: 'Crispy golden plantain chips seasoned with sea salt, perfect as a side dish or snack.',
    price: 5.99,
    category: 'Sides & Snacks',
    image: '/api/placeholder/300/200',
    available: true,
    prepTime: '5-10 min',
    rating: 4.6,
    reviews: 67,
    allergens: ['Vegan', 'Gluten-Free']
  },
  {
    id: 'dish-005',
    name: 'Chin Chin',
    description: 'Sweet and crunchy Nigerian snack made from flour, sugar, and spices, perfect with tea or as a dessert.',
    price: 4.99,
    category: 'Desserts',
    image: '/api/placeholder/300/200',
    available: true,
    prepTime: '5 min',
    rating: 4.4,
    reviews: 23,
    allergens: ['Vegetarian']
  },
  {
    id: 'dish-006',
    name: 'Palm Nut Soup',
    description: 'Traditional Ghanaian palm nut soup with fish, meat, and vegetables, served with rice or fufu.',
    price: 16.99,
    category: 'Main Dishes',
    image: '/api/placeholder/300/200',
    available: true,
    prepTime: '30-35 min',
    rating: 4.5,
    reviews: 19,
    allergens: ['Gluten-Free', 'Dairy-Free']
  }
]

const categories = ['All', 'Main Dishes', 'Grilled Items', 'Sides & Snacks', 'Desserts']

export default function MenuPage() {
  const { loading, isAuthenticated, isVendor, hasRestaurant } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState('All')

  if (loading) {
    return <LoadingPage message="Loading menu..." />
  }

  if (!isAuthenticated || !isVendor || !hasRestaurant) {
    return null // Will be handled by dashboard layout
  }

  const filteredDishes = selectedCategory === 'All' 
    ? mockDishes 
    : mockDishes.filter(dish => dish.category === selectedCategory)

  const toggleAvailability = (dishId: string) => {
    console.log(`Toggling availability for dish ${dishId}`)
  }

  const editDish = (dishId: string) => {
    console.log(`Editing dish ${dishId}`)
  }

  const deleteDish = (dishId: string) => {
    console.log(`Deleting dish ${dishId}`)
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 md:px-6 py-4 md:py-8">
        {/* Header - Tablet Optimized */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Menu Management
              </h2>
              <p className="text-base md:text-lg text-gray-600">
                {mockDishes.length} dishes • {mockDishes.filter(d => d.available).length} available
              </p>
            </div>
            <Button 
              onClick={() => console.log('Add dish modal would open')}
              className="bg-[#F15029] hover:bg-[#D13D1A] text-white font-semibold text-base md:text-lg px-6 md:px-8 py-3 md:py-4 h-12 md:h-16 rounded-lg flex items-center gap-3 transition-colors"
            >
              <PlusCircle className="w-5 h-5 md:w-6 md:h-6" />
              <span>Add New Dish</span>
            </Button>
          </div>
        </div>

        {/* Category Tabs - Touch Friendly */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex flex-wrap gap-2 md:gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className={`
                  px-4 md:px-6 py-2 md:py-3 h-10 md:h-12 text-sm md:text-base font-medium rounded-lg transition-all
                  ${selectedCategory === category 
                    ? 'bg-[#F15029] text-white shadow-md' 
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-[#F15029] hover:text-[#F15029]'
                  }
                `}
              >
                {category}
                {category !== 'All' && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {mockDishes.filter(d => d.category === category).length}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Menu Items Grid - Tablet Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {filteredDishes.map((dish) => (
            <div 
              key={dish.id}
              className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-200 ${
                dish.available 
                  ? 'border-gray-100 hover:border-gray-200' 
                  : 'border-red-100 bg-gray-50'
              }`}
            >
              {/* Dish Image */}
              <div className="relative">
                <div className="w-full h-48 md:h-56 bg-gradient-to-br from-[#F15029] to-[#FFBF00] rounded-t-xl flex items-center justify-center">
                  <span className="text-6xl md:text-7xl">🍲</span>
                </div>
                <div className="absolute top-3 right-3 flex gap-2">
                  <Badge 
                    className={`${dish.available ? 'bg-green-500' : 'bg-red-500'} text-white text-xs md:text-sm px-2 py-1`}
                  >
                    {dish.available ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
                <div className="absolute bottom-3 left-3">
                  <Badge variant="outline" className="bg-white/90 text-xs md:text-sm px-2 py-1">
                    <Clock className="w-3 h-3 mr-1" />
                    {dish.prepTime}
                  </Badge>
                </div>
              </div>

              {/* Dish Info */}
              <div className="p-4 md:p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 line-clamp-1">
                      {dish.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm md:text-base font-medium text-gray-700">
                          {dish.rating}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">({dish.reviews} reviews)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[#F15029]">
                    <DollarSign className="w-5 h-5 md:w-6 md:h-6" />
                    <span className="text-xl md:text-2xl font-bold">
                      {dish.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                <p className="text-sm md:text-base text-gray-600 mb-4 line-clamp-2">
                  {dish.description}
                </p>

                {/* Allergens */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {dish.allergens.map((allergen, index) => (
                    <Badge 
                      key={index}
                      variant="outline" 
                      className="text-xs px-2 py-1 bg-gray-50 text-gray-600"
                    >
                      {allergen}
                    </Badge>
                  ))}
                </div>

                {/* Action Buttons - Large Touch Targets */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => toggleAvailability(dish.id)}
                    className={`
                      h-12 md:h-14 font-medium text-sm md:text-base rounded-lg transition-colors flex items-center justify-center gap-2
                      ${dish.available 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-green-500 hover:bg-green-600 text-white'
                      }
                    `}
                  >
                    {dish.available ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {dish.available ? 'Disable' : 'Enable'}
                  </Button>
                  
                  <Button
                    onClick={() => editDish(dish.id)}
                    className="h-12 md:h-14 bg-[#4C8BF5] hover:bg-[#2563EB] text-white font-medium text-sm md:text-base rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </Button>
                </div>

                {/* Delete Button - Separate for Safety */}
                <Button
                  onClick={() => deleteDish(dish.id)}
                  variant="outline"
                  className="w-full mt-3 h-10 md:h-12 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-medium text-sm md:text-base rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Dish
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDishes.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
            <div className="flex justify-center items-center py-8">
              <div className="text-center">
                <div className="text-6xl md:text-8xl mb-6">🍲</div>
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
                  {selectedCategory === 'All' ? 'No Menu Items Yet' : `No ${selectedCategory} Found`}
                </h3>
                <p className="text-base md:text-lg text-gray-600 max-w-md mx-auto mb-6">
                  {selectedCategory === 'All' 
                    ? 'Start adding your authentic African dishes to your menu. Include photos and detailed descriptions to attract customers.'
                    : `No dishes found in the ${selectedCategory} category. Try selecting a different category or add new dishes.`
                  }
                </p>
                <Button 
                  onClick={() => console.log('Add dish modal would open')}
                  className="bg-[#F15029] hover:bg-[#D13D1A] text-white font-semibold text-base md:text-lg px-6 md:px-8 py-3 md:py-4 h-12 md:h-16 rounded-lg flex items-center gap-3 transition-colors"
                >
                  <PlusCircle className="w-5 h-5 md:w-6 md:h-6" />
                  <span>Add Your First Dish</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
