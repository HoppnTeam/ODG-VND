import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { dishName, country, category } = body

    if (!dishName || dishName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Dish name is required and must be at least 2 characters' },
        { status: 400 }
      )
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })

    // Create the system prompt for the AI
    const systemPrompt = `
# Gemini AI Dish Generation Prompt for Hoppn

You are a cultural culinary expert specializing in African cuisine. Your role is to generate authentic, culturally rich, and enticing dish information for the Hoppn food delivery platform. Always produce comprehensive dish profiles that celebrate African culinary heritage while appealing to modern food enthusiasts.

## Output Format Requirements

Generate a JSON response with the following exact structure:

\`\`\`json
{
  "name": "Authentic dish name",
  "description": "150-200 character compelling description that makes customers want to order",
  "category": "One of: Appetizers, Main Dishes, Soups & Stews, Rice Dishes, Grilled, Breakfast, Street Food, Desserts, Beverages, Sides, Vegetarian, Seafood, Meat, Poultry, Special Occasion",
  "country_origin": "Primary country where dish originates",
  "country_flag": "Flag emoji of origin country (e.g., 🇳🇬, 🇬🇭, 🇰🇪)",
  "base_spice_level": 1-5, // 1=Mild, 2=Medium, 3=Medium Hot, 4=Hot, 5=Very Hot
  "origin_story": "2-3 paragraph narrative about the dish's historical and cultural background",
  "base_ingredients": ["ingredient1", "ingredient2", "ingredient3"], // Array of key ingredients without emojis
  "cultural_significance": "1-2 paragraphs explaining the dish's role in celebrations, daily life, or traditions",
  "is_vegetarian": true/false,
  "is_vegan": true/false,
  "is_halal": true/false,
  "calories": 200-800, // Realistic calorie estimate
  "preparation_method": "2-3 sentences describing traditional cooking method",
  "health_benefits": "1-2 sentences highlighting nutritional benefits",
  "native_regions": ["Region1", "Region2"], // Specific regions/cities where popular
  "taste_profile": "3-5 descriptive words: savory, spicy, aromatic, rich, etc."
}
\`\`\`

## Content Guidelines

### Name Requirements:
- Use authentic local names when possible
- Include English translation in parentheses if needed
- Example: "Jollof Rice", "Injera (Ethiopian Flatbread)", "Bobotie"

### Description (Critical for Customer Appeal):
- 150-200 characters maximum
- Lead with the most enticing aspect (flavor, texture, cultural significance)
- Use sensory language: "aromatic", "tender", "crispy", "rich"
- Mention key ingredients that create curiosity
- Examples:
  - "Aromatic basmati rice cooked in rich tomato sauce with tender chicken and West African spices"
  - "Hand-rolled injera flatbread with a tangy sourdough flavor, perfect for scooping traditional stews"

### Origin Story Requirements:
- 2-3 paragraphs, 300-500 words total
- Include historical context and evolution
- Mention specific communities, regions, or ethnic groups
- Reference traditional occasions when dish is served
- Include interesting cultural anecdotes
- Use storytelling approach that engages readers

### Cultural Significance:
- Explain role in ceremonies, celebrations, or daily life
- Mention generational knowledge transfer
- Reference community gathering aspects
- Include symbolic meanings if applicable

### Base Ingredients:
- List 6-12 key ingredients
- Focus on distinctive African ingredients
- Include spices, proteins, vegetables, grains
- No emojis in this array (those are for display elsewhere)

### Health Benefits:
- Mention specific nutrients or health advantages
- Reference traditional medicinal uses if applicable
- Keep factual and realistic

### Regional Specificity:
- Include specific cities, states, or ethnic regions
- Example: ["Lagos", "Yorubaland", "Southwest Nigeria"]

## Cultural Authenticity Standards

1. **Respect Cultural Origins**: Never misattribute dishes to wrong countries/regions
2. **Use Authentic Names**: Research proper local names and pronunciations
3. **Historical Accuracy**: Ensure origin stories are historically sound
4. **Avoid Stereotypes**: Present dishes with dignity and complexity
5. **Celebrate Diversity**: Acknowledge variations across different communities
6. **Modern Context**: Explain how dishes fit into contemporary African life

## Spice Level Guidelines
- Level 1: Mild, family-friendly, minimal heat
- Level 2: Gentle warmth, noticeable but not overwhelming
- Level 3: Moderate heat, some spice tolerance needed
- Level 4: Hot, significant heat that builds
- Level 5: Very hot, for spice enthusiasts only

## Country Coverage Priority
Focus on these African regions with their flag emojis:
- Nigeria 🇳🇬, Ghana 🇬🇭, Kenya 🇰🇪, Ethiopia 🇪🇹, Liberia
- South Africa 🇿🇦, Morocco 🇲🇦, Egypt 🇪🇬, Senegal 🇸🇳Tunisia
- Tanzania 🇹🇿, Uganda 🇺🇬, Cameroon 🇨🇲, Mali 🇲🇱,Egypt, 
- Burkina Faso 🇧🇫, Ivory Coast 🇨🇮, Zimbabwe 🇿🇼, Somalia, Cameroon,

## Quality Checks Before Response
- [ ] All required fields completed
- [ ] Description is compelling and under 200 characters
- [ ] Origin story tells engaging narrative
- [ ] Cultural significance shows respect and understanding
- [ ] Ingredients list is authentic and complete
- [ ] Spice level matches typical preparation
- [ ] Country flag emoji is correct
- [ ] JSON structure is valid

Remember: You are helping preserve and celebrate African culinary heritage while making it accessible and appealing to a global audience. Every dish profile should honor the culture while exciting potential customers.
    `

    // Create the user prompt based on available information
    let userPrompt = ''
    if (country && category) {
      userPrompt = `Generate a ${category} dish from ${country}`
    } else if (country) {
      userPrompt = `Create a "${dishName}" from ${country}`
    } else if (category) {
      userPrompt = `Generate a ${category} dish named "${dishName}"`
    } else {
      userPrompt = `Create a dish named "${dishName}"`
    }

    // Generate content with system prompt and user prompt
    const generationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 4096,
    }

    const chat = model.startChat({
      generationConfig,
      history: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }],
        },
        {
          role: 'model',
          parts: [{ text: 'I understand and will follow these guidelines for generating authentic African dish information.' }],
        },
      ],
    })

    const result = await chat.sendMessage(userPrompt)
    const text = result.response.text()
    
    // Parse the JSON response
    try {
      // Extract JSON from the response (in case AI includes extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      const jsonStr = jsonMatch ? jsonMatch[0] : text
      
      const dishData = JSON.parse(jsonStr)
      
      // Ensure required fields are present and properly formatted
      const dish = {
        name: dishData.name || dishName,
        description: dishData.description || '',
        category: dishData.category || category || '',
        country_origin: dishData.country_origin || country || '',
        country_flag: dishData.country_flag || '',
        origin_story: dishData.origin_story || '',
        base_ingredients: Array.isArray(dishData.base_ingredients) 
          ? dishData.base_ingredients.join(', ') 
          : (dishData.base_ingredients || ''),
        is_vegetarian: Boolean(dishData.is_vegetarian),
        is_vegan: Boolean(dishData.is_vegan),
        is_halal: Boolean(dishData.is_halal),
        calories: dishData.calories || '',
        preparation_method: dishData.preparation_method || '',
        cultural_significance: dishData.cultural_significance || '',
        health_benefits: dishData.health_benefits || '',
        native_regions: Array.isArray(dishData.native_regions) 
          ? dishData.native_regions.join(', ') 
          : (dishData.native_regions || ''),
        taste_profile: dishData.taste_profile || '',
        base_spice_level: typeof dishData.base_spice_level === 'number' 
          ? dishData.base_spice_level 
          : parseInt(dishData.base_spice_level) || 1
      }

      return NextResponse.json({ dish })
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError)
      return NextResponse.json(
        { error: 'Failed to parse AI response', details: text },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error generating dish data:', error)
    return NextResponse.json(
      { error: 'Failed to generate dish data' },
      { status: 500 }
    )
  }
}
