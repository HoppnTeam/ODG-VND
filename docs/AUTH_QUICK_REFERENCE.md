# Authentication Quick Reference

## ⚠️ WARNING: AUTHENTICATION FILES ARE PROTECTED

All authentication-related files have been marked with protection comments. **DO NOT MODIFY** without explicit approval from the code owner.

## Protected Files List

### Core Authentication Files (CRITICAL)
- ✅ `/src/lib/supabase.ts` - Main Supabase client
- ✅ `/src/lib/supabase-server.ts` - Server-side client with cookies
- ✅ `/src/hooks/useAuth.ts` - Central authentication hook
- ✅ `/middleware.ts` - Route protection middleware

### Component Authentication Files (IMPORTANT)
- ✅ `/src/hooks/useOrders.ts` - Orders hook with auth
- ✅ `/src/hooks/useDishes.ts` - Dishes hook with auth
- ✅ `/src/components/dashboard/DishForm.tsx` - Dish form with auth

## Quick Authentication Patterns

### ✅ CORRECT: Client Components
```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
const supabase = createClientComponentClient<Database>()
```

### ❌ WRONG: Client Components
```typescript
import { createBrowserClient } from '@supabase/ssr'
const supabase = createBrowserClient(url, key) // DO NOT USE
```

### ✅ CORRECT: Server Components/API Routes
```typescript
import { createServerSupabaseClient } from '@/lib/supabase-server'
const supabase = await createServerSupabaseClient()
```

### ✅ CORRECT: Using Auth Hook
```typescript
const { user, loading, isAuthenticated, isVendor, hasRestaurant } = useAuth()

if (loading) return <LoadingPage />
if (!isAuthenticated) return <Redirect />
if (!isVendor) return <NotAuthorized />
```

## Emergency Contact

If authentication breaks after any changes:

1. **Immediately revert changes**
2. **Contact code owner**
3. **Check browser console for errors**
4. **Verify environment variables**

## Change Request Process

1. **Create issue** describing needed changes
2. **Get approval** from code owner
3. **Create branch** for changes
4. **Test thoroughly** on development
5. **Document changes** in this file
6. **Get code review** before merging

---

**Code Owner**: [Your Name/Team]  
**Last Updated**: 2025-07-18  
**Status**: ✅ WORKING - DO NOT MODIFY