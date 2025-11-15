"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="MIKE'S CUT" width={80} height={80} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors text-lg tracking-wide">
              HOME
            </Link>
            <Link
              href="/barbers"
              className="text-foreground hover:text-primary transition-colors text-lg tracking-wide"
            >
              OUR BARBERS
            </Link>
            <Link
              href="/booking"
              className="text-foreground hover:text-primary transition-colors text-lg tracking-wide"
            >
              BOOKING
            </Link>
            <Link href="/shop" className="text-foreground hover:text-primary transition-colors text-lg tracking-wide">
              SHOP
            </Link>
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold tracking-wide"
            >
              <Link href="/booking">BOOK NOW</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-foreground" aria-label="Toggle menu">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-foreground hover:text-primary transition-colors text-lg tracking-wide py-2"
                onClick={() => setIsOpen(false)}
              >
                HOME
              </Link>
              <Link
                href="/barbers"
                className="text-foreground hover:text-primary transition-colors text-lg tracking-wide py-2"
                onClick={() => setIsOpen(false)}
              >
                OUR BARBERS
              </Link>
              <Link
                href="/booking"
                className="text-foreground hover:text-primary transition-colors text-lg tracking-wide py-2"
                onClick={() => setIsOpen(false)}
              >
                BOOKING
              </Link>
              <Link
                href="/shop"
                className="text-foreground hover:text-primary transition-colors text-lg tracking-wide py-2"
                onClick={() => setIsOpen(false)}
              >
                SHOP
              </Link>
              <Button
                asChild
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold tracking-wide mt-2"
              >
                <Link href="/booking" onClick={() => setIsOpen(false)}>
                  BOOK NOW
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
