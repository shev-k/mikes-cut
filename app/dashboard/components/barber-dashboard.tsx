import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { getBarberStats } from '@/app/dashboard/actions'
import { BarberStatsView } from './barber-stats-view'
import { BarberCalendar } from './barber-calendar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export async function BarberDashboard({ userId }: { userId: string }) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

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

  // Fetch stats using the new server action logic
  const stats = await getBarberStats(barber.id)

  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select(`
      *,
      services (
        name,
        price
      )
    `)
    .eq('barber_id', barber.id)
    .order('booking_date', { ascending: true })
    .order('booking_time', { ascending: true })

  if (bookingsError) {
    console.error('Error fetching bookings for calendar:', bookingsError)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back, {barber.name}</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <BarberStatsView stats={stats} />
        </TabsContent>
        
        <TabsContent value="calendar">
           <BarberCalendar bookings={bookings || []} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
