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
      booking_time,
      customer_name,
      status,
      barbers (
        id,
        name,
        commission_rate
      ),
      services (
        name,
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
  let monthlyBookingsCount = 0
  const monthlyBookingsList: any[] = []
  
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
    // Parse date safely from YYYY-MM-DD string
    const [bYear, bMonth, bDay] = booking.booking_date.split('-').map(Number)
    
    const barberId = booking.barbers?.id

    // Global Stats (Lifetime)
    totalRevenue += price
    
    // Monthly Stats (Target Month)
    // Note: bMonth is 1-12, targetMonth is 0-11
    if (bMonth - 1 === targetMonth && bYear === targetYear) {
      monthlyRevenue += price
      monthlyBookingsCount++
      monthlyBookingsList.push({
        ...booking,
        price // explicit price for easier access
      })
      
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

  // Use the monthlyBookingsList we just created to populate the daily map
  monthlyBookingsList.forEach((booking: any) => {
      const date = booking.booking_date
      if (dailyRevenueMap[date] !== undefined) {
        dailyRevenueMap[date] += Number(booking.services?.price || 0)
      }
  })

  const dailyRevenueChart = Object.entries(dailyRevenueMap)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => a.date.localeCompare(b.date))

  return {
    totalRevenue,
    monthlyRevenue,
    todayRevenue,
    totalBookings: monthlyBookingsCount,
    bookings: monthlyBookingsList, // Return the list of bookings
    barberStats: Object.values(barberStats),
    dailyRevenueChart
  }
}

// --- Barber Stats ---

export async function getBarberStats(barberId: number) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  // Fetch all bookings for this barber
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select(`
      id,
      booking_date,
      booking_time,
      customer_name,
      customer_email,
      status,
      services (
        name,
        price
      )
    `)
    .eq('barber_id', barberId)
    .neq('status', 'cancelled')
    .order('booking_date', { ascending: false })

  if (error) {
    console.error('Error fetching barber stats:', error)
    return null
  }

  // Helper arrays
  const monthlyStatsMap: Record<string, number> = {} // "YYYY-MM" -> revenue
  const monthlyBookingsMap: Record<string, number> = {} // "YYYY-MM" -> count
  const distinctClients = new Set<string>()
  const clientStats: Record<string, { bookings: number, revenue: number, name: string }> = {}
  const serviceStats: Record<string, { count: number, revenue: number }> = {}

  let totalEarnings = 0
  let thisMonthEarnings = 0
  let thisMonthBookings = 0

  bookings.forEach((booking: any) => {
    const price = Number(booking.services?.price || 0)
    const bookingDate = new Date(booking.booking_date)
    const monthKey = `${bookingDate.getFullYear()}-${String(bookingDate.getMonth() + 1).padStart(2, '0')}` // YYYY-MM
    const clientKey = booking.customer_email || booking.customer_name

    // Monthly Earnings & Counts
    monthlyStatsMap[monthKey] = (monthlyStatsMap[monthKey] || 0) + price
    monthlyBookingsMap[monthKey] = (monthlyBookingsMap[monthKey] || 0) + 1

    // Total Earnings
    totalEarnings += price

    // This Month Stats
    if (bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear) {
      thisMonthEarnings += price
      thisMonthBookings++
    }

    // Client Stats
    distinctClients.add(clientKey)
    if (!clientStats[clientKey]) {
      clientStats[clientKey] = { bookings: 0, revenue: 0, name: booking.customer_name }
    }
    clientStats[clientKey].bookings += 1
    clientStats[clientKey].revenue += price

    // Service Stats
    const serviceName = booking.services?.name || 'Unknown'
    if (!serviceStats[serviceName]) {
      serviceStats[serviceName] = { count: 0, revenue: 0 }
    }
    serviceStats[serviceName].count += 1
    serviceStats[serviceName].revenue += price
  })

  // Format data for charts/lists
  const monthlyRevenueData = Object.entries(monthlyStatsMap)
    .map(([date, revenue]) => ({ date, revenue }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-12) // Last 12 months

  const topClients = Object.values(clientStats)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  const topServices = Object.entries(serviceStats)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Upcoming bookings
  const todayStr = now.toISOString().split('T')[0]
  const upcomingBookings = bookings
    .filter((b: any) => b.booking_date >= todayStr && b.status === 'confirmed')
    .sort((a: any, b: any) => {
       if (a.booking_date === b.booking_date) {
         return a.booking_time.localeCompare(b.booking_time)
       }
       return a.booking_date.localeCompare(b.booking_date)
    })
    .slice(0, 10)

  return {
    totalEarnings,
    thisMonthEarnings,
    thisMonthBookings,
    totalBookings: bookings.length,
    uniqueClients: distinctClients.size,
    monthlyRevenueData,
    topClients,
    topServices,
    upcomingBookings
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
      services (name, price, duration)
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

// --- Booking Management (Admin) ---

export async function createBooking(data: any) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  
  // Ensure the data has the correct structure for database insertion
  const bookingData = {
    barber_id: parseInt(data.barber_id),
    service_id: parseInt(data.service_id),
    booking_date: data.booking_date,
    booking_time: data.booking_time,
    customer_name: data.customer_name,
    customer_email: data.customer_email,
    customer_phone: data.customer_phone,
    status: data.status || 'confirmed',
    notes: data.notes || null
  }

  const { error } = await supabase.from('bookings').insert([bookingData])

  if (error) {
    console.error("Booking creation error:", error)
    return { success: false, error: error.message }
  }
  
  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateBooking(id: number, data: any) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  
  // Ensure the data has the correct structure for database update
  const bookingData = {
    barber_id: parseInt(data.barber_id),
    service_id: parseInt(data.service_id),
    booking_date: data.booking_date,
    booking_time: data.booking_time,
    customer_name: data.customer_name,
    customer_email: data.customer_email,
    customer_phone: data.customer_phone,
    status: data.status || 'confirmed',
    notes: data.notes || null
  }
  
  const { error } = await supabase.from('bookings').update(bookingData).eq('id', id)

  if (error) {
    console.error("Booking update error:", error)
    return { success: false, error: error.message }
  }
  
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteBooking(id: number) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  
  const { error } = await supabase.from('bookings').delete().eq('id', id)

  if (error) {
    console.error("Booking deletion error:", error)
    return { success: false, error: error.message }
  }
  
  revalidatePath('/dashboard')
  return { success: true }
}

export async function getOrders() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (
          name,
          image_url
        )
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching orders:', error)
    return []
  }

  return data
}

export async function updateOrderStatus(orderId: string, status: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)

  if (error) {
    console.error('Error updating order status:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
