"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, DollarSign, Calendar as CalendarIcon, Scissors, TrendingUp, Trophy } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell, Legend } from "recharts"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface BarberStatsProps {
  stats: any
}

export function BarberStatsView({ stats }: BarberStatsProps) {
  if (!stats) return <div className="p-4 text-center text-muted-foreground">No data available yet</div>

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      
      {/* 1. Key Metrics Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.thisMonthEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.thisMonthEarnings > 0 ? "+10% from last month" : "Start earning today"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distinct Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueClients}</div>
            <p className="text-xs text-muted-foreground">
              Total unique customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month Bookings</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisMonthBookings}</div>
             <p className="text-xs text-muted-foreground">
              Appointments this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime earnings
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* 2. Monthly Revenue Chart (Feature 1) */}
        <Card className="col-span-full lg:col-span-4">
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
            <CardDescription>Your earnings over the last 12 months</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.monthlyRevenueData}>
                  <XAxis 
                    dataKey="date" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => {
                      const [y, m] = value.split('-')
                      const date = new Date(parseInt(y), parseInt(m) - 1)
                      return format(date, 'MMM')
                    }}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="revenue" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 3. Top Clients (Feature 2) */}
        <Card className="col-span-full lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Top Clients
            </CardTitle>
            <CardDescription>Your most loyal customers</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {stats.topClients.map((client: any, i: number) => (
                  <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div className="space-y-1">
                      <p className="font-medium leading-none">{client.name}</p>
                      <p className="text-xs text-muted-foreground">{client.bookings} visits</p>
                    </div>
                    <div className="font-bold text-sm">
                      ${client.revenue}
                    </div>
                  </div>
                ))}
                {stats.topClients.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">No client data yet</div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* 4. Upcoming & Top Services Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        
        {/* Service Performance (Feature 3) */}
        <Card>
          <CardHeader>
            <CardTitle>Top Services</CardTitle>
            <CardDescription>Breakdown by service type</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="h-[250px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={stats.topServices}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={80}
                     paddingAngle={5}
                     dataKey="count"
                   >
                     {stats.topServices.map((entry: any, index: number) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Pie>
                   <Tooltip />
                   <Legend />
                 </PieChart>
               </ResponsiveContainer>
             </div>
             <div className="mt-4 space-y-2">
                {stats.topServices.slice(0, 3).map((service: any, i: number) => (
                   <div key={i} className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }}></span>
                        {service.name}
                      </span>
                      <span className="font-medium">{service.count} ({Math.round(service.count/stats.totalBookings*100)}%)</span>
                   </div>
                ))}
             </div>
          </CardContent>
        </Card>

        {/* Upcoming Bookings List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Upcoming Schedule</span>
              <Badge variant="secondary">{stats.upcomingBookings.length} pending</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {stats.upcomingBookings.length > 0 ? (
                  stats.upcomingBookings.map((booking: any) => (
                    <div key={booking.id} className="flex items-start justify-between p-3 bg-muted/40 rounded-lg">
                      <div className="space-y-1">
                        <h4 className="font-semibold text-sm flex items-center gap-2">
                          {format(new Date(booking.booking_date), 'EEE, MMM d')} 
                          <span className="text-muted-foreground font-normal">at</span> 
                          {booking.booking_time.slice(0, 5)}
                        </h4>
                        <p className="text-sm">{booking.customer_name}</p>
                        <Badge variant="outline" className="text-xs bg-background">
                          {booking.services?.name}
                        </Badge>
                      </div>
                      <div className="text-right">
                         <div className="font-bold text-primary">${booking.services?.price}</div>
                         <Button variant="ghost" size="sm" className="h-6 text-xs mt-2">
                           View
                         </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-8 text-center text-muted-foreground">
                    <CalendarIcon className="h-8 w-8 mb-2 opacity-20" />
                    <p>No upcoming bookings found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
