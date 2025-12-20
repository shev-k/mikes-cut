-- Fix RLS Policies for Orders Table
-- Run this in Supabase SQL Editor to allow admins to update order status

-- Enable RLS on orders table (ensure it is enabled)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Drop existing update policy if it exists to avoid conflicts
DROP POLICY IF EXISTS "Admins can update orders" ON orders;

-- Policy: Allow admins to update orders
CREATE POLICY "Admins can update orders" 
ON orders 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);
