-- TEMPORARY FIX: Disable RLS for testing (NOT RECOMMENDED FOR PRODUCTION)
-- Use this ONLY for testing if the policies above don't work
-- Then we can troubleshoot the actual issue

-- Disable RLS temporarily to allow all operations
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- Once you verify products can be added, re-enable with proper policies:
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;


-- BETTER ALTERNATIVE: Simple policy that allows authenticated users
-- If you want any logged-in user to manage products (during development):

-- First enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view products" ON products;
DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;

-- Allow everyone to read
CREATE POLICY "Anyone can view products" 
ON products 
FOR SELECT 
USING (true);

-- Allow any authenticated user to insert (TEMPORARY - for testing)
CREATE POLICY "Authenticated users can insert products" 
ON products 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Allow any authenticated user to update (TEMPORARY - for testing)
CREATE POLICY "Authenticated users can update products" 
ON products 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Allow any authenticated user to delete (TEMPORARY - for testing)
CREATE POLICY "Authenticated users can delete products" 
ON products 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Once you confirm this works, you can switch back to admin-only policies
