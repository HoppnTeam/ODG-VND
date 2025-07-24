'use client'

import { HoppnCard } from "@/components/ui/card"
import { 
  ClipboardList, 
  ChefHat, 
  CreditCard, 
  Globe, 
  Smartphone,
  TrendingUp,
  Users,
  Star,
  Clock,
  BarChart3
} from "lucide-react"

const features = [
  {
    icon: ClipboardList,
    title: "Order Management",
    description: "Real-time order tracking and customer notifications",
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    icon: ChefHat,
    title: "Menu Builder",
    description: "Showcase authentic African dishes with cultural stories",
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  },
  {
    icon: BarChart3,
    title: "Revenue Analytics",
    description: "Track sales, popular dishes, and customer insights",
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    icon: CreditCard,
    title: "Easy Payments",
    description: "Stripe Connect integration with transparent fees",
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    icon: Globe,
    title: "Cultural Focus",
    description: "Highlight dish origins and African culinary heritage",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50"
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description: "Manage your restaurant from any device",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50"
  }
]

const benefits = [
  {
    icon: TrendingUp,
    title: "Increase Revenue",
    description: "Average 30% increase in monthly revenue within 3 months",
    stat: "30%"
  },
  {
    icon: Users,
    title: "Grow Customer Base",
    description: "Connect with customers who value authentic African cuisine",
    stat: "2.5x"
  },
  {
    icon: Star,
    title: "Build Brand Recognition",
    description: "Showcase your restaurant's unique story and heritage",
    stat: "4.8★"
  },
  {
    icon: Clock,
    title: "Save Time",
    description: "Streamlined operations reduce admin time by 60%",
    stat: "60%"
  }
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">
              Everything you need to grow your African restaurant
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools you need to manage orders, 
              engage customers, and scale your authentic African cuisine business.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => (
              <HoppnCard key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </HoppnCard>
            ))}
          </div>

          {/* Benefits Section */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-bold font-heading text-gray-900 mb-4">
                Proven results for African restaurants
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join successful African restaurant owners who have transformed their 
                businesses with Hoppn&apos;s vendor platform.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <benefit.icon className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="text-3xl font-bold font-heading text-gray-900 mb-2">
                    {benefit.stat}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Process Section */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-bold font-heading text-gray-900 mb-4">
                Simple onboarding process
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Get started with your restaurant on Hoppn in just a few easy steps.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl font-bold">1</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Register Your Restaurant
                </h4>
                <p className="text-gray-600">
                  Complete our simple registration form with your business information and required documents.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl font-bold">2</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Get Approved
                </h4>
                <p className="text-gray-600">
                  Our team reviews your application and approves qualified African restaurants within 24-48 hours.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl font-bold">3</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Start Growing
                </h4>
                <p className="text-gray-600">
                  Access your dashboard, upload your menu, and start receiving orders from customers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}