'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-orange-600 to-yellow-600">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-white mb-6">
            Ready to grow your African restaurant?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join Minnesota&apos;s leading platform for authentic African cuisine and 
            start connecting with customers who appreciate your cultural heritage.
          </p>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="flex items-center gap-3 text-white">
              <CheckCircle className="w-5 h-5 text-yellow-200 flex-shrink-0" />
              <span>No setup fees</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <CheckCircle className="w-5 h-5 text-yellow-200 flex-shrink-0" />
              <span>Free onboarding support</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <CheckCircle className="w-5 h-5 text-yellow-200 flex-shrink-0" />
              <span>24/7 customer support</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button 
                size="lg" 
                className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-8 py-3 text-lg w-full sm:w-auto"
              >
                Get Started Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 font-semibold px-8 py-3 text-lg w-full sm:w-auto"
              >
                Sign In
              </Button>
            </Link>
          </div>

          {/* Trust Badge */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-white/80 text-sm">
              Trusted by 50+ African restaurants in Minnesota • Processing $750K+ in monthly revenue
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}