-- Fix Bookings Table Schema and RLS
-- Run this in Supabase SQL Editor to fix the "booking creation" issues

-- 1. Add notes column if it doesn't exist (The Admin Dashboard tries to save notes)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'notes') THEN
        ALTER TABLE bookings ADD COLUMN notes text;
    END IF;
END $$;

-- 2. Enable RLS on bookings table
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 3. Reset and Fix Policies
-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public can view bookings" ON bookings;
DROP POLICY IF EXISTS "Public can insert bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can do everything with bookings" ON bookings;
DROP POLICY IF EXISTS "Anyone can view bookings" ON bookings;
DROP POLICY IF EXISTS "Anyone can insert bookings" ON bookings;

-- Policy A: Public read access (Required for checking availability)
CREATE POLICY "Public can view bookings" 
ON bookings 
FOR SELECT 
USING (true);

-- Policy B: Public insert access (Required for customers to book)
CREATE POLICY "Public can insert bookings" 
ON bookings 
FOR INSERT 
WITH CHECK (true);

-- Policy C: Admins can do everything (Required for Admin Dashboard)
-- Allows Admins to Insert, Update, Delete, and Select all bookings
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

-- Verify the changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bookings';

SELECT * FROM pg_policies WHERE tablename = 'bookings';
