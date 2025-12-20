'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export interface Category {
  id: number
  name: string
  slug: string
}

export interface Product {
  id: number
  name: string
  category_id: number
  price: number
  image_url: string | null
  description: string | null
  created_at?: string
  categories?: Category
}

export interface ProductFormData {
  name: string
  category_id: number
  price: number
  image_url: string
  description: string
}

// Get all categories
export async function getCategories() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data as Category[]
}

// Get all products with category details
export async function getProducts() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data as Product[]
}

// Get products by category slug
export async function getProductsByCategory(categorySlug: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  if (categorySlug === 'all') {
    return getProducts()
  }

  const { data, error } = await supabase
    .from('products')
    .select('*, categories!inner(*)')
    .eq('categories.slug', categorySlug)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data as Product[]
}

// Create a new product (admin only)
export async function createProduct(formData: ProductFormData) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Verify user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { success: false, error: 'Unauthorized - Admin only' }
  }

  // Insert the product
  const { data, error } = await supabase
    .from('products')
    .insert([formData])
    .select('*, categories(*)')
    .single()

  if (error) {
    console.error('Error creating product:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/shop')
  revalidatePath('/dashboard')

  return { success: true, data }
}

// Update a product (admin only)
export async function updateProduct(id: string, formData: ProductFormData) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Verify user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { success: false, error: 'Unauthorized - Admin only' }
  }

  // Update the product
  const { data, error } = await supabase
    .from('products')
    .update(formData)
    .eq('id', id)
    .select('*, categories(*)')
    .single()

  if (error) {
    console.error('Error updating product:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/shop')
  revalidatePath('/dashboard')

  return { success: true, data }
}

// Delete a product (admin only)
export async function deleteProduct(id: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Verify user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { success: false, error: 'Unauthorized - Admin only' }
  }

  // Delete the product
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting product:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/shop')
  revalidatePath('/dashboard')

  return { success: true }
}

export async function createOrder(orderData: {
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  items: { id: number; quantity: number; price: number }[]
  total_amount: number
}) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Get current user if logged in
  const { data: { user } } = await supabase.auth.getUser()

  // 1. Create Order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user?.id || null,
      customer_name: orderData.customer_name,
      customer_email: orderData.customer_email,
      customer_phone: orderData.customer_phone,
      customer_address: orderData.customer_address,
      total_amount: orderData.total_amount,
      status: 'pending',
      payment_method: 'cash_on_delivery'
    })
    .select()
    .single()

  if (orderError) {
    console.error('Error creating order:', orderError)
    return { success: false, error: orderError.message }
  }

  // 2. Create Order Items
  const orderItems = orderData.items.map(item => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.quantity,
    price_at_time: item.price
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) {
    console.error('Error creating order items:', itemsError)
    return { success: false, error: itemsError.message }
  }

  revalidatePath('/dashboard')
  return { success: true, orderId: order.id }
}
