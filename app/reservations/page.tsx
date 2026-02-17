"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ReservationForm } from "@/components/reservations/reservation-form"

export default function ReservationsPage() {
  return (
    <main>
      <SiteHeader />
      <section className="min-h-screen pt-32 pb-24">
        <div className="mx-auto max-w-2xl px-6 lg:px-8">
          <div className="mb-16 text-center">
            <div className="mb-6 flex items-center justify-center gap-4">
              <span className="h-px w-8 bg-primary" />
              <span className="text-xs uppercase tracking-[0.3em] text-primary">
                Reservations
              </span>
              <span className="h-px w-8 bg-primary" />
            </div>
            <h1 className="font-serif text-4xl font-bold text-foreground md:text-6xl">
              <span className="text-balance">Reserve Your Table</span>
            </h1>
            <p className="mt-6 text-base text-muted-foreground">
              Secure your evening at Kod Steak Bar. We recommend booking at least 24
              hours in advance.
            </p>
          </div>
          <ReservationForm />
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
