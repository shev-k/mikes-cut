"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Scissors, Axe, Flame, Check } from "lucide-react"

const barbers = [
  {
    id: "mike",
    name: 'MIKE "THE BLADE"',
    title: "Founder & Master Barber",
    image: "/tough-bearded-barber-with-tattoos-holding-straight.jpg",
  },
  {
    id: "razor",
    name: "RAZOR RODRIGUEZ",
    title: "Senior Barber",
    image: "/hispanic-barber-with-tattoos-and-beard-in-dark-bar.jpg",
  },
  {
    id: "steel",
    name: "STEEL THOMPSON",
    title: "Master Stylist",
    image: "/muscular-bald-barber-with-tattoos-in-dark-barbersh.jpg",
  },
  {
    id: "blaze",
    name: "BLAZE MARTINEZ",
    title: "Traditional Specialist",
    image: "/young-latino-barber-with-styled-hair-and-tattoos-i.jpg",
  },
]

const services = [
  {
    id: "knife-cut",
    name: "KNIFE CUT",
    price: "$45",
    duration: "45 min",
    icon: Scissors,
    description: "Precision cutting with traditional straight razors",
  },
  {
    id: "axe-styling",
    name: "AXE STYLING",
    price: "$65",
    duration: "60 min",
    icon: Axe,
    description: "Our signature technique for the brave",
  },
  {
    id: "hot-towel-shave",
    name: "HOT TOWEL SHAVE",
    price: "$40",
    duration: "30 min",
    icon: Flame,
    description: "Traditional hot towel treatment and close shave",
  },
  {
    id: "full-service",
    name: "FULL SERVICE",
    price: "$95",
    duration: "90 min",
    icon: Check,
    description: "Complete grooming experience with cut and shave",
  },
]

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
]

