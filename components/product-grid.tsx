"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import type { Product, Category } from "@/app/shop/actions"
import { useCart } from "@/components/cart-provider"

interface ProductGridProps {
  products: Product[]
  categories: Category[]
}

export function ProductGrid({ products, categories }: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const { addItem } = useCart()

  const filteredProducts =
    selectedCategory === "all" 
      ? products 
      : products.filter((p) => p.category_id === parseInt(selectedCategory))

  return (
    <div>
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        <Button
          onClick={() => setSelectedCategory("all")}
          variant={selectedCategory === "all" ? "default" : "outline"}
          className={
            selectedCategory === "all"
              ? "bg-accent hover:bg-accent/90 text-accent-foreground font-bold tracking-wide"
              : "border-2 border-border hover:border-accent font-bold tracking-wide"
          }
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          ALL PRODUCTS
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            onClick={() => setSelectedCategory(category.id.toString())}
            variant={selectedCategory === category.id.toString() ? "default" : "outline"}
            className={
              selectedCategory === category.id.toString()
                ? "bg-accent hover:bg-accent/90 text-accent-foreground font-bold tracking-wide"
                : "border-2 border-border hover:border-accent font-bold tracking-wide"
            }
          >
            {category.name.toUpperCase()}
          </Button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card
            key={product.id}
            className="overflow-hidden bg-card border-border hover:border-accent transition-all duration-300 group"
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                <span className="text-2xl font-bold text-accent">${product.price.toFixed(2)}</span>
                <Button
                  onClick={() => addItem(product)}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold tracking-wide"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  ADD TO CART
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

