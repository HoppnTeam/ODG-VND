import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import type { Database } from '@/types/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, vendorData: formVendorData } = body

    // Check if user already exists by email
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()

    let authData: any = { user: null }
    let authError: any = null

    // Find user with matching email
    const existingUser = existingUsers?.users?.find(user => user.email === email)
    
    // If user exists, use that user
    if (existingUser) {
      console.log('User already exists, using existing user')
      authData.user = existingUser
    } else {
      // Create new auth user with vendor metadata
      const result = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          user_type: 'vendor', // Mark as vendor to distinguish from customers
          registration_type: 'vendor'
        }
      })
      
      authData = result.data
      authError = result.error
    }

    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json(
        { error: 'Failed to create user account', details: authError.message },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 400 }
      )
    }

    // Parse address into components (simplified for now)
    const addressParts = formVendorData.address.split(', ')
    let streetAddress = formVendorData.address
    let city = 'Not Provided'
    let state = 'Not Provided'
    let zipCode = 'Not Provided'
    
    // Try to parse the address if it has typical format
    if (addressParts.length >= 3) {
      streetAddress = addressParts[0]
      city = addressParts[1]
      // Last part might contain state and zip
      const stateZip = addressParts[addressParts.length - 1].split(' ')
      if (stateZip.length >= 2) {
        state = stateZip[0]
        zipCode = stateZip[stateZip.length - 1]
      }
    }

    // Prepare data for pending_vendors table - matching actual schema
    const registrationData = {
      id: authData.user.id, // Use auth user ID as the pending_vendors ID
      name: formVendorData.name, // Field is 'name' not 'business_name'
      description: formVendorData.description,
      email: email,
      phone_number: formVendorData.phone_number, // Field is 'phone_number' not 'phone'
      address: formVendorData.address, // Use original address field
      cuisine_type: formVendorData.cuisine_type, // Field is 'cuisine_type' not 'cuisine_region'
      owner_name: formVendorData.owner_name,
      business_license: 'pending-verification',
      status: 'pending'
    }

    // Check if a pending vendor application already exists for this email
    const { data: existingVendor } = await supabaseAdmin
      .from('pending_vendors')
      .select('*')
      .eq('email', email)
      .single()

    let insertedVendorData
    let vendorError

    if (existingVendor) {
      console.log('Pending vendor application already exists, updating it')
      // Update the existing pending vendor application
      const result = await supabaseAdmin
        .from('pending_vendors')
        .update(registrationData as any)
        .eq('email', email)
        .select()
        .single()
      
      insertedVendorData = result.data
      vendorError = result.error
    } else {
      // Insert new pending vendor application
      const result = await supabaseAdmin
        .from('pending_vendors')
        .insert(registrationData as any)
        .select()
        .single()
      
      insertedVendorData = result.data
      vendorError = result.error
    }

    if (vendorError) {
      console.error('Vendor insert error:', vendorError)
      
      // If vendor insert fails, clean up the auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      
      return NextResponse.json(
        { error: 'Failed to submit vendor information', details: vendorError.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Vendor registration submitted successfully',
      data: {
        userId: authData.user.id,
        vendorId: insertedVendorData?.id || authData.user.id
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
