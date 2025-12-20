import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock } from "lucide-react"
import { BarberCalendar } from './barber-calendar'

export async function BarberDashboard({ userId }: { userId: string }) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Fetch bookings for this barber only
  // The RLS policy "Employees view own bookings" will automatically filter this,
  // but we can also filter explicitly to be safe/clear.
  // However, since we are using the service role or just authenticated user, 
  // let's rely on RLS or join with the barber table to get the barber ID first.
  
  // First, get the barber ID for this user
  const { data: barber } = await supabase
    .from('barbers')
    .select('id, name')
    .eq('user_id', userId)
    .single()

  if (!barber) {
    return (
      <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/10 text-destructive">
        Error: No barber profile linked to this user account. Please contact admin.
      </div>
    )
  }

  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      services (
        name,
        duration_minutes,
        price
      )
    `)
    .eq('barber_id', barber.id) // Explicit filter
    .order('booking_date', { ascending: true })
    .order('booking_time', { ascending: true })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Welcome, {barber.name}</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Schedule</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bookings?.filter(b => new Date(b.booking_date).toDateString() === new Date().toDateString()).length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <BarberCalendar bookings={bookings || []} />
    </div>
  )
}
