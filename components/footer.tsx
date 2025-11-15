import Link from "next/link"
import { Instagram, Facebook, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold tracking-wider text-primary">MIKE'S CUT</h3>
            <p className="text-muted-foreground text-sm leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
              {"Where real men get cut. Traditional craftsmanship meets hardcore style."}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold tracking-wide text-foreground">QUICK LINKS</h4>
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Home
              </Link>
              <Link
                href="/barbers"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Our Barbers
              </Link>
              <Link
                href="/booking"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Booking
              </Link>
              <Link
                href="/shop"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Shop
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold tracking-wide text-foreground">CONTACT</h4>
            <div
              className="flex flex-col gap-2 text-muted-foreground text-sm"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              <p>{"123 Steel Street"}</p>
              <p>{"Downtown, City 12345"}</p>
              <p>{"Phone: (555) 123-4567"}</p>
              <p>{"Email: info@mikescut.com"}</p>
            </div>
          </div>

          {/* Hours & Social */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold tracking-wide text-foreground">HOURS</h4>
            <div
              className="flex flex-col gap-2 text-muted-foreground text-sm"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              <p>{"Mon-Fri: 9AM - 8PM"}</p>
              <p>{"Saturday: 9AM - 6PM"}</p>
              <p>{"Sunday: 10AM - 4PM"}</p>
            </div>
            <div className="flex gap-4 pt-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        <div
          className="border-t border-border mt-8 pt-8 text-center text-muted-foreground text-sm"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          <p>{"© 2025 Mike's Cut. All rights reserved."}</p>
        </div>
      </div>
    </footer>
  )
}
