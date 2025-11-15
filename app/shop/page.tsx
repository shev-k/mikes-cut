import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { ShoppingBag } from "lucide-react"

export default function ShopPage() {
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
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-accent" />
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-wider text-primary mb-6 text-balance">THE SHOP</h1>
          <p
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {"Premium steaks, professional grills, and men's grooming essentials. Quality tools for quality men."}
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <ProductGrid />
        </div>
      </section>

      <Footer />
    </div>
  )
}
