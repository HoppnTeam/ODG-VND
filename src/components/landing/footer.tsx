'use client'

import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="text-xl font-bold font-heading">Hoppn</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Minnesota's premier platform for authentic African cuisine. 
              Connecting customers with cultural authenticity and helping 
              African restaurants thrive.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Vendors */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">For Vendors</h3>
            <div className="space-y-2">
              <Link href="/register" className="block text-gray-400 hover:text-white transition-colors">
                Register Restaurant
              </Link>
              <Link href="/login" className="block text-gray-400 hover:text-white transition-colors">
                Vendor Login
              </Link>
              <Link href="/dashboard" className="block text-gray-400 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/support" className="block text-gray-400 hover:text-white transition-colors">
                Support Center
              </Link>
              <Link href="/resources" className="block text-gray-400 hover:text-white transition-colors">
                Resources
              </Link>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company</h3>
            <div className="space-y-2">
              <Link href="/about" className="block text-gray-400 hover:text-white transition-colors">
                About Us
              </Link>
              <Link href="/careers" className="block text-gray-400 hover:text-white transition-colors">
                Careers
              </Link>
              <Link href="/press" className="block text-gray-400 hover:text-white transition-colors">
                Press
              </Link>
              <Link href="/blog" className="block text-gray-400 hover:text-white transition-colors">
                Blog
              </Link>
              <Link href="/contact" className="block text-gray-400 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">
                  Minneapolis, MN<br />
                  United States
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">(612) 555-0123</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">vendors@hoppn.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-400">
              © 2024 Hoppn. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}