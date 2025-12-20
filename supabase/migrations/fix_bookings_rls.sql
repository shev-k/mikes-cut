-- Fix RLS Policies for Bookings Table
-- Run this in Supabase SQL Editor to allow admins to manage bookings

-- Enable RLS on bookings table (if not already enabled)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to start fresh and avoid conflicts
DROP POLICY IF EXISTS "Public can view bookings" ON bookings;
DROP POLICY IF EXISTS "Public can insert bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can do everything with bookings" ON bookings;
DROP POLICY IF EXISTS "Anyone can view bookings" ON bookings;
DROP POLICY IF EXISTS "Anyone can insert bookings" ON bookings;

-- Policy 1: Public read access (for checking availability)
-- Allows anyone to see bookings to check for conflicts
CREATE POLICY "Public can view bookings"
ON bookings
FOR SELECT
USING (true);

-- Policy 2: Public insert access (for making bookings)
-- Allows anyone to create a booking
CREATE POLICY "Public can insert bookings"
ON bookings
FOR INSERT
WITH CHECK (true);

-- Policy 3: Admins can do everything (Update, Delete, etc.)
-- This ensures admins can manage bookings fully
CREATE POLICY "Admins can do everything with bookings"
ON bookings
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Verify policies
SELECT * FROM pg_policies WHERE tablename = 'bookings';
