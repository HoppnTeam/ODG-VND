'use client'

import { HoppnCard } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Amara Okafor",
    restaurant: "Mama's Kitchen",
    cuisine: "Nigerian",
    image: "/testimonials/amara.jpg",
    rating: 5,
    quote: "Hoppn has transformed our business! We've seen a 40% increase in orders and our customers love the cultural stories we share with each dish. The platform makes it so easy to connect with people who truly appreciate authentic Nigerian cuisine.",
    results: "40% increase in orders",
    flag: "🇳🇬"
  },
  {
    name: "Kwame Asante",
    restaurant: "Gold Coast Grill",
    cuisine: "Ghanaian",
    image: "/testimonials/kwame.jpg",
    rating: 5,
    quote: "The analytics dashboard gives us incredible insights into our customers' preferences. We discovered that our kelewele is most popular on weekends, so we adjusted our prep schedule. Revenue is up 25% in just 2 months!",
    results: "25% revenue increase",
    flag: "🇬🇭"
  },
  {
    name: "Fatima Hassan",
    restaurant: "Nile Valley Restaurant",
    cuisine: "Ethiopian",
    image: "/testimonials/fatima.jpg",
    rating: 5,
    quote: "What I love most about Hoppn is how it celebrates our culture. Customers read the stories behind our dishes and appreciate the time and tradition that goes into each meal. It's not just food delivery - it's cultural exchange.",
    results: "4.9★ average rating",
    flag: "🇪🇹"
  },
  {
    name: "Diallo Camara",
    restaurant: "Sahel Spice House",
    cuisine: "Senegalese",
    image: "/testimonials/diallo.jpg",
    rating: 5,
    quote: "The payment system is transparent and fair. We know exactly what we're earning and the fees are reasonable. Plus, the customer support team understands the unique needs of African restaurants.",
    results: "Transparent pricing",
    flag: "🇸🇳"
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">
              Trusted by African restaurant owners across Minnesota
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from successful restaurant owners who have grown their businesses 
              and connected with customers through Hoppn&apos;s vendor platform.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {testimonials.map((testimonial, index) => (
              <HoppnCard key={index} className="p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {testimonial.flag}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{testimonial.restaurant}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-600">{testimonial.cuisine} Cuisine</span>
                      <div className="flex gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {testimonial.results}
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 w-8 h-8 text-orange-200" />
                  <blockquote className="text-gray-700 leading-relaxed pl-6">
                    &quot;{testimonial.quote}&quot;
                  </blockquote>
                </div>
              </HoppnCard>
            ))}
          </div>

          {/* Stats Section */}
          <div className="bg-white rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold font-heading text-gray-900 mb-8">
              Join a growing community of successful African restaurants
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-3xl md:text-4xl font-bold font-heading text-orange-600 mb-2">
                  50+
                </div>
                <div className="text-sm md:text-base text-gray-600">
                  Active Restaurants
                </div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold font-heading text-blue-600 mb-2">
                  15K+
                </div>
                <div className="text-sm md:text-base text-gray-600">
                  Monthly Orders
                </div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold font-heading text-green-600 mb-2">
                  4.8★
                </div>
                <div className="text-sm md:text-base text-gray-600">
                  Average Rating
                </div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold font-heading text-purple-600 mb-2">
                  $750K+
                </div>
                <div className="text-sm md:text-base text-gray-600">
                  Revenue Generated
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}