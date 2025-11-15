import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Scissors, Axe, Flame, Award } from "lucide-react"

const barbers = [
  {
    name: 'MIKE "THE BLADE" JOHNSON',
    title: "FOUNDER & MASTER BARBER",
    image: "/tough-bearded-barber-with-tattoos-holding-straight.jpg",
    specialties: ["Knife Cuts", "Axe Styling", "Traditional Shaves"],
    bio: "With 20 years of experience, Mike founded this shop to bring back the lost art of traditional barbering. Trained in Italy and Japan, he's mastered techniques that most barbers have forgotten.",
    icon: Axe,
  },
  {
    name: "RAZOR RODRIGUEZ",
    title: "SENIOR BARBER",
    image: "/hispanic-barber-with-tattoos-and-beard-in-dark-bar.jpg",
    specialties: ["Hot Towel Shaves", "Beard Sculpting", "Fade Masters"],
    bio: "Razor learned his craft in the streets of Miami before joining Mike's Cut. His precision with a straight razor is legendary, and his fades are works of art.",
    icon: Scissors,
  },
  {
    name: "STEEL THOMPSON",
    title: "MASTER STYLIST",
    image: "/muscular-bald-barber-with-tattoos-in-dark-barbersh.jpg",
    specialties: ["Axe Styling", "Modern Cuts", "Hair Tattoos"],
    bio: "Former military, Steel brings discipline and precision to every cut. He specializes in our signature axe styling technique and modern masculine looks.",
    icon: Axe,
  },
  {
    name: "BLAZE MARTINEZ",
    title: "TRADITIONAL SPECIALIST",
    image: "/young-latino-barber-with-styled-hair-and-tattoos-i.jpg",
    specialties: ["Traditional Cuts", "Hot Towel Shaves", "Grooming"],
    bio: "The youngest member of our team, but don't let that fool you. Blaze trained under Mike for 5 years and has mastered traditional techniques that take most a lifetime.",
    icon: Flame,
  },
]

export default function BarbersPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-20">
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
          <h1 className="text-6xl md:text-8xl font-bold tracking-wider text-primary mb-6 text-balance">THE BARBERS</h1>
          <p
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {
              "Meet the craftsmen behind Mike's Cut. Each one a master of their trade, dedicated to the art of traditional barbering."
            }
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-wider text-primary mb-6">OUR PHILOSOPHY</h2>
            <p
              className="text-lg text-muted-foreground mb-6 leading-relaxed"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {
                "At Mike's Cut, we don't just cut hair—we practice a craft. Every barber on our team has spent years mastering traditional techniques that most shops have abandoned. We use knives and axes because they demand skill, respect, and precision."
              }
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
              {
                "When you sit in our chair, you're not just getting a haircut. You're experiencing a tradition that goes back centuries, performed by craftsmen who take their work seriously."
              }
            </p>
          </div>
        </div>
      </section>

      {/* Barbers Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {barbers.map((barber, index) => {
              const Icon = barber.icon
              return (
                <Card
                  key={index}
                  className="overflow-hidden bg-card border-border hover:border-accent transition-all duration-300 group"
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
                    {/* Image Section */}
                    <div className="md:col-span-2 relative h-80 md:h-auto">
                      <img
                        src={barber.image || "/placeholder.svg"}
                        alt={barber.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-accent/90 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-accent-foreground" />
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="md:col-span-3 p-8">
                      <h3 className="text-3xl font-bold tracking-wider text-primary mb-2">{barber.name}</h3>
                      <p className="text-accent text-lg tracking-wide mb-4">{barber.title}</p>

                      <p
                        className="text-muted-foreground mb-6 leading-relaxed"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {barber.bio}
                      </p>

                      <div>
                        <h4 className="text-sm font-bold tracking-wider text-foreground mb-3 flex items-center gap-2">
                          <Award className="w-4 h-4 text-accent" />
                          SPECIALTIES
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {barber.specialties.map((specialty, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-secondary border border-border text-foreground text-sm tracking-wide"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Training Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold tracking-wider text-primary mb-8 text-center">
              THE TRAINING
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 bg-secondary border-border text-center">
                <div className="text-4xl font-bold text-accent mb-2">5+</div>
                <p className="text-foreground font-bold tracking-wide mb-2">YEARS</p>
                <p
                  className="text-sm text-muted-foreground leading-relaxed"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Minimum training required before mastering our techniques
                </p>
              </Card>

              <Card className="p-6 bg-secondary border-border text-center">
                <div className="text-4xl font-bold text-accent mb-2">100%</div>
                <p className="text-foreground font-bold tracking-wide mb-2">TRADITIONAL</p>
                <p
                  className="text-sm text-muted-foreground leading-relaxed"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  All techniques passed down through generations of barbers
                </p>
              </Card>

              <Card className="p-6 bg-secondary border-border text-center">
                <div className="text-4xl font-bold text-accent mb-2">ZERO</div>
                <p className="text-foreground font-bold tracking-wide mb-2">SHORTCUTS</p>
                <p
                  className="text-sm text-muted-foreground leading-relaxed"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  We do things the right way, no matter how long it takes
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('/dark-moody-barbershop-interior-with-leather-chairs.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-background/85" />
        </div>

        <div className="container mx-auto px-4 z-10 relative text-center">
          <h2 className="text-4xl md:text-6xl font-bold tracking-wider text-primary mb-6 text-balance">
            READY TO EXPERIENCE THE DIFFERENCE?
          </h2>
          <p
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {"Book your appointment with one of our master barbers today."}
          </p>
          <a
            href="/booking"
            className="inline-flex items-center justify-center px-8 py-4 bg-accent hover:bg-accent/90 text-accent-foreground font-bold tracking-wide text-lg transition-colors"
          >
            BOOK YOUR CUT
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}
