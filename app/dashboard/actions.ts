'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export async function getAdminStats(month?: number, year?: number) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Fetch all confirmed bookings with service price and barber details
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select(`
      id,
      booking_date,
      status,
      barbers (
        id,
        name,
        commission_rate
      ),
      services (
        price
      )
    `)
    .eq('status', 'confirmed')

  if (error) {
    console.error('Error fetching admin stats:', error)
    return null
  }

  const now = new Date()
  const targetMonth = month !== undefined ? month : now.getMonth()
  const targetYear = year !== undefined ? year : now.getFullYear()
  const todayStr = now.toISOString().split('T')[0]

  let totalRevenue = 0
  let monthlyRevenue = 0
  let todayRevenue = 0
  
  const barberStats: Record<number, { 
    id: number, 
    name: string, 
    bookings: number, 
    revenue: number, 
    commissionRate: number,
    earnings: number 
  }> = {}

  // Initialize barber stats map to ensure we have all barbers even with 0 bookings
  const { data: allBarbers } = await supabase.from('barbers').select('id, name, commission_rate')
  allBarbers?.forEach(barber => {
    barberStats[barber.id] = {
      id: barber.id,
      name: barber.name,
      bookings: 0,
      revenue: 0,
      commissionRate: barber.commission_rate || 50, // Default 50%
      earnings: 0
    }
  })

  bookings.forEach((booking: any) => {
    const price = Number(booking.services?.price || 0)
    const bookingDate = new Date(booking.booking_date)
    const barberId = booking.barbers?.id

    // Global Stats (Lifetime)
    totalRevenue += price
    
    // Monthly Stats (Target Month)
    if (bookingDate.getMonth() === targetMonth && bookingDate.getFullYear() === targetYear) {
      monthlyRevenue += price
      
      // Barber Stats (Only for the selected month)
      if (barberId && barberStats[barberId]) {
        barberStats[barberId].bookings += 1
        barberStats[barberId].revenue += price
        
        const rate = barberStats[barberId].commissionRate / 100
        barberStats[barberId].earnings += price * rate
      }
    }

    if (booking.booking_date === todayStr) {
      todayRevenue += price
    }
  })

  // Daily Revenue for Chart (Days in the selected month)
  const dailyRevenueMap: Record<string, number> = {}
  const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate()
  
  for (let i = 1; i <= daysInMonth; i++) {
    // Create date string in YYYY-MM-DD format manually to avoid timezone issues
    const d = new Date(Date.UTC(targetYear, targetMonth, i))
    const dateStr = d.toISOString().split('T')[0]
    dailyRevenueMap[dateStr] = 0
  }

  bookings.forEach((booking: any) => {
    const bookingDate = new Date(booking.booking_date)
    if (bookingDate.getMonth() === targetMonth && bookingDate.getFullYear() === targetYear) {
       const date = booking.booking_date
       if (dailyRevenueMap[date] !== undefined) {
         dailyRevenueMap[date] += Number(booking.services?.price || 0)
       }
    }
  })

  const dailyRevenueChart = Object.entries(dailyRevenueMap)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => a.date.localeCompare(b.date))

  return {
    totalRevenue,
    monthlyRevenue,
    todayRevenue,
    totalBookings: bookings.length,
    barberStats: Object.values(barberStats),
    dailyRevenueChart
  }
}

export async function updateBarberCommission(barberId: number, rate: number) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase
    .from('barbers')
    .update({ commission_rate: rate })
    .eq('id', barberId)

  if (error) {
    console.error('Error updating commission:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

// --- Booking Management ---

export async function getAllBookings() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      barbers (name),
      services (name, price)
    `)
    .order('booking_date', { ascending: false })
    .order('booking_time', { ascending: true })

  if (error) {
    console.error('Error fetching bookings:', error)
    return []
  }
  
  return data
}

// --- Barber Management ---

export async function getBarbersList() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data, error } = await supabase.from('barbers').select('*').order('name')
  if (error) return []
  return data
}

export async function createBarber(data: any) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  
  // Generate a slug from name if not provided
  const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  
  const { error } = await supabase.from('barbers').insert({
    name: data.name,
    slug: slug,
    title: data.title,
    bio: data.bio,
    image_url: data.image_url,
    commission_rate: data.commission_rate
  })

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateBarber(id: number, data: any) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  
  const { error } = await supabase.from('barbers').update(data).eq('id', id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteBarber(id: number) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  
  const { error } = await supabase.from('barbers').delete().eq('id', id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard')
  return { success: true }
}

// --- Service Management ---

export async function getServicesList() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data, error } = await supabase.from('services').select('*').order('name')
  if (error) return []
  return data
}

export async function createService(data: any) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  
  // Generate a slug from name if not provided
  const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  
  const serviceData = {
    name: data.name,
    slug: slug,
    price: data.price,
    duration: data.duration,
    description: data.description
  }
  
  console.log("Attempting to create service:", serviceData)
  
  const { error } = await supabase.from('services').insert(serviceData)

  if (error) {
    console.error("Service creation error:", error)
    return { success: false, error: error.message }
  }
  
  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateService(id: number, data: any) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  
  const { error } = await supabase.from('services').update(data).eq('id', id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteService(id: number) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  
  const { error } = await supabase.from('services').delete().eq('id', id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard')
  return { success: true }
}
