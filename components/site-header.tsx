"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif text-2xl font-bold tracking-wide text-primary">
            KOD
          </span>
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground truncate">
  Steak Bar
</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-10 md:flex">
          <Link
            href="/"
            className="text-sm uppercase tracking-[0.15em] text-foreground/80 transition-colors hover:text-primary"
          >
            Home
          </Link>
          <Link
            href="/menu"
            className="text-sm uppercase tracking-[0.15em] text-foreground/80 transition-colors hover:text-primary"
          >
            Menu
          </Link>
          <Link
            href="/reservations"
            className="text-sm uppercase tracking-[0.15em] text-foreground/80 transition-colors hover:text-primary"
          >
            Reservations
          </Link>
          <Link
            href="/reservations"
            className="border border-primary bg-transparent px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-primary transition-all hover:bg-primary hover:text-primary-foreground"
          >
            Reserve a Table
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="text-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background/98 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-1 px-6 py-6">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="py-3 text-sm uppercase tracking-[0.15em] text-foreground/80 transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link
              href="/menu"
              onClick={() => setMobileOpen(false)}
              className="py-3 text-sm uppercase tracking-[0.15em] text-foreground/80 transition-colors hover:text-primary"
            >
              Menu
            </Link>
            <Link
              href="/reservations"
              onClick={() => setMobileOpen(false)}
              className="py-3 text-sm uppercase tracking-[0.15em] text-foreground/80 transition-colors hover:text-primary"
            >
              Reservations
            </Link>
            <Link
              href="/reservations"
              onClick={() => setMobileOpen(false)}
              className="mt-4 border border-primary bg-transparent px-6 py-3 text-center text-xs uppercase tracking-[0.2em] text-primary transition-all hover:bg-primary hover:text-primary-foreground"
            >
              Reserve a Table
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
