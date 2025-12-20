'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { sendBookingConfirmation } from '@/lib/resend'

export async function getBarbers() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data, error } = await supabase
    .from('barbers')
    .select('*')
    .order('name')
  
  if (error) {
    console.error('Error fetching barbers:', error)
    return []
  }
  
  return data
}

export async function getServices() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('price')
  
  if (error) {
    console.error('Error fetching services:', error)
    return []
  }
  
  return data
}

export async function getUnavailableSlots(barberId: number, date: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from('bookings')
    .select('booking_time')
    .eq('barber_id', barberId)
    .eq('booking_date', date)
    .neq('status', 'cancelled')

  if (error) {
    console.error('Error fetching unavailable slots:', error)
    return []
  }

  return data.map((booking) => booking.booking_time)
}

export async function createBooking(formData: any) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  
  console.log('Received booking request:', formData)

  const {
    barberId,
    serviceId,
    date,
    time,
    customerName,
    customerEmail,
    customerPhone
  } = formData

  // Convert 12h time to 24h time for Postgres
  const [timePart, modifier] = time.split(' ')
  let [hours, minutes] = timePart.split(':')
  let h = parseInt(hours, 10)
  if (modifier === 'PM' && h !== 12) {
    h += 12
  } else if (modifier === 'AM' && h === 12) {
    h = 0
  }
  const formattedTime = `${h.toString().padStart(2, '0')}:${minutes}:00`

  // Check for existing booking
  const { data: existingBookings, error: checkError } = await supabase
    .from('bookings')
    .select('id')
    .eq('barber_id', parseInt(barberId))
    .eq('booking_date', date)
    .eq('booking_time', formattedTime)
    .neq('status', 'cancelled')

  if (checkError) {
    console.error('Error checking availability:', checkError)
    return { success: false, error: 'Failed to check availability' }
  }

  if (existingBookings && existingBookings.length > 0) {
    return { success: false, error: 'This time slot is already booked. Please choose another time.' }
  }

  const { data, error } = await supabase
    .from('bookings')
    .insert([
      {
        barber_id: parseInt(barberId),
        service_id: parseInt(serviceId),
        booking_date: date,
        booking_time: formattedTime,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        status: 'confirmed'
      }
    ])
    .select()

  if (error) {
    console.error('Error creating booking:', error)
    return { success: false, error: error.message }
  }

  // Fetch barber and service details for the email
  const { data: barberData } = await supabase
    .from('barbers')
    .select('name')
    .eq('id', parseInt(barberId))
    .single()

  const { data: serviceData } = await supabase
    .from('services')
    .select('name, price')
    .eq('id', parseInt(serviceId))
    .single()

  // Send confirmation email (don't block booking if email fails)
  if (barberData && serviceData) {
    try {
      console.log('Attempting to send confirmation email to:', customerEmail)
      const emailResult = await sendBookingConfirmation({
        customerEmail,
        customerName,
        barberName: barberData.name,
        serviceName: serviceData.name,
        bookingDate: date,
        bookingTime: time, // Use original 12h format for email
        price: serviceData.price
      })
      
      if (emailResult.success) {
        console.log('Confirmation email sent successfully')
      } else {
        console.error('Failed to send confirmation email:', emailResult.error)
      }
    } catch (emailError) {
      console.error('Exception while sending confirmation email:', emailError)
      // Don't fail the booking if email fails
    }
  } else {
    console.warn('Missing barber or service data for email')
  }

  revalidatePath('/booking')
  return { success: true, data }
}
