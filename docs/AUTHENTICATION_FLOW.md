# Hoppn Authentication Flow Documentation

## ⚠️ CRITICAL: DO NOT MODIFY WITHOUT CODE OWNER APPROVAL

This document describes the authentication flow for the Hoppn vendor dashboard. The authentication system has been carefully configured to work with Supabase Auth and should not be modified without explicit approval from the code owner.

## Overview

The Hoppn authentication system uses:
- **Supabase Auth** for user authentication
- **@supabase/auth-helpers-nextjs** for Next.js integration
- **Server-side authentication** for API routes
- **Client-side authentication** for React components

## Authentication Architecture

### 1. Client-Side Authentication

```typescript
// ALWAYS use this pattern for client components
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient<Database>()
```

**Important**: Never use `createBrowserClient` or other Supabase client creation methods in client components.

### 2. Server-Side Authentication

```typescript
// For API routes and server components
import { createServerSupabaseClient } from '@/lib/supabase-server'

const supabase = await createServerSupabaseClient()
```

### 3. Authentication Hook (`useAuth`)

Located at: `/src/hooks/useAuth.ts`

This hook provides:
- Current user state
- Vendor user information
- Restaurant data
- Authentication status flags
- Sign in/out methods

```typescript
const { 
  user,           // Current authenticated user with vendor/restaurant data
  loading,        // Loading state
  error,          // Error messages
  isAuthenticated,// Boolean: user is logged in
  isVendor,       // Boolean: user is a vendor
  hasRestaurant,  // Boolean: vendor has a restaurant
  signIn,         // Function to sign in
  signOut,        // Function to sign out
} = useAuth()
```

## Authentication Flow

### 1. User Registration
1. User fills vendor registration form at `/register`
2. Data is submitted to `/api/register-vendor`
3. API creates:
   - Supabase auth user
   - Vendor user record
   - Restaurant record
4. User is redirected to success page

### 2. User Login
1. User enters credentials at `/login`
2. `useAuth` hook calls `authHelpers.signIn()`
3. Supabase sets secure cookies
4. Auth state change triggers data loading:
   - Loads vendor user data
   - Loads restaurant data
   - Updates auth state

### 3. Protected Routes
- Middleware at `/middleware.ts` protects routes
- Checks for valid session
- Redirects unauthenticated users to login

### 4. API Authentication
All API routes use the `requireAuth()` helper:

```typescript
const user = await requireAuth() // Throws if not authenticated
```

## Critical Files - DO NOT MODIFY

### 1. `/src/lib/supabase.ts`
```typescript
// ⚠️ CRITICAL: DO NOT MODIFY WITHOUT CODE OWNER APPROVAL
// This file contains the core Supabase client setup
// Changing this file can break authentication across the entire app
```

### 2. `/src/lib/supabase-server.ts`
```typescript
// ⚠️ CRITICAL: DO NOT MODIFY WITHOUT CODE OWNER APPROVAL
// Server-side Supabase client with cookie handling
// Required for API routes and server components
```

### 3. `/src/hooks/useAuth.ts`
```typescript
// ⚠️ CRITICAL: DO NOT MODIFY WITHOUT CODE OWNER APPROVAL
// Central authentication hook used throughout the app
// Modifications can break login/logout functionality
```

### 4. `/middleware.ts`
```typescript
// ⚠️ CRITICAL: DO NOT MODIFY WITHOUT CODE OWNER APPROVAL
// Route protection middleware
// Changes can expose protected routes or block access
```

## Database Schema

### Users Flow
1. **Auth Users** (Supabase Auth)
   - Managed by Supabase
   - Contains email, password hash, metadata

2. **Vendor Users** (`vendor_users` table)
   - Links to auth user via `auth_user_id`
   - Contains vendor-specific data

3. **Restaurants** (`restaurants` table)
   - Links to auth user via `vendor_id` (uses auth_user_id)
   - Contains restaurant data

### Important Relationships
```sql
-- Vendor user lookup
vendor_users.auth_user_id = auth.users.id

-- Restaurant lookup
restaurants.vendor_id = auth.users.id
```

## Common Issues & Solutions

### Issue: "Cannot read property 'user' of null"
**Cause**: Attempting to access user before auth loads
**Solution**: Always check `loading` state first

```typescript
if (loading) return <LoadingPage />
if (!isAuthenticated) return <Redirect to="/login" />
```

### Issue: "Unauthorized" in API routes
**Cause**: Missing or invalid authentication
**Solution**: Ensure `requireAuth()` is called in API routes

### Issue: Client components can't authenticate
**Cause**: Using wrong Supabase client creation method
**Solution**: Use `createClientComponentClient()` only

## Security Best Practices

1. **Never expose service role key** in client code
2. **Always validate user ownership** of resources
3. **Use Row Level Security (RLS)** in Supabase
4. **Validate all inputs** on the server side
5. **Keep authentication logic centralized** in the hooks/utils

## Testing Authentication

### Manual Testing
1. Test login with valid credentials
2. Test logout functionality
3. Test protected route access
4. Test API endpoints with/without auth
5. Test session persistence

### Debug Mode
Enable debug logging in `useAuth.ts`:
- Check console for auth state changes
- Verify user data loading
- Monitor session management

## Deployment Considerations

1. **Environment Variables**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server only)

2. **Cookie Configuration**
   - Ensure proper domain settings
   - Configure secure cookies for HTTPS
   - Set appropriate SameSite policies

## Contact for Changes

**Code Owner**: [Your Name/Team]
**Email**: [contact@example.com]

Any modifications to authentication must be:
1. Reviewed by code owner
2. Tested thoroughly
3. Documented in this file

---

Last Updated: 2025-07-18
Version: 1.0.0