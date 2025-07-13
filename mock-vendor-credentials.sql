-- Mock approved vendor credentials for login testing
-- This script creates a test vendor in Supabase Auth, vendor_users, and restaurants tables

-- IMPORTANT: Run these steps in order

-- STEP 1: Create a Supabase Auth user via the Authentication dashboard
-- Since SQL can't directly create auth users with passwords, do this manually:
-- 1. Go to Authentication > Users in Supabase dashboard
-- 2. Click "Add User" button
-- 3. Enter: Email: test@africanrestaurant.com, Password: password123
-- 4. Note the generated user UUID - you'll need it below

-- STEP 2: Replace AUTH_USER_ID below with the UUID from step 1
-- Then run the remaining SQL statements

-- Define variables (replace with your actual auth user ID)
DO $$ 
DECLARE
  auth_user_id UUID := 'REPLACE_WITH_AUTH_USER_ID_FROM_STEP_1'; -- Replace this!
  vendor_user_id UUID;
  restaurant_id UUID;
BEGIN
  
  -- Create vendor_user entry
  INSERT INTO vendor_users (
    id, -- The ID from the pending_vendors table that matches the auth user
    name,
    email,
    phone_number,
    business_name,
    business_address,
    status,
    created_at,
    updated_at
  ) VALUES (
    auth_user_id, -- Using the auth user ID as the vendor_users.id
    'Test Owner',
    'test@africanrestaurant.com',
    '612-555-1234',
    'Test African Restaurant',
    '123 Test Street, Minneapolis, MN 55401',
    'approved',
    NOW(),
    NOW()
  ) RETURNING id INTO vendor_user_id;

  -- Create restaurant entry
  INSERT INTO restaurants (
    name,
    description,
    image_url,
    cuisine_type,
    address,
    phone_number,
    email,
    status,
    created_at,
    updated_at,
    street_number,
    street_name,
    city,
    state,
    zip_code
  ) VALUES (
    'Test African Restaurant',
    'A mock restaurant for testing the vendor login flow',
    'https://example.com/restaurant.jpg',
    'west_african',
    '123 Test Street, Minneapolis, MN 55401',
    '612-555-1234',
    'test@africanrestaurant.com',
    'active',
    NOW(),
    NOW(),
    '123',
    'Test Street',
    'Minneapolis',
    'MN',
    '55401'
  ) RETURNING id INTO restaurant_id;

END $$;

-- Instructions for testing:
-- 1. First create the auth user manually in Supabase Authentication dashboard
-- 2. Copy the auth user ID and replace REPLACE_WITH_AUTH_USER_ID_FROM_STEP_1 with it
-- 3. Run the SQL script in your Supabase SQL editor
-- 4. You can then log in with:
--    Email: test@africanrestaurant.com
--    Password: password123
