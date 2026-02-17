"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Check, X, Trash2, Clock, Users, Mail, Phone } from "lucide-react"

interface Reservation {
  id: string
  guest_name: string
  phone: string
  email: string
  guests: number
  reservation_date: string
  reservation_time: string
  notes: string | null
  status: string
  created_at: string
}

export function ReservationsManager({
  initialReservations,
}: {
  initialReservations: Reservation[]
}) {
  const [reservations, setReservations] = useState(initialReservations)
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all")

  const filtered = reservations.filter((r) =>
    filter === "all" ? true : r.status === filter
  )

  const counts = {
    all: reservations.length,
    pending: reservations.filter((r) => r.status === "pending").length,
    confirmed: reservations.filter((r) => r.status === "confirmed").length,
    cancelled: reservations.filter((r) => r.status === "cancelled").length,
  }

  const updateStatus = async (id: string, status: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from("reservations")
      .update({ status })
      .eq("id", id)

    if (error) {
      toast.error("Failed to update reservation")
      return
    }

    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    )
    toast.success(`Reservation ${status}`)
  }

  const deleteReservation = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("reservations").delete().eq("id", id)

    if (error) {
      toast.error("Failed to delete reservation")
      return
    }

    setReservations((prev) => prev.filter((r) => r.id !== id))
    toast.success("Reservation deleted")
  }

  const statusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-emerald-400 bg-emerald-400/10"
      case "cancelled":
        return "text-red-400 bg-red-400/10"
      default:
        return "text-amber-400 bg-amber-400/10"
    }
  }

  return (
    <div>
      {/* Filter tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {(["all", "pending", "confirmed", "cancelled"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-xs uppercase tracking-[0.15em] transition-all ${
              filter === f
                ? "border border-primary bg-primary/10 text-primary"
                : "border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {f} ({counts[f]})
          </button>
        ))}
      </div>

      {/* Reservations list */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          No reservations found.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="border border-border bg-card p-5 transition-colors hover:border-border/80"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                {/* Info Section */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-serif text-lg font-semibold text-foreground">
                      {r.guest_name}
                    </h3>
                    <span
                      className={`px-2 py-0.5 text-[10px] uppercase tracking-wider ${statusColor(r.status)}`}
                    >
                      {r.status}
                    </span>
                  </div>

                  <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2 lg:flex lg:flex-wrap lg:gap-4">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      {r.reservation_date} at {r.reservation_time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3 w-3" />
                      {r.guests} {r.guests === 1 ? "guest" : "guests"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3 w-3" />
                      {r.phone}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-3 w-3" />
                      {r.email}
                    </span>
                  </div>

                  {r.notes && (
                    <p className="mt-2 text-xs text-muted-foreground/80 italic">
                      {`"${r.notes}"`}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                  {r.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(r.id, "confirmed")}
                        className="w-full sm:w-auto border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/10 hover:text-emerald-400"
                      >
                        <Check className="mr-1 h-3 w-3" />
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(r.id, "cancelled")}
                        className="w-full sm:w-auto border-red-400/30 text-red-400 hover:bg-red-400/10 hover:text-red-400"
                      >
                        <X className="mr-1 h-3 w-3" />
                        Cancel
                      </Button>
                    </>
                  )}
                  {r.status === "confirmed" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(r.id, "cancelled")}
                      className="w-full sm:w-auto border-red-400/30 text-red-400 hover:bg-red-400/10 hover:text-red-400"
                    >
                      <X className="mr-1 h-3 w-3" />
                      Cancel
                    </Button>
                  )}
                  {r.status === "cancelled" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(r.id, "pending")}
                      className="w-full sm:w-auto border-amber-400/30 text-amber-400 hover:bg-amber-400/10 hover:text-amber-400"
                    >
                      Reopen
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteReservation(r.id)}
                    className="w-full sm:w-auto border-border text-muted-foreground hover:border-destructive/30 hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