export function BookingForm() {
  const [step, setStep] = useState(1)
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto p-12 bg-card border-accent text-center">
        <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-accent" />
        </div>
        <h2 className="text-4xl font-bold tracking-wider text-primary mb-4">BOOKING CONFIRMED</h2>
        <p className="text-lg text-muted-foreground mb-6 leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
          {"Your appointment has been confirmed. We'll send you a confirmation email shortly."}
        </p>
        <div className="bg-secondary p-6 rounded-lg mb-6 text-left">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">BARBER</p>
              <p className="text-foreground font-bold">{barbers.find((b) => b.id === selectedBarber)?.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">SERVICE</p>
              <p className="text-foreground font-bold">{services.find((s) => s.id === selectedService)?.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">DATE</p>
              <p className="text-foreground font-bold">{selectedDate?.toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">TIME</p>
              <p className="text-foreground font-bold">{selectedTime}</p>
            </div>
          </div>
        </div>
        <Button
          onClick={() => {
            setIsSubmitted(false)
            setStep(1)
            setSelectedBarber(null)
            setSelectedService(null)
            setSelectedDate(undefined)
            setSelectedTime(null)
            setCustomerInfo({ name: "", email: "", phone: "" })
          }}
          className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold tracking-wide"
        >
          BOOK ANOTHER APPOINTMENT
        </Button>
      </Card>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Steps */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center gap-4">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                  step >= num ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"
                }`}
              >
                {num}
              </div>
              {num < 4 && <div className={`w-16 h-1 ${step > num ? "bg-accent" : "bg-secondary"}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Select Barber */}
      {step === 1 && (
        <div>
          <h2 className="text-4xl font-bold tracking-wider text-primary mb-8 text-center">CHOOSE YOUR BARBER</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {barbers.map((barber) => (
              <Card
                key={barber.id}
                onClick={() => setSelectedBarber(barber.id)}
                className={`cursor-pointer overflow-hidden transition-all duration-300 ${
                  selectedBarber === barber.id
                    ? "border-accent ring-2 ring-accent"
                    : "border-border hover:border-accent"
                }`}
              >
                <div className="relative h-64">
                  <img
                    src={barber.image || "/placeholder.svg"}
                    alt={barber.name}
                    className="w-full h-full object-cover"
                  />
                  {selectedBarber === barber.id && (
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                      <Check className="w-5 h-5 text-accent-foreground" />
                    </div>
                  )}
                </div>
                <div className="p-4 bg-card">
                  <h3 className="text-lg font-bold tracking-wide text-foreground mb-1">{barber.name}</h3>
                  <p className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-inter)" }}>
                    {barber.title}
                  </p>
                </div>
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => setStep(2)}
              disabled={!selectedBarber}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold tracking-wide px-8"
            >
              CONTINUE
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Select Service */}
      {step === 2 && (
        <div>
          <h2 className="text-4xl font-bold tracking-wider text-primary mb-8 text-center">CHOOSE YOUR SERVICE</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <Card
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`cursor-pointer p-6 transition-all duration-300 ${
                    selectedService === service.id
                      ? "border-accent ring-2 ring-accent bg-secondary"
                      : "border-border hover:border-accent bg-card"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold tracking-wide text-foreground">{service.name}</h3>
                        {selectedService === service.id && <Check className="w-5 h-5 text-accent" />}
                      </div>
                      <p
                        className="text-sm text-muted-foreground mb-3 leading-relaxed"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {service.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-accent font-bold text-lg">{service.price}</span>
                        <span className="text-muted-foreground">{service.duration}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
          <div className="flex justify-center gap-4 mt-8">
            <Button
              onClick={() => setStep(1)}
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold tracking-wide px-8"
            >
              BACK
            </Button>
            <Button
              onClick={() => setStep(3)}
              disabled={!selectedService}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold tracking-wide px-8"
            >
              CONTINUE
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Select Date & Time */}
      {step === 3 && (
        <div>
          <h2 className="text-4xl font-bold tracking-wider text-primary mb-8 text-center">PICK DATE & TIME</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 bg-card border-border">
              <h3 className="text-xl font-bold tracking-wide text-foreground mb-4">SELECT DATE</h3>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date() || date.getDay() === 0}
                className="rounded-md border-0"
              />
            </Card>

            <Card className="p-6 bg-card border-border">
              <h3 className="text-xl font-bold tracking-wide text-foreground mb-4">SELECT TIME</h3>
              <div className="grid grid-cols-2 gap-3">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    variant={selectedTime === time ? "default" : "outline"}
                    className={
                      selectedTime === time
                        ? "bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
                        : "border-border hover:border-accent font-bold"
                    }
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </Card>
          </div>
          <div className="flex justify-center gap-4 mt-8">
            <Button
              onClick={() => setStep(2)}
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold tracking-wide px-8"
            >
              BACK
            </Button>
            <Button
              onClick={() => setStep(4)}
              disabled={!selectedDate || !selectedTime}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold tracking-wide px-8"
            >
              CONTINUE
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Customer Info */}
      {step === 4 && (
        <div>
          <h2 className="text-4xl font-bold tracking-wider text-primary mb-8 text-center">YOUR INFORMATION</h2>
          <Card className="max-w-2xl mx-auto p-8 bg-card border-border">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-foreground font-bold tracking-wide mb-2 block">
                  FULL NAME
                </Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  className="bg-secondary border-border text-foreground"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-foreground font-bold tracking-wide mb-2 block">
                  EMAIL
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  className="bg-secondary border-border text-foreground"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-foreground font-bold tracking-wide mb-2 block">
                  PHONE NUMBER
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  className="bg-secondary border-border text-foreground"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="bg-secondary p-6 rounded-lg">
                <h3 className="text-lg font-bold tracking-wide text-foreground mb-4">BOOKING SUMMARY</h3>
                <div className="space-y-3 text-sm" style={{ fontFamily: "var(--font-inter)" }}>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Barber:</span>
                    <span className="text-foreground font-bold">
                      {barbers.find((b) => b.id === selectedBarber)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service:</span>
                    <span className="text-foreground font-bold">
                      {services.find((s) => s.id === selectedService)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="text-foreground font-bold">{selectedDate?.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="text-foreground font-bold">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-border">
                    <span className="text-foreground font-bold">Total:</span>
                    <span className="text-accent font-bold text-lg">
                      {services.find((s) => s.id === selectedService)?.price}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  onClick={() => setStep(3)}
                  variant="outline"
                  className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold tracking-wide"
                >
                  BACK
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-bold tracking-wide"
                >
                  CONFIRM BOOKING
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
