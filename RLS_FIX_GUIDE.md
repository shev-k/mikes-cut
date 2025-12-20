# RLS Policy Fix for Products Table

## Problem
Products cannot be added because Row Level Security (RLS) policies are blocking the insert operation.

## Solutions (Try in order)

### Solution 1: Check Your Admin Status

Run this in Supabase SQL Editor:
```sql
SELECT id, email, role FROM profiles WHERE id = auth.uid();
```

**If result shows NULL or role is not 'admin':**
```sql
UPDATE profiles SET role = 'admin' WHERE id = auth.uid();
```

Then try adding a product again.

---

### Solution 2: Fix RLS Policies

Run the script in `supabase/migrations/fix_rls_policies.sql`

This will:
1. Drop existing policies
2. Create new policies with proper admin checks
3. Verify policies were created correctly

---

### Solution 3: Use Authenticated User Policies (Testing)

If Solution 2 doesn't work, there might be an issue with the profiles table lookup.

**Option A: Disable RLS temporarily (testing only)**
```sql
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
```

Try adding products. If it works, the issue is definitely with RLS policies.

**Option B: Allow any authenticated user (testing only)**
Run the script in `supabase/migrations/disable_rls_for_testing.sql`

This allows ANY logged-in user to manage products (use for testing only).

---

### Solution 4: Check Profiles Table

Verify your profiles table has the correct structure:
```sql
SELECT * FROM profiles WHERE id = auth.uid();
```

Expected columns:
- `id` (matches auth.uid())
- `role` (should be 'admin', 'employee', or 'customer')

**If profiles table is missing or incomplete:**
```sql
-- Create your profile if it doesn't exist
INSERT INTO profiles (id, role) 
VALUES (auth.uid(), 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

---

### Solution 5: Completely Reset RLS

```sql
-- Disable RLS
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- Drop ALL policies
DROP POLICY IF EXISTS "Anyone can view products" ON products;
DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;
DROP POLICY IF EXISTS "Authenticated users can insert products" ON products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON products;

-- Re-enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create simple policies
CREATE POLICY "Public read" ON products FOR SELECT USING (true);
CREATE POLICY "Auth insert" ON products FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Auth update" ON products FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth delete" ON products FOR DELETE USING (auth.uid() IS NOT NULL);
```

---

## Recommended Production Setup

Once everything works, use these policies for production:

```sql
-- Public read access
CREATE POLICY "Anyone can view products" 
ON products FOR SELECT USING (true);

-- Admin-only write access
CREATE POLICY "Admins manage products" 
ON products FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);
```

---

## Quick Test

After applying any fix, test by running this in your app:
1. Login to dashboard as admin
2. Click "Manage Products"
3. Click "ADD NEW PRODUCT"
4. Fill in form and submit
5. Check browser console for any errors
6. Check Supabase logs for RLS policy errors

---

## Common Issues

**Error: "new row violates row-level security policy"**
- Your user doesn't have permission
- Check if you're logged in
- Check if your role is 'admin' in profiles table

**Error: "null value in column violates not-null constraint"**
- Missing required fields in form
- Check that category_id is valid

**Error: "permission denied for table products"**
- RLS is enabled but no policies allow your action
- Use Solution 2 or 3 above
