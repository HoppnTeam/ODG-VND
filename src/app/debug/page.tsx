'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

export default function DebugPage() {
  const { user, loading, isAuthenticated } = useAuth()
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please log in first</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Auth Debug Information</h1>
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Auth User Details</h2>
        <div className="space-y-4">
          <div>
            <p className="font-medium">Auth User ID:</p>
            <div className="flex items-center mt-1">
              <code className="bg-gray-100 p-2 rounded text-sm flex-1 overflow-auto">{user?.id}</code>
              <button 
                onClick={() => copyToClipboard(user?.id || '')}
                className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          
          <div>
            <p className="font-medium">Email:</p>
            <p className="bg-gray-100 p-2 rounded text-sm">{user?.email}</p>
          </div>
          
          <div>
            <p className="font-medium">Created At:</p>
            <p className="bg-gray-100 p-2 rounded text-sm">{user?.created_at}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Vendor Status</h2>
        <div className="space-y-4">
          <div>
            <p className="font-medium">Is Vendor:</p>
            <p className="bg-gray-100 p-2 rounded text-sm">{String(!!user?.vendorUser)}</p>
          </div>
          
          {user?.vendorUser && (
            <>
              <div>
                <p className="font-medium">Vendor ID:</p>
                <p className="bg-gray-100 p-2 rounded text-sm">{user.vendorUser.id}</p>
              </div>
              <div>
                <p className="font-medium">Vendor Status:</p>
                <p className="bg-gray-100 p-2 rounded text-sm">{user.vendorUser.status}</p>
              </div>
            </>
          )}
          
          <div>
            <p className="font-medium">Has Restaurant:</p>
            <p className="bg-gray-100 p-2 rounded text-sm">{String(!!user?.restaurant)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
