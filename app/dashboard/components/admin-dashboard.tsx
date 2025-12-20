"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users } from "lucide-react"
import { getAdminStats } from "../actions"
import { format } from "date-fns"
import { RevenueReport } from "./revenue-report"
import { BarberManagement } from "./barber-management"
import { BookingsList } from "./bookings-list"
import { ServiceManagement } from "./service-management"
import { ProductManagement } from "./product-management"
import { AdminCalendar } from "./admin-calendar"
import { OrdersManagement } from "./orders-management"

interface AdminStats {
  totalRevenue: number
  monthlyRevenue: number
  todayRevenue: number
  totalBookings: number
}

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    const data = await getAdminStats()
    setStats(data)
    setLoading(false)
  }

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard data...</div>
  }

  if (!stats) {
    return <div className="p-8 text-center text-destructive">Failed to load dashboard data.</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
      </div>

      {/* Command Center Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        
        {/* 1. Total Revenue (Static) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Lifetime earnings</p>
          </CardContent>
        </Card>

        {/* 2. Monthly Revenue (Clickable -> Report) */}
        <RevenueReport 
          trigger={
            <Card className="cursor-pointer hover:bg-accent/50 transition-colors border-primary/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-primary">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Click for detailed report</p>
              </CardContent>
            </Card>
          }
        />

        {/* 3. Today's Revenue (Static) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.todayRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{format(new Date(), 'MMMM d, yyyy')}</p>
          </CardContent>
        </Card>

        {/* 4. Total Bookings (Clickable -> List) */}
        <BookingsList />

        {/* 5. Shop Orders (Clickable -> Dialog) */}
        <OrdersManagement />

        {/* 6. Manage Barbers (Clickable -> Dialog) */}
        <BarberManagement />

        {/* 7. Manage Services (Clickable -> Dialog) */}
        <ServiceManagement />

        {/* 7. Manage Products (Clickable -> Dialog) */}
        <ProductManagement />

      </div>

      {/* Booking Calendar */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Booking Calendar</h2>
        <AdminCalendar />
      </div>
    </div>
  )
}
