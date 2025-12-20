"use client"

import { useState, useEffect } from "react"
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO, setHours, setMinutes, isWithinInterval, addMinutes } from "date-fns"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { getAllBookings, getBarbersList, getServicesList, createBooking, updateBooking, deleteBooking } from "@/app/dashboard/actions"

interface Booking {
  id: number
  booking_date: string
  booking_time: string
  customer_name: string
  customer_email: string
  customer_phone: string
  status: string
  notes?: string
  barber_id: number
  service_id: number
  barbers: {
    id: number
    name: string
  }
  services: {
    id: number
    name: string
    duration: number
    price: number
  }
}

export function AdminCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"day" | "week">("week")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [barbers, setBarbers] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date, hour: number } | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    barber_id: 0,
    service_id: 0,
    booking_date: "",
    booking_time: "",
    notes: "",
    status: "confirmed"
  })

  const timeSlots = Array.from({ length: 13 }, (_, i) => i + 9) // 9 AM to 9 PM

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    const [bookingsData, barbersData, servicesData] = await Promise.all([
      getAllBookings(),
      getBarbersList(),
      getServicesList()
    ])
    setBookings(bookingsData)
    setBarbers(barbersData)
    setServices(servicesData)
    setLoading(false)
  }

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
      
      if (!isSameDay(date, bookingDate)) return false
      if (bookingHour === hour) return true

      const duration = booking.services?.duration || 30
      const bookingStart = setMinutes(setHours(bookingDate, bookingHour), bookingMinute)
      const bookingEnd = addMinutes(bookingStart, duration)
      const slotStart = setMinutes(setHours(date, hour), 0)
      const slotEnd = addMinutes(slotStart, 60)

      return isWithinInterval(slotStart, { start: bookingStart, end: addMinutes(bookingEnd, -1) })
    })
  }

  function handleSlotClick(date: Date, hour: number, booking?: Booking, forceNew?: boolean) {
    if (booking && !forceNew) {
      setSelectedBooking(booking)
      setIsViewDialogOpen(true)
    } else {
      setSelectedSlot({ date, hour })
      setSelectedBooking(null)
      setFormData({
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        barber_id: barbers[0]?.id || 0,
        service_id: services[0]?.id || 0,
        booking_date: format(date, "yyyy-MM-dd"),
        booking_time: `${hour.toString().padStart(2, '0')}:00`,
        notes: "",
        status: "confirmed"
      })
      setIsEditDialogOpen(true)
    }
  }

  function handleEditClick() {
    if (!selectedBooking) return
    setFormData({
      customer_name: selectedBooking.customer_name,
      customer_email: selectedBooking.customer_email,
      customer_phone: selectedBooking.customer_phone,
      barber_id: selectedBooking.barber_id,
      service_id: selectedBooking.service_id,
      booking_date: selectedBooking.booking_date,
      booking_time: selectedBooking.booking_time,
      notes: selectedBooking.notes || "",
      status: selectedBooking.status
    })
    setIsViewDialogOpen(false)
    setIsEditDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    const result = selectedBooking
      ? await updateBooking(selectedBooking.id, formData)
      : await createBooking(formData)
    
    if (result.success) {
      toast({
        title: selectedBooking ? "Booking Updated" : "Booking Created",
        description: "The booking has been saved successfully.",
      })
      setIsEditDialogOpen(false)
      setSelectedBooking(null)
      await loadData()
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to save booking.",
        variant: "destructive",
      })
    }
  }

  async function handleDelete() {
    if (!selectedBooking) return
    
    const result = await deleteBooking(selectedBooking.id)
    
    if (result.success) {
      toast({
        title: "Booking Deleted",
        description: "The booking has been deleted successfully.",
      })
      setIsDeleteDialogOpen(false)
      setIsViewDialogOpen(false)
      setSelectedBooking(null)
      await loadData()
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete booking.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading calendar...</div>
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
          {viewMode === "week" && (
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
                <div key={hour} className="grid grid-cols-8 border-b last:border-0 min-h-20">
                  <div className="p-2 border-r text-xs text-muted-foreground font-medium flex items-center justify-center bg-muted/10">
                    {format(setHours(new Date(), hour), "h a")}
                  </div>
                  {weekDays.map((day) => {
                    const slotBookings = getBookingsForSlot(day, hour)
                    return (
                      <div 
                        key={day.toString()} 
                        className="p-1 border-r last:border-0 relative group hover:bg-muted/5 transition-colors"
                      >
                        {slotBookings.map((booking) => (
                          <div
                            key={booking.id}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSlotClick(day, hour, booking)
                            }}
                            className={cn(
                              "p-1.5 rounded text-xs mb-1 cursor-pointer hover:opacity-80 transition-opacity",
                              booking.status === "confirmed" 
                                ? "bg-accent text-accent-foreground" 
                                : "bg-muted border border-border text-foreground"
                            )}
                          >
                            <div className="font-bold truncate text-[10px]">{booking.booking_time.slice(0, 5)}</div>
                            <div className="font-semibold truncate">{booking.customer_name}</div>
                            <div className="opacity-80 truncate">{booking.barbers?.name}</div>
                          </div>
                        ))}
                        <div 
                          className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSlotClick(day, hour, undefined, true)
                          }}
                        >
                          <div className="bg-primary text-primary-foreground rounded-full p-1 hover:bg-primary/80">
                            <Plus className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Booking Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground text-xs">Customer</Label>
                <p className="font-semibold">{selectedBooking.customer_name}</p>
                <p className="text-sm text-muted-foreground">{selectedBooking.customer_email}</p>
                <p className="text-sm text-muted-foreground">{selectedBooking.customer_phone}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Date</Label>
                  <p className="font-semibold">{format(parseISO(selectedBooking.booking_date), "MMM d, yyyy")}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Time</Label>
                  <p className="font-semibold">{selectedBooking.booking_time}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Barber</Label>
                <p className="font-semibold">{selectedBooking.barbers?.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Service</Label>
                <p className="font-semibold">{selectedBooking.services?.name}</p>
                <p className="text-sm text-muted-foreground">{selectedBooking.services?.duration} min • ${selectedBooking.services?.price}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Status</Label>
                <Badge variant={selectedBooking.status === "confirmed" ? "default" : "secondary"}>
                  {selectedBooking.status}
                </Badge>
              </div>
              {selectedBooking.notes && (
                <div>
                  <Label className="text-muted-foreground text-xs">Notes</Label>
                  <p className="text-sm">{selectedBooking.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
            <Button onClick={handleEditClick}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit/Create Booking Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedBooking ? "Edit Booking" : "New Booking"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer_name">Customer Name</Label>
                <Input
                  id="customer_name"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="customer_email">Email</Label>
                <Input
                  id="customer_email"
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="customer_phone">Phone</Label>
              <Input
                id="customer_phone"
                value={formData.customer_phone}
                onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="booking_date">Date</Label>
                <Input
                  id="booking_date"
                  type="date"
                  value={formData.booking_date}
                  onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="booking_time">Time</Label>
                <Input
                  id="booking_time"
                  type="time"
                  value={formData.booking_time}
                  onChange={(e) => setFormData({ ...formData, booking_time: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="barber_id">Barber</Label>
                <Select
                  value={formData.barber_id.toString()}
                  onValueChange={(v) => setFormData({ ...formData, barber_id: parseInt(v) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select barber" />
                  </SelectTrigger>
                  <SelectContent>
                    {barbers.map((barber) => (
                      <SelectItem key={barber.id} value={barber.id.toString()}>
                        {barber.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="service_id">Service</Label>
                <Select
                  value={formData.service_id.toString()}
                  onValueChange={(v) => setFormData({ ...formData, service_id: parseInt(v) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id.toString()}>
                        {service.name} (${service.price})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(v) => setFormData({ ...formData, status: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {selectedBooking ? "Update Booking" : "Create Booking"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Booking?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the booking for {selectedBooking?.customer_name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
