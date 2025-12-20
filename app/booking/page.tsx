import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BookingForm } from "@/components/booking-form"
import { getBarbers, getServices } from "./actions"

export default async function BookingPage() {
  const barbers = await getBarbers()
  const services = await getServices()

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center pt-20">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('/dark-barbershop-tools-knives-razors-on-leather-bac.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-background/85" />
        </div>

        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-6xl md:text-8xl font-bold tracking-wider text-primary mb-6 text-balance">
            BOOK YOUR CUT
          </h1>
          <p
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {"Choose your barber, pick your service, and experience what a real haircut should be."}
          </p>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <BookingForm barbers={barbers} services={services} />
        </div>
      </section>

      <Footer />
    </div>
  )
}
