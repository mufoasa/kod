import Image from "next/image"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-steak.jpg"
          alt="Premium steak at Kod Steak Bar"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <div className="mb-8 flex items-center justify-center gap-4">
          <span className="h-px w-12 bg-primary" />
          <span className="text-xs uppercase tracking-[0.4em] text-primary">
            Tetovo, North Macedonia
          </span>
          <span className="h-px w-12 bg-primary" />
        </div>

        <h1 className="mb-6 font-serif text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl lg:text-8xl">
          <span className="text-balance">
            Elevated Steak{" "}
            <span className="text-primary">Experience</span>
          </span>
        </h1>

        <p className="mx-auto mb-12 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
          Where premium cuts meet exceptional craft. Every bite, a journey through
          perfection.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <Link
            href="/reservations"
            className="w-full bg-primary px-10 py-4 text-xs uppercase tracking-[0.25em] text-primary-foreground transition-all hover:bg-gold-light sm:w-auto"
          >
            Reserve a Table
          </Link>
          <Link
            href="/menu"
            className="w-full border border-foreground/30 bg-transparent px-10 py-4 text-xs uppercase tracking-[0.25em] text-foreground transition-all hover:border-primary hover:text-primary sm:w-auto"
          >
            View Our Menu
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Scroll
          </span>
          <div className="h-10 w-px animate-pulse bg-gradient-to-b from-primary to-transparent" />
        </div>
      </div>
    </section>
  )
}
