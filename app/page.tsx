import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Scissors, Axe, Flame, ShoppingBag } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('/dark-moody-barbershop-interior-with-leather-chairs.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-background/80" />
        </div>

        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-wider text-primary mb-6 text-balance">
            MIKE'S CUT
          </h1>
          <p className="text-xl md:text-2xl text-foreground mb-4 tracking-wide">HARDCORE BARBERSHOP</p>
          <p
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {"Where tradition meets edge. We cut with knives and axes because real craftsmanship demands real tools."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold tracking-wide text-lg px-8 py-6"
            >
              <Link href="/booking">BOOK YOUR CUT</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold tracking-wide text-lg px-8 py-6 bg-transparent"
            >
              <Link href="/shop">SHOP NOW</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-bold tracking-wider text-center text-primary mb-4">
            THE EXPERIENCE
          </h2>
          <p
            className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {"Not your average haircut. This is an experience in traditional masculine grooming."}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 bg-secondary border-border hover:border-accent transition-colors">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                  <Scissors className="w-8 h-8 text-accent" />
                </div>
              </div>
              <h3 className="text-2xl font-bold tracking-wide text-center text-foreground mb-4">KNIFE CUTS</h3>
              <p
                className="text-center text-muted-foreground leading-relaxed"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {"Precision cutting with traditional straight razors and knives. The way it was meant to be done."}
              </p>
            </Card>

            <Card className="p-8 bg-secondary border-border hover:border-accent transition-colors">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                  <Axe className="w-8 h-8 text-accent" />
                </div>
              </div>
              <h3 className="text-2xl font-bold tracking-wide text-center text-foreground mb-4">AXE STYLING</h3>
              <p
                className="text-center text-muted-foreground leading-relaxed"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {"Our signature technique. Bold, precise, and unforgettable. Only for the brave."}
              </p>
            </Card>

            <Card className="p-8 bg-secondary border-border hover:border-accent transition-colors">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                  <Flame className="w-8 h-8 text-accent" />
                </div>
              </div>
              <h3 className="text-2xl font-bold tracking-wide text-center text-foreground mb-4">HOT TOWEL SHAVE</h3>
              <p
                className="text-center text-muted-foreground leading-relaxed"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {"Traditional hot towel treatment followed by a close shave. Relaxation meets precision."}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold tracking-wider text-primary mb-6">ABOUT MIKE'S CUT</h2>
              <p
                className="text-muted-foreground mb-6 leading-relaxed text-lg"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {
                  "Founded by Mike \"The Blade\" Johnson, Mike's Cut isn't just a barbershop—it's a statement. We believe in the lost art of traditional grooming, where skill, precision, and craftsmanship matter."
                }
              </p>
              <p
                className="text-muted-foreground mb-6 leading-relaxed text-lg"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {
                  "Our barbers are trained in traditional techniques passed down through generations. We use knives and axes not as a gimmick, but as tools of precision that demand respect and skill."
                }
              </p>
              <Button
                asChild
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold tracking-wide"
              >
                <Link href="/barbers">MEET THE BARBERS</Link>
              </Button>
            </div>
            <div className="relative h-[500px] rounded-lg overflow-hidden">
              <img
                src="/tough-bearded-barber-with-tattoos-holding-straight.jpg"
                alt="Mike's Cut Barbershop"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Shop Teaser */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-bold tracking-wider text-primary mb-4">THE SHOP</h2>
            <p
              className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-lg"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {"Premium steaks, grills, and men's grooming products. Because a real man needs quality tools."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="overflow-hidden bg-secondary border-border hover:border-accent transition-colors group">
              <div className="relative h-64">
                <img
                  src="/premium-raw-ribeye-steak-on-dark-background.jpg"
                  alt="Premium Steaks"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold tracking-wide text-foreground mb-2">PREMIUM STEAKS</h3>
                <p className="text-muted-foreground leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                  {"Hand-selected cuts for the discerning carnivore."}
                </p>
              </div>
            </Card>

            <Card className="overflow-hidden bg-secondary border-border hover:border-accent transition-colors group">
              <div className="relative h-64">
                <img
                  src="/professional-charcoal-grill-on-dark-background.jpg"
                  alt="Grills"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold tracking-wide text-foreground mb-2">GRILLS & TOOLS</h3>
                <p className="text-muted-foreground leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                  {"Professional-grade equipment for the backyard pitmaster."}
                </p>
              </div>
            </Card>

            <Card className="overflow-hidden bg-secondary border-border hover:border-accent transition-colors group">
              <div className="relative h-64">
                <img
                  src="/luxury-mens-grooming-products-beard-oil-on-dark-wo.jpg"
                  alt="Men's Products"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold tracking-wide text-foreground mb-2">MEN'S PRODUCTS</h3>
                <p className="text-muted-foreground leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                  {"Premium grooming essentials for the modern gentleman."}
                </p>
              </div>
            </Card>
          </div>

          <div className="text-center">
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold tracking-wide"
            >
              <Link href="/shop">
                <ShoppingBag className="mr-2 h-5 w-5" />
                BROWSE SHOP
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
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

        <div className="container mx-auto px-4 z-10 relative text-center">
          <h2 className="text-4xl md:text-6xl font-bold tracking-wider text-primary mb-6 text-balance">
            READY FOR THE REAL DEAL?
          </h2>
          <p
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {"Book your appointment today and experience what a real haircut should be."}
          </p>
          <Button
            asChild
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold tracking-wide text-lg px-8 py-6"
          >
            <Link href="/booking">BOOK NOW</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
