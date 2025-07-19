'use client'

import React, { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useDishes } from '@/hooks/useDishes'
import { LoadingPage } from '@/components/ui/loading'
import { PageTransition } from '@/components/ui/PageTransition'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import DishModal from '@/components/dashboard/DishModal'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PlusCircle, Edit3, Eye, EyeOff, DollarSign, Star, Trash2 } from 'lucide-react'
import { Database } from '@/types/supabase'

type Dish = Database['public']['Tables']['dishes']['Row']

const categories = ['All', 'stews_soups', 'meats_seafood', 'rice_beans', 'breakfast', 'vegetarian_vegan', 'snacks_street_foods', 'salads_extras', 'beverages', 'desserts', 'spices_seasonings']

const getCategoryDisplayName = (category: string) => {
  switch (category) {
    case 'stews_soups': return 'Stews & Soups'
    case 'meats_seafood': return 'Meats & Seafood'
    case 'rice_beans': return 'Rice & Beans'
    case 'breakfast': return 'Breakfast'
    case 'vegetarian_vegan': return 'Vegetarian & Vegan'
    case 'snacks_street_foods': return 'Snacks & Street Foods'
    case 'salads_extras': return 'Salads & Extras'
    case 'beverages': return 'Beverages'
    case 'desserts': return 'Desserts'
    case 'spices_seasonings': return 'Spices & Seasonings'
    default: return category
  }
}


