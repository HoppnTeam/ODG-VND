# TypeScript 'any' Type Fixes Summary

## Overview
Fixed all TypeScript 'any' types with proper interfaces across the codebase as requested.

## Files Fixed

### 1. `/src/app/(auth)/register/page.tsx`
- **Line 64**: Changed `error: any` to `error` with proper type checking using `error instanceof Error`

### 2. `/src/app/api/register-vendor/route.ts`
- **Lines 13, 14**: Replaced `authData: any` and `authError: any` with proper types
- **Lines 83, 94**: Removed `as any` casts for database operations
- Added proper type imports for `SupabaseAdminUser`, `VendorRegistrationPayload`, etc.

### 3. `/src/app/api/stripe/account-link/route.ts`
- **Line 60**: Changed `error: any` to `error` with proper error handling

### 4. `/src/app/api/stripe/account-status/route.ts`
- **Line 73**: Changed `error: any` to `error` with proper error handling

### 5. `/src/app/api/stripe/connect/route.ts`
- **Lines 80, 114**: Changed `error: any` to `error` with proper error handling
- Created `StripeErrorExtended` interface for Stripe-specific error properties

### 6. `/src/app/api/stripe/connect-session/route.ts`
- **Line 82**: Changed `error: any` to `error` with proper error handling

### 7. `/src/app/api/stripe/earnings/route.ts`
- **Line 77**: Changed `error: any` to `error` with proper error handling

### 8. `/src/app/api/stripe/initialize/route.ts`
- **Line 38**: Changed `error: any` to `error` with proper error handling

### 9. `/src/app/api/stripe/sync-account/route.ts`
- **Line 106**: Changed `error: any` to `error` with proper error handling

### 10. `/src/app/api/stripe/transactions/route.ts`
- **Line 94**: Changed `error: any` to `error` with proper error handling

### 11. `/src/app/dashboard/orders/page.tsx`
- **Line 80**: Changed `order: any` to `order: OrderDisplay` with proper interface
- Added import for `OrderDisplay` type from new API types file

### 12. `/src/app/dashboard/orders/[id]/page.tsx`
- **File not found** - This file doesn't exist in the codebase

### 13. `/src/hooks/useAuth.ts`
- **Lines 152, 158, 169, 187**: Changed all `error: any` to `error` with proper error handling
- Changed `userData: any` to `userData?: Record<string, unknown>`
- Added proper type imports

### 14. `/src/lib/cache.ts`
- **Lines 13, 186**: Changed `CacheItem<any>` to `CacheItem<unknown>`
- Changed `T extends any[]` to `T extends unknown[]`

### 15. `/src/lib/supabase-server.ts`
- **Lines 34, 42**: Changed `options: any` to `options: CookieOptions`
- **Lines 170, 180, 190**: Changed parameter types to use proper Supabase database types

### 16. `/src/lib/supabase.ts`
- **Line 62**: Changed `userData: any` to `userData?: Record<string, unknown>`
- **Lines 159, 168, 177, 186, 195, 213**: Changed all data parameters to use proper Supabase database types
- **Lines 250, 264, 278**: Changed callback parameters to use proper types

### 17. `/src/lib/utils.ts`
- **Line 82**: Changed `items: any[]` to `items: OrderItemDisplay[]`
- **Line 98**: Changed `T extends (...args: any[]) => any` to `T extends (...args: unknown[]) => unknown`

### 18. `/src/types/index.ts`
- **Line 48**: Removed `[key: string]: any` and replaced with `[key: string]: unknown`
- **Lines 152, 159**: Changed default generic `T = any` to `T = unknown`

## New Type Definitions Created

Created `/src/types/api.ts` with the following types:
- `StripeAccount`, `StripeTransaction`, `StripeBalance` - For Stripe API responses
- `SupabaseAdminUser`, `AdminUserListResponse` - For Supabase admin operations
- `VendorRegistrationPayload`, `PendingVendorData` - For vendor registration
- `CookieOptions` - For cookie handling
- `OrderItemDisplay`, `OrderDisplay` - For order display
- `ErrorWithMessage`, `SupabaseError` - For error handling
- Various utility types

## Remaining 'any' Types

There are still some 'any' types in component files that were not part of the original request:
- `/src/components/dashboard/ReviewResponse.tsx`
- `/src/components/dashboard/PhotoUpload.tsx`
- `/src/components/dashboard/StripeConnect.tsx`
- `/src/components/dashboard/RestaurantHours.tsx`
- `/src/components/dashboard/DishForm.tsx`

These can be addressed in a separate task if needed.

## Best Practices Applied

1. Used `unknown` instead of `any` for truly dynamic types
2. Created specific interfaces for structured data
3. Used proper error handling with `error instanceof Error` checks
4. Leveraged existing Supabase database types where possible
5. Maintained type safety while preserving functionality