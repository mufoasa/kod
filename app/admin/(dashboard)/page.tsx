import { createClient } from "@/lib/supabase/server"
import { ReservationsManager } from "@/components/admin/reservations-manager"

export default async function AdminReservationsPage() {
  const supabase = await createClient()

  const { data: reservations } = await supabase
    .from("reservations")
    .select("*")
    .order("reservation_date", { ascending: true })
    .order("reservation_time", { ascending: true })

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">
          Reservations
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage all upcoming and past reservations.
        </p>
      </div>
      <ReservationsManager initialReservations={reservations ?? []} />
    </div>
  )
}
