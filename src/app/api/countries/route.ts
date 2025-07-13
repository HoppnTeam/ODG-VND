import { NextResponse } from 'next/server'

// Hardcoded countries data until countries table is added to Supabase
const countries = [
  { id: '1', name: 'Nigeria', flag: '🇳🇬', region: 'West Africa' },
  { id: '2', name: 'Ghana', flag: '🇬🇭', region: 'West Africa' },
  { id: '3', name: 'Ethiopia', flag: '🇪🇹', region: 'East Africa' },
  { id: '4', name: 'Kenya', flag: '🇰🇪', region: 'East Africa' },
  { id: '5', name: 'South Africa', flag: '🇿🇦', region: 'Southern Africa' },
  { id: '6', name: 'Morocco', flag: '🇲🇦', region: 'North Africa' },
  { id: '7', name: 'Egypt', flag: '🇪🇬', region: 'North Africa' },
  { id: '8', name: 'Senegal', flag: '🇸🇳', region: 'West Africa' },
  { id: '9', name: 'Tanzania', flag: '🇹🇿', region: 'East Africa' },
  { id: '10', name: 'Uganda', flag: '🇺🇬', region: 'East Africa' },
  { id: '11', name: 'Cameroon', flag: '🇨🇲', region: 'Central Africa' },
  { id: '12', name: 'Mali', flag: '🇲🇱', region: 'West Africa' },
  { id: '13', name: 'Burkina Faso', flag: '🇧🇫', region: 'West Africa' },
  { id: '14', name: 'Ivory Coast', flag: '🇨🇮', region: 'West Africa' },
  { id: '15', name: 'Algeria', flag: '🇩🇿', region: 'North Africa' }
]

export async function GET() {
  try {
    return NextResponse.json({ countries })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
