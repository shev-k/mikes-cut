"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TrendingUp, Download } from "lucide-react"
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

  const downloadExcel = () => {
    if (!stats?.bookings) return

    const headers = ["Date", "Time", "Customer", "Barber", "Service", "Price", "Status"]
    const rows = stats.bookings.map((b: any) => [
      b.booking_date,
      b.booking_time,
      b.customer_name,
      b.barbers?.name || "Unknown",
      b.services?.name || "Unknown",
      b.price,
      b.status
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((row: any[]) => row.map(cell => `"${cell || ''}"`).join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `revenue-report-${months[month]}-${year}.csv`
    link.click()
  }

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
      <DialogContent className="max-w-[98vw]! w-[98vw]! max-h-[98vh] overflow-y-auto p-8">
        <DialogHeader>
          <DialogTitle className="text-3xl">Revenue Report</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 mt-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex gap-4">
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
            
            <Button onClick={downloadExcel} variant="outline" disabled={!stats?.bookings?.length}>
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
          </div>

          {loading ? (
            <div className="py-10 text-center">Loading report...</div>
          ) : stats ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">For {months[month]} {year}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Monthly Bookings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalBookings}</div>
                    <p className="text-xs text-muted-foreground">In selected month</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Detailed Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Barber</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats.bookings?.length > 0 ? (
                        stats.bookings.map((booking: any) => (
                          <TableRow key={booking.id}>
                            <TableCell>{format(new Date(booking.booking_date), 'MMM d, yyyy')}</TableCell>
                            <TableCell>{booking.booking_time}</TableCell>
                            <TableCell>{booking.customer_name}</TableCell>
                            <TableCell>{booking.barbers?.name}</TableCell>
                            <TableCell>{booking.services?.name}</TableCell>
                            <TableCell className="text-right font-medium">${booking.price}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4">
                            No bookings found for this month
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="py-10 text-center text-destructive">Failed to load data</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

