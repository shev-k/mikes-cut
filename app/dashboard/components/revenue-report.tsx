"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { TrendingUp } from "lucide-react"
import { format } from "date-fns"
import { getAdminStats } from "@/app/dashboard/actions"

interface RevenueReportProps {
  trigger?: React.ReactNode
}

export function RevenueReport({ trigger }: RevenueReportProps) {
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setYear] = useState(new Date().getFullYear())
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      loadStats()
    }
  }, [open, month, year])

  async function loadStats() {
    setLoading(true)
    const data = await getAdminStats(month, year)
    setStats(data)
    setLoading(false)
  }

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">View Report</div>
              <p className="text-xs text-muted-foreground">Click to analyze</p>
            </CardContent>
          </Card>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Revenue Report</DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 mb-6">
          <Select value={month.toString()} onValueChange={(v) => setMonth(parseInt(v))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((m, i) => (
                <SelectItem key={i} value={i.toString()}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={year.toString()} onValueChange={(v) => setYear(parseInt(v))}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="py-10 text-center">Loading report...</div>
        ) : stats ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">For {months[month]} {year}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalBookings}</div>
                  <p className="text-xs text-muted-foreground">In selected month</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Daily Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-end gap-1 w-full overflow-x-auto pt-4">
                  {stats.dailyRevenueChart.map((day: any) => {
                    const maxRevenue = Math.max(...stats.dailyRevenueChart.map((d: any) => d.amount), 100)
                    const heightPercentage = (day.amount / maxRevenue) * 100
                    return (
                      <div key={day.date} className="flex-1 min-w-[20px] flex flex-col items-center group relative">
                        <div 
                          className="w-full bg-primary/80 hover:bg-primary transition-all rounded-t-sm"
                          style={{ height: `${Math.max(heightPercentage, 2)}%` }}
                        ></div>
                        <div className="absolute bottom-full mb-2 hidden group-hover:block bg-popover text-popover-foreground text-xs p-2 rounded shadow-lg whitespace-nowrap z-10">
                          <div className="font-bold">{format(parseISO(day.date), 'MMM d')}</div>
                          <div>${day.amount}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="py-10 text-center text-destructive">Failed to load data</div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function parseISO(dateString: string) {
  const b = dateString.split(/\D+/)
  return new Date(Date.UTC(Number(b[0]), Number(b[1]) - 1, Number(b[2])))
}
