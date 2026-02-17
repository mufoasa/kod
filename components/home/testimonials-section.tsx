import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Muhamed A.",
    text: "Absolutely amazing experience at Kod Steak Bar. The burger was juicy, perfectly seasoned, and full of flavor. The atmosphere makes it even better. Highly recommended!",
    rating: 5,
  },
  {
    name: "Argjend S.",
    text: "Best spot in Tetovo for premium burgers and steaks. Everything tasted fresh and high quality. The service was fast and very professional.",
    rating: 5,
  },
  {
    name: "Lavdrim B.",
    text: "Kod never disappoints. From the presentation to the taste, everything feels top tier. Definitely my go-to place for a great meal with friends.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-20 text-center">
          <div className="mb-6 flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-primary" />
            <span className="text-xs uppercase tracking-[0.3em] text-primary">
              Reviews
            </span>
            <span className="h-px w-8 bg-primary" />
          </div>
          <h2 className="font-serif text-4xl font-bold text-foreground md:text-5xl">
            <span className="text-balance">What Our Guests Say</span>
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="border border-border bg-card p-8 transition-colors hover:border-primary/30"
            >
              <div className="mb-6 flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-primary text-primary"
                  />
                ))}
              </div>
              <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
                {`"${t.text}"`}
              </p>
              <p className="text-xs uppercase tracking-[0.2em] text-foreground">
                {t.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
