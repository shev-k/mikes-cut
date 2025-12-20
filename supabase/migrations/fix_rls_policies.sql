-- Fix RLS Policies for Products Table
-- Run this in Supabase SQL Editor to allow admins to add/edit/delete products

-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view products" ON products;
DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;

-- Enable RLS on products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow everyone to read products (for shop page)
CREATE POLICY "Anyone can view products" 
ON products 
FOR SELECT 
USING (true);

-- Policy 2: Allow admins to insert products
CREATE POLICY "Admins can insert products" 
ON products 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Policy 3: Allow admins to update products
CREATE POLICY "Admins can update products" 
ON products 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Policy 4: Allow admins to delete products
CREATE POLICY "Admins can delete products" 
ON products 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Verify the policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'products';

-- Test: Check if your current user is an admin
SELECT 
  id,
  email,
  role
FROM profiles
WHERE id = auth.uid();

-- If the above returns NULL or role is not 'admin', you need to set your role:
-- UPDATE profiles SET role = 'admin' WHERE id = auth.uid();
