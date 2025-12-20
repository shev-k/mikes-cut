"use client"

import { useState } from "react"
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO, setHours, setMinutes, isWithinInterval, addMinutes } from "date-fns"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Booking {
  id: number
  booking_date: string
  booking_time: string
  customer_name: string
  customer_phone: string
  status: string
  services: {
    name: string
    duration_minutes: number
    price: number
  }
}

interface BarberCalendarProps {
  bookings: Booking[]
}

export function BarberCalendar({ bookings }: BarberCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"day" | "week">("day")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const timeSlots = Array.from({ length: 13 }, (_, i) => i + 9) // 9 AM to 9 PM

  const navigate = (direction: "prev" | "next") => {
    if (viewMode === "day") {
      setCurrentDate(addDays(currentDate, direction === "next" ? 1 : -1))
    } else {
      setCurrentDate(addDays(currentDate, direction === "next" ? 7 : -7))
    }
  }

  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentDate, { weekStartsOn: 1 }),
    end: endOfWeek(currentDate, { weekStartsOn: 1 }),
  })

  const getBookingsForSlot = (date: Date, hour: number) => {
    return bookings.filter((booking) => {
      const bookingDate = parseISO(booking.booking_date)
      const [bookingHour, bookingMinute] = booking.booking_time.split(":").map(Number)
      
      // Check if booking is on the same day
      if (!isSameDay(date, bookingDate)) return false

      // Check if booking starts in this hour
      if (bookingHour === hour) return true

      // Check if booking spans across this hour
      const duration = booking.services?.duration_minutes || 30
      const bookingStart = setMinutes(setHours(bookingDate, bookingHour), bookingMinute)
      const bookingEnd = addMinutes(bookingStart, duration)
      const slotStart = setMinutes(setHours(date, hour), 0)
      const slotEnd = addMinutes(slotStart, 60)

      return isWithinInterval(slotStart, { start: bookingStart, end: addMinutes(bookingEnd, -1) })
    })
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 pb-4">
          <div className="flex items-center space-x-4">
            <CardTitle className="text-xl font-bold">
              {viewMode === "day" 
                ? format(currentDate, "EEEE, MMMM d, yyyy")
                : `Week of ${format(weekDays[0], "MMM d")} - ${format(weekDays[6], "MMM d, yyyy")}`
              }
            </CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={viewMode} onValueChange={(v: "day" | "week") => setViewMode(v)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day View</SelectItem>
                <SelectItem value="week">Week View</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center border rounded-md">
              <Button variant="ghost" size="icon" onClick={() => navigate("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setCurrentDate(new Date())}>
                <CalendarIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigate("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {viewMode === "day" ? (
            <div className="min-w-[300px]">
              {timeSlots.map((hour) => {
                const slotBookings = getBookingsForSlot(currentDate, hour)
                return (
                  <div key={hour} className="flex border-b last:border-0 min-h-[100px]">
                    <div className="w-20 p-4 border-r text-sm text-muted-foreground font-medium bg-muted/20">
                      {format(setHours(new Date(), hour), "h a")}
                    </div>
                    <div className="flex-1 p-2 relative">
                      {slotBookings.map((booking) => (
                        <div
                          key={booking.id}
                          onClick={() => {
                            setSelectedBooking(booking)
                            setIsDialogOpen(true)
                          }}
                          className={cn(
                            "mb-2 p-3 rounded-md border text-sm shadow-sm transition-colors cursor-pointer hover:opacity-90",
                            booking.status === "confirmed" 
                              ? "bg-accent/10 border-accent text-accent-foreground" 
                              : "bg-muted border-border text-muted-foreground"
                          )}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-bold">{booking.booking_time.slice(0, 5)}</span>
                            <Badge variant={booking.status === "confirmed" ? "default" : "secondary"} className="text-[10px] h-5">
                              {booking.status}
                            </Badge>
                          </div>
                          <div className="font-bold truncate">{booking.customer_name}</div>
                          <div className="text-xs opacity-80 truncate">{booking.services?.name}</div>
                          <div className="text-xs opacity-70 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {booking.services?.duration_minutes} min
                          </div>
                        </div>
                      ))}
                      {slotBookings.length === 0 && (
                        <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground/30 font-medium uppercase tracking-widest">
                          Available
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="min-w-[800px]">
              <div className="grid grid-cols-8 border-b bg-muted/40">
                <div className="p-4 border-r font-medium text-sm text-muted-foreground">Time</div>
                {weekDays.map((day) => (
                  <div 
                    key={day.toString()} 
                    className={cn(
                      "p-4 text-center border-r last:border-0 font-medium text-sm",
                      isSameDay(day, new Date()) && "bg-accent/10 text-accent"
                    )}
                  >
                    <div className="opacity-70 text-xs uppercase mb-1">{format(day, "EEE")}</div>
                    <div className="text-lg">{format(day, "d")}</div>
                  </div>
                ))}
              </div>
              {timeSlots.map((hour) => (
                <div key={hour} className="grid grid-cols-8 border-b last:border-0 min-h-[80px]">
                  <div className="p-2 border-r text-xs text-muted-foreground font-medium flex items-center justify-center bg-muted/10">
                    {format(setHours(new Date(), hour), "h a")}
                  </div>
                  {weekDays.map((day) => {
                    const slotBookings = getBookingsForSlot(day, hour)
                    return (
                      <div key={day.toString()} className="p-1 border-r last:border-0 relative group hover:bg-muted/5 transition-colors">
                        {slotBookings.map((booking) => (
                          <div
                            key={booking.id}
                            onClick={() => {
                              setSelectedBooking(booking)
                              setIsDialogOpen(true)
                            }}
                            className={cn(
                              "p-1.5 rounded text-xs mb-1 cursor-pointer hover:opacity-80 transition-opacity",
                              booking.status === "confirmed" 
                                ? "bg-accent text-accent-foreground" 
                                : "bg-secondary text-secondary-foreground"
                            )}
                            title={`${booking.customer_name} - ${booking.services?.name}`}
                          >
                            <div className="font-bold truncate">{booking.booking_time.slice(0, 5)}</div>
                            <div className="truncate">{booking.customer_name}</div>
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              View details for this appointment.
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-bold text-right">Customer:</span>
                <span className="col-span-3">{selectedBooking.customer_name}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-bold text-right">Phone:</span>
                <span className="col-span-3">{selectedBooking.customer_phone}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-bold text-right">Service:</span>
                <span className="col-span-3">{selectedBooking.services?.name}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-bold text-right">Date:</span>
                <span className="col-span-3">{format(parseISO(selectedBooking.booking_date), "MMMM d, yyyy")}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-bold text-right">Time:</span>
                <span className="col-span-3">{selectedBooking.booking_time} ({selectedBooking.services?.duration_minutes} min)</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-bold text-right">Price:</span>
                <span className="col-span-3">${selectedBooking.services?.price}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-bold text-right">Status:</span>
                <span className="col-span-3">
                  <Badge variant={selectedBooking.status === "confirmed" ? "default" : "secondary"}>
                    {selectedBooking.status}
                  </Badge>
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
