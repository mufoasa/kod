import Link from "next/link"
import { MapPin, Phone, Clock } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/20">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="font-serif text-2xl font-bold text-primary">KOD</span>
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Steak Bar
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Premium steakhouse offering the finest cuts, world-class wines, and
              an unforgettable dining experience.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-6 text-xs uppercase tracking-[0.25em] text-foreground">
              Contact
            </h4>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Ilindenska bb, 1200 Tetovo</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <span>+389 44 000 000</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-primary" />
                <span>Mon - Sun: 12:00 - 23:00</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-6 text-xs uppercase tracking-[0.25em] text-foreground">
              Navigation
            </h4>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <Link href="/" className="transition-colors hover:text-primary">
                Home
              </Link>
              <Link href="/menu" className="transition-colors hover:text-primary">
                Menu
              </Link>
              <Link
                href="/reservations"
                className="transition-colors hover:text-primary"
              >
                Reservations
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-border pt-8 text-center text-xs text-muted-foreground">
          {`© ${new Date().getFullYear()} Kod Steak Bar. All rights reserved.`}
        </div>
      </div>
    </footer>
  )
}
