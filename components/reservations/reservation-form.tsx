"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { CheckCircle } from "lucide-react"

const TIME_SLOTS = [
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
  "21:00", "21:30", "22:00", "22:30",
]

export function ReservationForm() {
  const [form, setForm] = useState({
    guest_name: "",
    phone: "",
    email: "",
    guests: "2",
    reservation_date: "",
    reservation_time: "",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [bookedSlots, setBoostedSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  const fetchBookedSlots = useCallback(async (date: string) => {
    if (!date) {
      setBoostedSlots([])
      return
    }
    setLoadingSlots(true)
    try {
      const res = await fetch(
        `/api/reservations/check-availability?date=${encodeURIComponent(date)}`
      )
      if (res.ok) {
        const { bookedSlots: slots } = await res.json()
        setBoostedSlots(slots ?? [])
      }
    } catch {
      // silently fail, user can still pick a time
    } finally {
      setLoadingSlots(false)
    }
  }, [])

  useEffect(() => {
    fetchBookedSlots(form.reservation_date)
  }, [form.reservation_date, fetchBookedSlots])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = createClient()

      // Check availability via server-side API that uses SECURITY DEFINER RPC
      const availRes = await fetch("/api/reservations/check-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: form.reservation_date,
          time: form.reservation_time,
        }),
      })

      if (availRes.ok) {
        const { available, remaining, confirmed } = await availRes.json()
        if (!available) {
          const msg = confirmed
            ? "This time slot has a confirmed reservation and is no longer available."
            : "This time slot is fully booked. Please choose another time."
          toast.error(msg)
          // Refresh booked slots so the UI updates immediately
          fetchBookedSlots(form.reservation_date)
          setIsSubmitting(false)
          return
        }
        if (remaining <= 1) {
          toast.info("Only 1 spot remaining for this time slot.")
        }
      }

      const { error } = await supabase.from("reservations").insert({
        guest_name: form.guest_name,
        phone: form.phone,
        email: form.email,
        guests: parseInt(form.guests),
        reservation_date: form.reservation_date,
        reservation_time: form.reservation_time,
        notes: form.notes || null,
      })

      if (error) throw error

      setSuccess(true)
      toast.success("Reservation submitted successfully!")
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-6 py-16 text-center">
        <CheckCircle className="h-16 w-16 text-primary" />
        <h2 className="font-serif text-3xl font-bold text-foreground">
          Reservation Submitted
        </h2>
        <p className="text-muted-foreground">
          Thank you, {form.guest_name}. We will confirm your reservation for{" "}
          {form.reservation_date} at {form.reservation_time} shortly.
        </p>
        <button
          onClick={() => {
            setSuccess(false)
            setForm({
              guest_name: "",
              phone: "",
              email: "",
              guests: "2",
              reservation_date: "",
              reservation_time: "",
              notes: "",
            })
          }}
          className="mt-4 border border-primary px-8 py-3 text-xs uppercase tracking-[0.2em] text-primary transition-all hover:bg-primary hover:text-primary-foreground"
        >
          Make Another Reservation
        </button>
      </div>
    )
  }

  // Get tomorrow's date as min date
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split("T")[0]

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="guest_name" className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
            Full Name
          </Label>
          <Input
            id="guest_name"
            required
            value={form.guest_name}
            onChange={(e) => setForm({ ...form, guest_name: e.target.value })}
            className="border-border bg-card text-foreground"
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
            Phone
          </Label>
          <Input
            id="phone"
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="border-border bg-card text-foreground"
            placeholder="+389 7X XXX XXX"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border-border bg-card text-foreground"
            placeholder="your@email.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="guests" className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
            Number of Guests
          </Label>
          <select
            id="guests"
            required
            value={form.guests}
            onChange={(e) => setForm({ ...form, guests: e.target.value })}
            className="flex h-10 w-full border border-border bg-card px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "Guest" : "Guests"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="date" className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
            Date
          </Label>
          <Input
            id="date"
            type="date"
            required
            min={minDate}
            value={form.reservation_date}
            onChange={(e) =>
              setForm({ ...form, reservation_date: e.target.value, reservation_time: "" })
            }
            className="border-border bg-card text-foreground"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
            Time {loadingSlots && <span className="text-[10px] lowercase tracking-normal text-muted-foreground/60">(checking availability...)</span>}
          </Label>
          {!form.reservation_date ? (
            <p className="py-2 text-sm text-muted-foreground/60">
              Please select a date first
            </p>
          ) : (
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
              {TIME_SLOTS.map((t) => {
                const isBooked = bookedSlots.includes(t)
                const isSelected = form.reservation_time === t
                return (
                  <button
                    key={t}
                    type="button"
                    disabled={isBooked}
                    onClick={() => setForm({ ...form, reservation_time: t })}
                    className={`relative px-2 py-2.5 text-xs transition-all ${
                      isBooked
                        ? "cursor-not-allowed border border-border/40 bg-card/30 text-muted-foreground/30 line-through"
                        : isSelected
                          ? "border border-primary bg-primary text-primary-foreground"
                          : "border border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    }`}
                  >
                    {t}
                    {isBooked && (
                      <span className="absolute -top-1.5 right-0.5 text-[8px] uppercase tracking-wider text-destructive/70 no-underline">
                        booked
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
          {/* Hidden input for form validation */}
          <input
            type="text"
            required
            value={form.reservation_time}
            onChange={() => {}}
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Special Requests (Optional)
        </Label>
        <textarea
          id="notes"
          rows={3}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="flex w-full border border-border bg-card px-3 py-2 text-sm leading-relaxed text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Any dietary requirements or special occasions..."
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary py-6 text-xs uppercase tracking-[0.25em] text-primary-foreground transition-all hover:bg-gold-light disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Confirm Reservation"}
      </Button>
    </form>
  )
}
