"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Flame, Beef, Drill as Grill } from "lucide-react"

const categories = [
  { id: "all", name: "ALL PRODUCTS", icon: ShoppingCart },
  { id: "steaks", name: "STEAKS", icon: Beef },
  { id: "grills", name: "GRILLS & TOOLS", icon: Grill },
  { id: "grooming", name: "GROOMING", icon: Flame },
]

const products = [
  {
    id: 1,
    name: "PRIME RIBEYE STEAK",
    category: "steaks",
    price: "$45.99",
    image: "/premium-raw-ribeye-steak-on-dark-background.jpg",
    description: "Hand-selected 16oz prime ribeye, aged to perfection",
  },
  {
    id: 2,
    name: "TOMAHAWK STEAK",
    category: "steaks",
    price: "$89.99",
    image: "/large-tomahawk-steak-on-dark-rustic-background.jpg",
    description: "Massive 32oz bone-in ribeye for the serious carnivore",
  },
  {
    id: 3,
    name: "NEW YORK STRIP",
    category: "steaks",
    price: "$38.99",
    image: "/new-york-strip-steak-on-dark-wooden-board.jpg",
    description: "Classic 14oz strip steak with perfect marbling",
  },
  {
    id: 4,
    name: "FILET MIGNON",
    category: "steaks",
    price: "$52.99",
    image: "/tender-filet-mignon-on-dark-slate-plate.jpg",
    description: "Tender 8oz center-cut filet, butter soft",
  },
  {
    id: 5,
    name: "PROFESSIONAL CHARCOAL GRILL",
    category: "grills",
    price: "$599.99",
    image: "/professional-charcoal-grill-on-dark-background.jpg",
    description: "Heavy-duty charcoal grill for serious grilling",
  },
  {
    id: 6,
    name: "CAST IRON GRILL SET",
    category: "grills",
    price: "$249.99",
    image: "/cast-iron-grill-grates-and-tools-on-dark-backgrou.jpg",
    description: "Professional-grade cast iron grates and tools",
  },
  {
    id: 7,
    name: "BUTCHER'S KNIFE SET",
    category: "grills",
    price: "$179.99",
    image: "/professional-butcher-knives-on-dark-leather.jpg",
    description: "Premium steel knives for meat preparation",
  },
  {
    id: 8,
    name: "SMOKING WOOD CHIPS",
    category: "grills",
    price: "$34.99",
    image: "/assorted-wood-chips-for-smoking-on-dark-backgroun.jpg",
    description: "Variety pack of premium smoking woods",
  },
  {
    id: 9,
    name: "BEARD OIL - SANDALWOOD",
    category: "grooming",
    price: "$29.99",
    image: "/luxury-mens-grooming-products-beard-oil-on-dark-wo.jpg",
    description: "Premium beard oil with sandalwood and cedar",
  },
  {
    id: 10,
    name: "STRAIGHT RAZOR KIT",
    category: "grooming",
    price: "$89.99",
    image: "/professional-straight-razor-kit-on-dark-leather.jpg",
    description: "Professional straight razor with leather strop",
  },
  {
    id: 11,
    name: "POMADE - STRONG HOLD",
    category: "grooming",
    price: "$24.99",
    image: "/mens-hair-pomade-on-dark-wooden-surface.jpg",
    description: "Water-based pomade with all-day hold",
  },
  {
    id: 12,
    name: "GROOMING TOOL SET",
    category: "grooming",
    price: "$64.99",
    image: "/mens-grooming-tools-scissors-comb-on-dark-backgro.jpg",
    description: "Complete grooming kit with scissors, comb, and brush",
  },
]

export function ProductGrid() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [cart, setCart] = useState<number[]>([])

  const filteredProducts =
    selectedCategory === "all" ? products : products.filter((p) => p.category === selectedCategory)

  const addToCart = (productId: number) => {
    setCart([...cart, productId])
  }

  return (
    <div>
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={
                selectedCategory === category.id
                  ? "bg-accent hover:bg-accent/90 text-accent-foreground font-bold tracking-wide"
                  : "border-2 border-border hover:border-accent font-bold tracking-wide"
              }
            >
              <Icon className="w-4 h-4 mr-2" />
              {category.name}
            </Button>
          )
        })}
      </div>

      {/* Shopping Cart Counter */}
      {cart.length > 0 && (
        <div className="fixed bottom-8 right-8 z-50">
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold tracking-wide shadow-lg relative">
            <ShoppingCart className="w-5 h-5 mr-2" />
            CART ({cart.length})
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs font-bold">
              {cart.length}
            </span>
          </Button>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card
            key={product.id}
            className="overflow-hidden bg-card border-border hover:border-accent transition-all duration-300 group"
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold tracking-wide text-foreground mb-2">{product.name}</h3>
              <p
                className="text-sm text-muted-foreground mb-4 leading-relaxed"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {product.description}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-accent">{product.price}</span>
                <Button
                  onClick={() => addToCart(product.id)}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold tracking-wide"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  ADD
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-2xl text-muted-foreground">No products found in this category.</p>
        </div>
      )}
    </div>
  )
}