function MenuPage() {
  const { loading: authLoading, isAuthenticated, isVendor, hasRestaurant, user } = useAuth()
  const { dishes, loading: dishesLoading, error, toggleDishAvailability, deleteDish } = useDishes()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingDish, setEditingDish] = useState<Dish | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [updatingDishes, setUpdatingDishes] = useState<Set<string>>(new Set())

  const filteredDishes = selectedCategory === 'All' 
    ? dishes 
    : dishes.filter(dish => dish.category === selectedCategory)

  const handleToggleAvailability = async (dish: Dish) => {
    setUpdatingDishes(prev => new Set(prev).add(dish.id))
    try {
      await toggleDishAvailability(dish.id, !dish.is_active)
    } catch (error) {
      console.error('Failed to toggle dish availability:', error)
    } finally {
      setUpdatingDishes(prev => {
        const newSet = new Set(prev)
        newSet.delete(dish.id)
        return newSet
      })
    }
  }

  const handleEditDish = (dish: Dish) => {
    setEditingDish(dish)
    setModalMode('edit')
    setModalOpen(true)
  }

  const handleDeleteDish = async (dish: Dish) => {
    if (confirm(`Are you sure you want to delete "${dish.name}"? This action cannot be undone.`)) {
      try {
        await deleteDish(dish.id)
      } catch (error) {
        console.error('Failed to delete dish:', error)
      }
    }
  }

  const handleAddDish = () => {
    setEditingDish(null)
    setModalMode('create')
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setEditingDish(null)
  }

  if (authLoading) {
    return <LoadingPage message="Loading menu..." />
  }

  if (!isAuthenticated || !isVendor || !hasRestaurant) {
    return null // Will be handled by dashboard layout
  }

  return (
    <DashboardLayout>
      <PageTransition 
        isLoading={dishesLoading}
        error={error}
        loadingMessage="Loading menu..."
        errorTitle="Error Loading Menu"
        onRetry={() => window.location.reload()}
      >
        <div className="container mx-auto px-4 md:px-6 py-4 md:py-8" style={{ backgroundColor: 'var(--color-earth-beige)' }}>
        {/* Header - Tablet Optimized */}
        <div className="rounded-xl shadow-sm p-4 md:p-6 mb-4 md:mb-6" style={{ backgroundColor: 'var(--color-warm-cream)' }}>
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: 'Montserrat, sans-serif', color: 'var(--color-text-dark)' }}>
                Menu Management
              </h2>
              <p className="text-base md:text-lg" style={{ color: 'var(--color-text-medium)' }}>
                {dishes.length} dishes • {dishes.filter(d => d.is_active).length} available
              </p>
            </div>
            <Button 
              onClick={handleAddDish}
              className="font-semibold text-base md:text-lg px-6 md:px-8 py-3 md:py-4 h-12 md:h-16 rounded-lg flex items-center gap-3 transition-colors"
              style={{
                backgroundColor: 'var(--color-hoppn-orange)',
                color: 'var(--color-text-on-colored)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D13D1A'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-hoppn-orange)'}
            >
              <PlusCircle className="w-5 h-5 md:w-6 md:h-6" />
              <span>Add New Dish</span>
            </Button>
          </div>
        </div>

        {/* Category Tabs - Touch Friendly */}
        <div className="rounded-xl shadow-sm p-4 md:p-6 mb-4 md:mb-6" style={{ backgroundColor: 'var(--color-soft-orange)' }}>
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
                {category === 'All' ? 'All' : getCategoryDisplayName(category)}
                {category !== 'All' && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {dishes.filter(d => d.category === category).length}
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
                dish.is_active 
                  ? 'border-gray-100 hover:border-gray-200' 
                  : 'border-red-100 bg-gray-50'
              }`}
            >
              {/* Dish Image */}
              <div className="relative">
                {dish.image_url ? (
                  <img
                    src={dish.image_url}
                    alt={dish.name}
                    className="w-full h-48 md:h-56 object-cover rounded-t-xl"
                  />
                ) : (
                  <div className="w-full h-48 md:h-56 bg-gradient-to-br from-[#F15029] to-[#FFBF00] rounded-t-xl flex items-center justify-center">
                    <span className="text-6xl md:text-7xl">🍲</span>
                  </div>
                )}
                
                <div className="absolute top-3 right-3 flex gap-2">
                  <Badge 
                    className={`${dish.is_active ? 'bg-green-500' : 'bg-red-500'} text-white text-xs md:text-sm px-2 py-1`}
                  >
                    {dish.is_active ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
                {dish.chef_special && (
                  <div className="absolute bottom-3 left-3">
                    <Badge variant="outline" className="bg-white/90 text-xs md:text-sm px-2 py-1">
                      <Star className="w-3 h-3 mr-1 text-yellow-500" />
                      Chef Special
                    </Badge>
                  </div>
                )}
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
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-md font-medium text-gray-600">
                          {getCategoryDisplayName(dish.category)}
                        </span>
                      </div>
                      {dish.country_flag && (
                        <span className="text-lg">{dish.country_flag}</span>
                      )}
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

                {/* Additional info */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {dish.custom_ingredients && (
                    <Badge 
                      variant="outline" 
                      className="text-xs px-2 py-1 bg-blue-50 text-blue-600"
                    >
                      Custom Ingredients
                    </Badge>
                  )}
                  {dish.restaurant_notes && (
                    <Badge 
                      variant="outline" 
                      className="text-xs px-2 py-1 bg-purple-50 text-purple-600"
                    >
                      Chef Notes
                    </Badge>
                  )}
                </div>

                {/* Action Buttons - Large Touch Targets */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => handleToggleAvailability(dish)}
                    disabled={updatingDishes.has(dish.id)}
                    className={`
                      h-12 md:h-14 font-medium text-sm md:text-base rounded-lg transition-colors flex items-center justify-center gap-2
                      ${dish.is_active 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-green-500 hover:bg-green-600 text-white'
                      }
                    `}
                  >
                    {updatingDishes.has(dish.id) ? (
                      'Updating...'
                    ) : (
                      <>
                        {dish.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {dish.is_active ? 'Disable' : 'Enable'}
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={() => handleEditDish(dish)}
                    className="h-12 md:h-14 bg-[#4C8BF5] hover:bg-[#2563EB] text-white font-medium text-sm md:text-base rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </Button>
                </div>

                {/* Delete Button - Separate for Safety */}
                <Button
                  onClick={() => handleDeleteDish(dish)}
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
                  onClick={handleAddDish}
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
      </PageTransition>

      {/* Dish Modal */}
      <DishModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSuccess={() => {
          // The useDishes hook will automatically refetch
        }}
        restaurantId={user?.restaurant?.id || ''}
        dish={editingDish}
        mode={modalMode}
      />
    </DashboardLayout>
  )
}

export default MenuPage
