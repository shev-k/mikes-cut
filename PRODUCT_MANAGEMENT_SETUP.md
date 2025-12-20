# Product Management System - Setup Guide

## Overview
This system enables admins to manage shop products with full CRUD (Create, Read, Update, Delete) functionality. Products are stored in Supabase and displayed on the shop page.

## Database Setup

### Step 1: Run SQL Migration in Supabase

Go to your Supabase project → SQL Editor and run the migration file:

**File:** `supabase/migrations/insert_existing_products.sql`

This will:
1. Insert categories (Steaks, Grills & Tools, Grooming) if they don't exist
2. Insert all 12 existing hardcoded products into the database
3. Skip duplicates if products already exist

### Step 2: Verify Database Structure

Your database should have these tables with the following structure:

#### Categories Table
- `id` (int4, primary key)
- `name` (varchar)
- `slug` (varchar)

#### Products Table
- `id` (int4, primary key)
- `name` (varchar)
- `category_id` (int4, foreign key to categories)
- `price` (numeric)
- `image_url` (varchar)
- `description` (text)
- `created_at` (timestamp)

## Features

### Admin Dashboard
Admins can access product management from the dashboard at `/dashboard`

**New Card Added:** "Manage Products"
- Shows total product count
- Click to open product management dialog

### Product Management Dialog
- **View All Products**: See a list of all products with images, categories, and prices
- **Add New Product**: Click "ADD NEW PRODUCT" button
- **Edit Product**: Click edit icon on any product
- **Delete Product**: Click trash icon with confirmation dialog

### Product Form Fields
- Product Name
- Category (dropdown from database categories)
- Price (in dollars)
- Image URL (path to product image)
- Description

### Shop Page
The shop page (`/shop`) now:
- Fetches products from Supabase database
- Dynamically loads categories
- Filters products by category
- Updates automatically when admin makes changes

## File Structure

```
app/
  shop/
    actions.ts           # Server actions for product CRUD
    page.tsx            # Shop page (updated to use database)
  dashboard/
    components/
      product-management.tsx  # Admin product management UI
      admin-dashboard.tsx     # Updated with product management

components/
  product-grid.tsx      # Updated to receive products as props

supabase/
  migrations/
    insert_existing_products.sql  # SQL to migrate existing products
```

## Security

Row Level Security (RLS) policies ensure:
- ✅ Anyone can view products
- ✅ Only admins can create, update, or delete products
- ✅ Authentication required for all write operations

## Usage

### For Admins:
1. Login to the dashboard
2. Click on "Manage Products" card
3. Add, edit, or delete products as needed
4. Changes appear immediately on the shop page

### For Customers:
- Visit `/shop` to browse all products
- Filter by category
- Add items to cart (cart functionality ready for checkout integration)

## Next Steps

Consider adding:
- Product image upload functionality
- Inventory tracking
- Product variants (sizes, colors)
- Featured products
- Product search
- Bulk import/export
