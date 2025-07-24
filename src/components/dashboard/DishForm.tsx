'use client'

// ⚠️ DO NOT MODIFY AUTHENTICATION SETUP WITHOUT CODE OWNER APPROVAL
// This component uses createClientComponentClient for proper auth handling
// DO NOT change to createBrowserClient or other client creation methods

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { AlertCircle, Upload, X, Search, CheckCircle, Sparkles, Plus } from 'lucide-react'
import Image from 'next/image'
import { Database } from '@/types/supabase'

type Dish = Database['public']['Tables']['dishes']['Row']

interface SearchResult {
  id: string
  name: string
  description: string
  prep_time: number
  cook_time: number
  servings: number
  difficulty: string
  cuisine_region: string
  course_type: string
  dietary_info: string[]
  ingredients: string[]
  instructions: string[]
  cultural_significance: string
}


type DishFormProps = {
  restaurantId: string
  onSuccess?: () => void
  dish?: Dish | null
  mode?: 'create' | 'edit'
}

export default function DishForm({ restaurantId, onSuccess, dish }: DishFormProps) {
  const supabase = createClientComponentClient()
  
  // Success message state
  const [successMessage, setSuccessMessage] = useState<{title: string; description: string} | null>(null)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [selectedHoppnDish, setSelectedHoppnDish] = useState<SearchResult | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [workflowMode, setWorkflowMode] = useState<'search' | 'customize' | 'create'>('search') // Track current workflow
  const [isGeneratingWithAI, setIsGeneratingWithAI] = useState(false)
  
  // African ingredient tags with emojis
  const africanIngredients = [
    '🌶️ Scotch Bonnet Peppers',
    '🧄 Garlic',
    '🧅 Onions',
    '🍅 Tomatoes',
    '🥥 Coconut',
    '🌿 Cilantro',
    '🫚 Ginger',
    '🌾 Cassava',
    '🍠 Yams',
    '🌽 Plantains',
    '🥜 Groundnuts (Peanuts)',
    '🌿 Palm Oil',
    '🌾 Rice',
    '🫘 Black-eyed Peas',
    '🌿 Okra'
  ]
  
  // African countries with flag emojis
  const africanCountries = [
    { name: 'Nigeria', flag: '🇳🇬' },
    { name: 'Ghana', flag: '🇬🇭' },
    { name: 'Kenya', flag: '🇰🇪' },
    { name: 'Ethiopia', flag: '🇪🇹' },
    { name: 'South Africa', flag: '🇿🇦' },
    { name: 'Morocco', flag: '🇲🇦' },
    { name: 'Egypt', flag: '🇪🇬' },
    { name: 'Senegal', flag: '🇸🇳' },
    { name: 'Tanzania', flag: '🇹🇿' },
    { name: 'Uganda', flag: '🇺🇬' },
    { name: 'Cameroon', flag: '🇨🇲' },
    { name: 'Mali', flag: '🇲🇱' },
    { name: 'Burkina Faso', flag: '🇧🇫' },
    { name: 'Ivory Coast', flag: '🇨🇮' },
    { name: 'Zimbabwe', flag: '🇿🇼' }
  ]
  
  const [formData, setFormData] = useState({
    name: dish?.name || '',
    description: dish?.description || '',
    category: dish?.category || '',
    price: dish?.price?.toString() || '',
    size_options: Array.isArray(dish?.size_options) ? dish.size_options.join(', ') : (dish?.size_options || ''),
    custom_ingredients: dish?.custom_ingredients || '',
    base_spice_level: 1,
    country_origin: dish?.country_origin || '',
    country_flag: dish?.country_flag || '',
    origin_story: '',
    base_ingredients: '',
    is_vegetarian: false,
    is_vegan: false,
    is_halal: false,
    calories: '',
    preparation_method: '',
    cultural_significance: '',
    health_benefits: '',
    native_regions: '',
    taste_profile: '',
    is_active: dish?.is_active ?? true,
    restaurant_notes: dish?.restaurant_notes || '',
    chef_special: dish?.chef_special || false
  })
  
  // Search for existing dishes
  const searchDishes = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(`/api/hoppn-dishes/search?q=${encodeURIComponent(query)}`)
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.dishes || [])
      }
    } catch (error) {
      console.error('Error searching dishes:', error)
    } finally {
      setIsSearching(false)
    }
  }

  // Handle dish name input change
  const handleDishNameChange = (value: string) => {
    setFormData(prev => ({ ...prev, name: value }))
    if (workflowMode === 'search') {
      searchDishes(value)
    }
  }

  // Select existing dish from search results (Path 1)
  const selectExistingDish = (dish: SearchResult) => {
    setSelectedHoppnDish(dish)
    setFormData(prev => ({
      ...prev,
      name: dish.name,
      description: dish.description,
      category: dish.category,
      base_spice_level: dish.base_spice_level,
      country_origin: dish.country_origin,
      country_flag: dish.country_flag,
      origin_story: dish.origin_story || '',
      base_ingredients: dish.base_ingredients || '',
      cultural_significance: dish.cultural_significance || '',
      is_vegetarian: dish.is_vegetarian || false,
      is_vegan: dish.is_vegan || false,
      is_halal: dish.is_halal || false,
      // Reset customization fields
      price: '',
      size_options: '',
      custom_ingredients: '',
      restaurant_notes: ''
    }))
    setSearchResults([])
    setWorkflowMode('customize') // Switch to customization mode
  }

  // Start creating new dish (Path 2)
  const startNewDish = () => {
    setSelectedHoppnDish(null)
    setSearchResults([])
    setWorkflowMode('create')
    // Reset form for new dish creation
    setFormData({
      name: '',
      description: '',
      category: '',
      price: '',
      size_options: '',
      custom_ingredients: '',
      base_spice_level: 1,
      country_origin: '',
      country_flag: '',
      origin_story: '',
      base_ingredients: '',
      is_vegetarian: false,
      is_vegan: false,
      is_halal: false,
      calories: '',
      preparation_method: '',
      cultural_significance: '',
      health_benefits: '',
      native_regions: '',
      taste_profile: '',
      is_active: true,
      restaurant_notes: '',
      chef_special: false
    })
  }

  // Generate dish with AI
  const generateDishWithAI = async () => {
    if (!formData.name || formData.name.trim().length < 2) {
      setError('Please enter a dish name before generating with AI')
      return
    }
    
    setIsGeneratingWithAI(true)
    setError('')
    
    try {
      // Call our Gemini AI generation API with enhanced context
      const response = await fetch('/api/dishes/generate-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dishName: formData.name,
          country: formData.country_origin || '',
          category: formData.category || '',
          restaurantId
        })
      })
      
      if (response.ok) {
        const aiGeneratedDish = await response.json()
        
        // Update form data with AI-generated content
        setFormData(prev => ({
          ...prev,
          ...aiGeneratedDish.dish
        }))
        
        // If there are ingredients in the AI response, parse and select them
        if (aiGeneratedDish.dish.base_ingredients) {
          const ingredients = aiGeneratedDish.dish.base_ingredients
            .split(',')
            .map((ing: string) => ing.trim())
            .filter((ing: string) => ing)
          
          // Find matching ingredients from our predefined list
          const matchedIngredients = africanIngredients.filter(ingredient => {
            // Remove emoji prefix for comparison
            const ingredientName = ingredient.replace(/^[^ ]+ /, '').toLowerCase()
            return ingredients.some((ai: string) => ingredientName.includes(ai.toLowerCase()) || ai.toLowerCase().includes(ingredientName))
          })
          
          if (matchedIngredients.length > 0) {
            setSelectedIngredients(matchedIngredients)
          }
        }
        
        // Switch to create mode with the AI-generated dish
        setWorkflowMode('create')
        
        // Show success message
        setSuccessMessage({
          title: 'AI Generation Complete',
          description: 'Dish details have been generated. Review and customize before submitting.'
        })
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate dish with AI')
      }
    } catch (error: unknown) {
      setError(`Failed to generate dish with AI: ${error instanceof Error ? error.message : 'Please try again'}`)
    } finally {
      setIsGeneratingWithAI(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // Handle country selection with flag emoji
    if (name === 'country_origin') {
      const selectedCountry = africanCountries.find(country => country.name === value)
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        country_flag: selectedCountry ? selectedCountry.flag : ''
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: checked }))
  }
  
  const toggleIngredient = (ingredient: string) => {
    setSelectedIngredients(prev => {
      const updated = prev.includes(ingredient)
        ? prev.filter(item => item !== ingredient)
        : [...prev, ingredient]
      
      // Update custom_ingredients field for restaurant customization
      setFormData(prevForm => ({
        ...prevForm,
        custom_ingredients: updated.join(', ')
      }))
      
      return updated
    })
  }
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB')
      return
    }
    
    // Check file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Only JPEG, PNG, and WebP images are allowed')
      return
    }
    
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setError(null)
  }
  
  const removeImage = () => {
    setImageFile(null)
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
      setImagePreview(null)
    }
  }

  const resetToSearch = () => {
    setWorkflowMode('search')
    setSelectedHoppnDish(null)
    setFormData(prev => ({ ...prev, name: '' }))
    setSearchResults([])
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      // Validate required fields
      if (!formData.name || !formData.description || !formData.category || !formData.price) {
        throw new Error('Please fill in all required fields')
      }
      
      // Upload image if provided
      let imageUrl = null
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const filePath = `dishes/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('dish-images')
          .upload(filePath, imageFile)
          
        if (uploadError) {
          throw new Error(`Error uploading image: ${uploadError.message}`)
        }
        
        imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/dish-images/${filePath}`
      }
      
      if (selectedHoppnDish && workflowMode === 'customize') {
        // Path 1: Using existing dish - save directly to dishes table with customizations
        const { error: insertError } = await supabase
          .from('dishes')
          .insert({
            restaurant_id: restaurantId,
            hoppn_dish_id: selectedHoppnDish.id, // Link to the master dish
            name: formData.name,
            description: formData.description,
            image_url: imageUrl,
            price: parseFloat(formData.price),
            size_options: formData.size_options ? formData.size_options.split(',').map(s => s.trim()) : null,
            custom_ingredients: formData.custom_ingredients || null,
            restaurant_notes: formData.restaurant_notes || null,
            chef_special: formData.chef_special,
            category: formData.category,
            country_origin: selectedHoppnDish.country_origin,
            country_flag: selectedHoppnDish.country_flag,
            is_active: formData.is_active
          })
          
        if (insertError) {
          throw new Error(`Error creating dish: ${insertError.message}`)
        }

        setSuccessMessage({
          title: 'Dish added successfully',
          description: 'Your customized dish has been added to your menu and is now available for orders.'
        })
      } else if (workflowMode === 'create') {
        // Path 2: Creating new dish - submit to hoppn_dishes for approval first
        const baseIngredients = selectedIngredients.length > 0 
          ? selectedIngredients.map(ing => ing.replace(/^[^ ]+ /, '')) // Remove emoji prefix
          : formData.base_ingredients.split(',').map(ing => ing.trim()).filter(ing => ing)
        
        const nativeRegions = formData.native_regions
          ? formData.native_regions.split(',').map(region => region.trim())
          : []
        
        // Submit to hoppn_dishes for approval
        const hoppnDishResponse = await fetch('/api/hoppn-dishes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            category: formData.category,
            country_origin: formData.country_origin,
            country_flag: formData.country_flag,
            base_spice_level: formData.base_spice_level,
            origin_story: formData.origin_story,
            base_ingredients: baseIngredients,
            cultural_significance: formData.cultural_significance,
            is_vegetarian: formData.is_vegetarian,
            is_vegan: formData.is_vegan,
            is_halal: formData.is_halal,
            calories: formData.calories ? parseInt(formData.calories) : null,
            preparation_method: formData.preparation_method,
            health_benefits: formData.health_benefits,
            native_regions: nativeRegions,
            taste_profile: formData.taste_profile,
            submitted_by_restaurant_id: restaurantId // Track who submitted it
          })
        })
        
        if (!hoppnDishResponse.ok) {
          const errorData = await hoppnDishResponse.json()
          throw new Error(`Error submitting dish for approval: ${errorData.error || 'Unknown error'}`)
        }
        
        const hoppnDishData = await hoppnDishResponse.json()
        
        // Create restaurant's dish with pending status
        const { error: insertError } = await supabase
          .from('dishes')
          .insert({
            restaurant_id: restaurantId,
            hoppn_dish_id: hoppnDishData.dish.id, // Link to the newly created hoppn dish
            name: formData.name,
            description: formData.description,
            image_url: imageUrl,
            price: parseFloat(formData.price),
            size_options: formData.size_options ? formData.size_options.split(',').map(s => s.trim()) : null,
            custom_ingredients: formData.custom_ingredients || null,
            restaurant_notes: formData.restaurant_notes || null,
            chef_special: formData.chef_special,
            category: formData.category,
            country_origin: formData.country_origin,
            country_flag: formData.country_flag,
            is_active: false, // Set to inactive until the hoppn dish is approved
            status: 'pending_approval'
          })
          
        if (insertError) {
          throw new Error(`Error creating dish: ${insertError.message}`)
        }

        setSuccessMessage({
          title: 'Dish submitted for approval',
          description: 'Your new dish has been submitted for approval. It will be available on your menu once approved by Hoppn.'
        })
      }
      
      // Reset form and state
      setFormData({
        name: '',
        description: '',
        category: '',
        price: '',
        size_options: '',
        custom_ingredients: '',
        base_spice_level: 1,
        country_origin: '',
        country_flag: '',
        origin_story: '',
        base_ingredients: '',
        is_vegetarian: false,
        is_vegan: false,
        is_halal: false,
        calories: '',
        preparation_method: '',
        cultural_significance: '',
        health_benefits: '',
        native_regions: '',
        taste_profile: '',
        is_active: true,
        restaurant_notes: '',
        chef_special: false
      })
      setSelectedIngredients([])
      setSelectedHoppnDish(null)
      setSearchResults([])
      setWorkflowMode('search')
      removeImage()
      
      // Call success callback
      if (onSuccess) {
        onSuccess()
      }
      
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save dish')
    } finally {
      setLoading(false)
    }
  }
  
  // Common African dish categories
  const dishCategories = [
    'Appetizers', 'Main Dishes', 'Soups & Stews', 'Rice Dishes', 'Grilled', 
    'Breakfast', 'Street Food', 'Desserts', 'Beverages', 'Sides', 
    'Vegetarian', 'Seafood', 'Meat', 'Poultry', 'Special Occasion'
  ]
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="text-red-500 mr-2 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}
      
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
          <CheckCircle className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-green-800 font-medium">{successMessage.title}</p>
            <p className="text-green-600">{successMessage.description}</p>
          </div>
        </div>
      )}

      {/* Workflow Navigation */}
      {workflowMode !== 'search' && (
        <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {workflowMode === 'customize' && selectedHoppnDish && (
                <>
                  <span className="text-sm font-medium text-slate-600">Customizing:</span>
                  <span className="text-sm font-semibold text-slate-800">{selectedHoppnDish.name}</span>
                  <span className="text-xs">{selectedHoppnDish.country_flag}</span>
                </>
              )}
              {workflowMode === 'create' && (
                <span className="text-sm font-medium text-slate-600">Creating new dish</span>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={resetToSearch}
              className="text-slate-600 hover:text-slate-800"
            >
              ← Back to search
            </Button>
          </div>
        </div>
      )}

      {/* Initial Search Interface */}
      {workflowMode === 'search' && (
        <div className="mb-6 p-6 bg-white rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Add a Dish to Your Menu
          </h3>
          
          <div className="mb-6">
            <label htmlFor="dishSearch" className="block text-sm font-semibold text-slate-700 mb-2">
              Search existing dishes
            </label>
            <div className="relative">
              <input
                id="dishSearch"
                type="text"
                placeholder="Start typing to search for dishes..."
                value={formData.name}
                onChange={(e) => handleDishNameChange(e.target.value)}
                className="w-full px-4 py-3 pl-10 border-2 border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-[#F15029] focus:ring-opacity-50 focus:border-[#F15029] transition-colors shadow-sm"
              />
              <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
            </div>
            
            {isSearching && (
              <p className="text-sm text-slate-500 mt-2">Searching...</p>
            )}
            
            {searchResults.length > 0 && (
              <div className="mt-3 border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                  <p className="text-sm font-medium text-slate-700">Select an existing dish to customize</p>
                </div>
                <ul className="max-h-60 overflow-y-auto">
                  {searchResults.map((dish) => (
                    <li 
                      key={dish.id} 
                      className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => selectExistingDish(dish)}
                    >
                      <div className="p-3">
                        <div className="flex items-center">
                          <span className="mr-2">{dish.country_flag || '🍽️'}</span>
                          <div>
                            <p className="font-medium text-slate-800">{dish.name}</p>
                            <p className="text-sm text-slate-500 truncate">{dish.description}</p>
                            <p className="text-xs text-slate-400">{dish.category} • {dish.country_origin}</p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Create New Dish Options */}
          <div className="border-t border-slate-200 pt-6">
            <p className="text-sm font-medium text-slate-700 mb-4">Or create a new dish:</p>
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="hoppn"
                onClick={generateDishWithAI}
                disabled={isGeneratingWithAI}
                className="flex items-center space-x-2"
              >
                <Sparkles size={16} />
                <span>{isGeneratingWithAI ? 'Generating...' : 'Generate with AI'}</span>
              </Button>
              <Button
                type="button"
                variant="hoppnOutline"
                onClick={startNewDish}
                className="flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Create manually</span>
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Dish Form */}
      {(workflowMode === 'customize' || workflowMode === 'create') && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {workflowMode === 'customize' ? 'Customize Dish' : 'Dish Information'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                  Dish Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter the dish name"
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-[#F15029] focus:ring-opacity-50 focus:border-[#F15029] transition-colors shadow-sm"
                  required
                  disabled={workflowMode === 'customize'} // Disable for existing dishes
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-slate-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg bg-white text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#F15029] focus:ring-opacity-50 focus:border-[#F15029] transition-colors shadow-sm"
                  disabled={workflowMode === 'customize'} // Disable for existing dishes
                >
                  <option value="">Select Category</option>
                  {dishCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-500 font-medium resize-vertical focus:outline-none focus:ring-2 focus:ring-[#F15029] focus:ring-opacity-50 focus:border-[#F15029] transition-colors shadow-sm"
                placeholder="Describe the dish"
                disabled={workflowMode === 'customize'} // Disable for existing dishes
              />
            </div>
          </div>

          {/* Restaurant Customization Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Restaurant Customization
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-semibold text-slate-700 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-[#F15029] focus:ring-opacity-50 focus:border-[#F15029] transition-colors shadow-sm"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label htmlFor="size_options" className="block text-sm font-semibold text-slate-700 mb-2">
                  Size Options
                </label>
                <input
                  type="text"
                  id="size_options"
                  name="size_options"
                  value={formData.size_options}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-[#F15029] focus:ring-opacity-50 focus:border-[#F15029] transition-colors shadow-sm"
                  placeholder="Small, Medium, Large (comma separated)"
                />
              </div>
            </div>

            <div>
              <label htmlFor="custom_ingredients" className="block text-sm font-semibold text-slate-700 mb-2">
                Your Custom Ingredients
              </label>
              <textarea
                id="custom_ingredients"
                name="custom_ingredients"
                value={formData.custom_ingredients}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-500 font-medium resize-vertical focus:outline-none focus:ring-2 focus:ring-[#F15029] focus:ring-opacity-50 focus:border-[#F15029] transition-colors shadow-sm"
                placeholder="Add your restaurant's special ingredients or modifications..."
              />
            </div>

            <div>
              <label htmlFor="restaurant_notes" className="block text-sm font-semibold text-slate-700 mb-2">
Chef&apos;s Notes
              </label>
              <textarea
                id="restaurant_notes"
                name="restaurant_notes"
                value={formData.restaurant_notes}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-500 font-medium resize-vertical focus:outline-none focus:ring-2 focus:ring-[#F15029] focus:ring-opacity-50 focus:border-[#F15029] transition-colors shadow-sm"
                placeholder="Special preparation notes or chef's recommendations..."
              />
            </div>

            <div className="flex items-center space-x-6">
              <label className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  name="chef_special"
                  checked={formData.chef_special}
                  onChange={handleCheckboxChange}
                  className="rounded border-slate-300 text-[#F15029] focus:ring-[#F15029] focus:ring-opacity-50 w-4 h-4"
                />
                <span className="ml-3 text-sm font-medium text-slate-700">⭐ Chef&apos;s Special</span>
              </label>

              <label className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleCheckboxChange}
                  className="rounded border-slate-300 text-[#F15029] focus:ring-[#F15029] focus:ring-opacity-50 w-4 h-4"
                />
                <span className="ml-3 text-sm font-medium text-slate-700">Available for Order</span>
              </label>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Dish Image
            </h3>
            
            {!imagePreview ? (
              <div className="mt-2 flex justify-center px-8 pt-8 pb-8 border-2 border-slate-300 border-dashed rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="space-y-3 text-center">
                  <Upload className="mx-auto h-16 w-16 text-slate-400" />
                  <div className="flex text-base text-slate-600">
                    <label
                      htmlFor="image-upload"
                      className="relative cursor-pointer bg-white rounded-lg px-4 py-2 font-semibold text-[#F15029] hover:text-[#E04420] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#F15029] focus-within:ring-opacity-50 shadow-sm border border-slate-200"
                    >
                      <span>Upload a file</span>
                      <input
                        id="image-upload"
                        name="image-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-2 self-center font-medium">or drag and drop</p>
                  </div>
                  <p className="text-sm text-slate-500 font-medium">PNG, JPG, WebP up to 5MB</p>
                </div>
              </div>
            ) : (
              <div className="relative">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={200}
                  height={150}
                  className="rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Cultural Context - Only show for new dish creation */}
          {workflowMode === 'create' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Cultural Context
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="country_origin" className="block text-sm font-semibold text-slate-700 mb-2">
                    Country of Origin
                  </label>
                  <select
                    id="country_origin"
                    name="country_origin"
                    value={formData.country_origin}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg bg-white text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#F15029] focus:ring-opacity-50 focus:border-[#F15029] transition-colors shadow-sm"
                  >
                    <option value="">Select Country</option>
                    {africanCountries.map(country => (
                      <option key={country.name} value={country.name}>
                        {country.flag} {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="calories" className="block text-sm font-semibold text-slate-700 mb-2">
                    Calories
                  </label>
                  <input
                    type="number"
                    id="calories"
                    name="calories"
                    value={formData.calories}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-[#F15029] focus:ring-opacity-50 focus:border-[#F15029] transition-colors shadow-sm"
                    placeholder="Approximate calories"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="origin_story" className="block text-sm font-semibold text-slate-700 mb-2">
                  Origin Story
                </label>
                <textarea
                  id="origin_story"
                  name="origin_story"
                  value={formData.origin_story}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Tell the story behind this dish..."
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-500 font-medium resize-vertical focus:outline-none focus:ring-2 focus:ring-[#F15029] focus:ring-opacity-50 focus:border-[#F15029] transition-colors shadow-sm"
                />
              </div>
              
              <div>
                <label htmlFor="cultural_significance" className="block text-sm font-semibold text-slate-700 mb-2">
                  Cultural Significance
                </label>
                <textarea
                  id="cultural_significance"
                  name="cultural_significance"
                  value={formData.cultural_significance}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="What makes this dish culturally significant?"
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-500 font-medium resize-vertical focus:outline-none focus:ring-2 focus:ring-[#F15029] focus:ring-opacity-50 focus:border-[#F15029] transition-colors shadow-sm"
                />
              </div>
              
              <div>
                <label htmlFor="native_regions" className="block text-sm font-semibold text-slate-700 mb-2">
                  Native Regions
                </label>
                <input
                  type="text"
                  id="native_regions"
                  name="native_regions"
                  value={formData.native_regions}
                  onChange={handleInputChange}
                  placeholder="West Africa, Lagos, Yorubaland (comma separated)"
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-[#F15029] focus:ring-opacity-50 focus:border-[#F15029] transition-colors shadow-sm"
                />
              </div>

              {/* Ingredients & Preparation */}
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900">Ingredients & Preparation</h4>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Select Base Ingredients
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {africanIngredients.map(ingredient => (
                      <button
                        key={ingredient}
                        type="button"
                        onClick={() => toggleIngredient(ingredient)}
                        className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                          selectedIngredients.includes(ingredient)
                            ? 'bg-[#F15029] text-white border-[#F15029] shadow-md'
                            : 'bg-white text-slate-700 border-slate-300 hover:border-[#F15029] hover:bg-orange-50'
                        }`}
                      >
                        {ingredient}
                      </button>
                    ))}
                  </div>
                  {selectedIngredients.length > 0 && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm font-medium text-slate-700 mb-2">Selected Ingredients:</p>
                      <p className="text-sm text-slate-600">{selectedIngredients.join(', ')}</p>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="base_spice_level" className="block text-sm font-semibold text-slate-700 mb-2">
                      Spice Level (1-5)
                    </label>
                    <select
                      id="base_spice_level"
                      name="base_spice_level"
                      value={formData.base_spice_level}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg bg-white text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#F15029] focus:ring-opacity-50 focus:border-[#F15029] transition-colors shadow-sm"
                    >
                      <option value={1}>1 - Mild</option>
                      <option value={2}>2 - Medium</option>
                      <option value={3}>3 - Medium Hot</option>
                      <option value={4}>4 - Hot</option>
                      <option value={5}>5 - Very Hot</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="taste_profile" className="block text-sm font-semibold text-slate-700 mb-2">
                      Taste Profile
                    </label>
                    <input
                      type="text"
                      id="taste_profile"
                      name="taste_profile"
                      value={formData.taste_profile}
                      onChange={handleInputChange}
                      placeholder="Savory, spicy, aromatic"
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-[#F15029] focus:ring-opacity-50 focus:border-[#F15029] transition-colors shadow-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="preparation_method" className="block text-sm font-semibold text-slate-700 mb-2">
                    Preparation Method
                  </label>
                  <textarea
                    id="preparation_method"
                    name="preparation_method"
                    value={formData.preparation_method}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="How is this dish traditionally prepared?"
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-500 font-medium resize-vertical focus:outline-none focus:ring-2 focus:ring-[#F15029] focus:ring-opacity-50 focus:border-[#F15029] transition-colors shadow-sm"
                  />
                </div>
              </div>

              {/* Dietary & Health */}
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900">Dietary & Health Information</h4>
                
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_vegetarian"
                      checked={formData.is_vegetarian}
                      onChange={handleCheckboxChange}
                      className="rounded border-slate-300 text-[#F15029] focus:ring-[#F15029] focus:ring-opacity-50 w-4 h-4"
                    />
                    <span className="ml-3 text-sm font-medium text-slate-700">🥬 Vegetarian</span>
                  </label>
                  
                  <label className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_vegan"
                      checked={formData.is_vegan}
                      onChange={handleCheckboxChange}
                      className="rounded border-slate-300 text-[#F15029] focus:ring-[#F15029] focus:ring-opacity-50 w-4 h-4"
                    />
                    <span className="ml-3 text-sm font-medium text-slate-700">🌱 Vegan</span>
                  </label>
                  
                  <label className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_halal"
                      checked={formData.is_halal}
                      onChange={handleCheckboxChange}
                      className="rounded border-slate-300 text-[#F15029] focus:ring-[#F15029] focus:ring-opacity-50 w-4 h-4"
                    />
                    <span className="ml-3 text-sm font-medium text-slate-700">🕌 Halal</span>
                  </label>
                </div>
                
                <div>
                  <label htmlFor="health_benefits" className="block text-sm font-semibold text-slate-700 mb-2">
                    Health Benefits
                  </label>
                  <textarea
                    id="health_benefits"
                    name="health_benefits"
                    value={formData.health_benefits}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="What health benefits does this dish provide?"
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-500 font-medium resize-vertical focus:outline-none focus:ring-2 focus:ring-[#F15029] focus:ring-opacity-50 focus:border-[#F15029] transition-colors shadow-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
            <Button
              type="button"
              variant="hoppnOutline"
              onClick={resetToSearch}
              disabled={loading}
              className="px-6 py-3 font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="hoppn"
              disabled={loading}
              className="px-8 py-3 font-semibold"
            >
              {loading ? (
                workflowMode === 'customize' ? 'Adding to Menu...' : 'Submitting for Approval...'
              ) : (
                workflowMode === 'customize' ? 'Add to Menu' : 'Submit for Approval'
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}