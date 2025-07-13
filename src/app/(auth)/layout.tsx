import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vendor Authentication - Hoppn',
  description: 'Sign in or register your African restaurant with Hoppn',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}