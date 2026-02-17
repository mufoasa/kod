import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

const MAX_RESERVATIONS_PER_SLOT = 4

// POST: check if a specific slot is available
export async function POST(request: NextRequest) {
  try {
    const { date, time } = await request.json()

    if (!date || !time) {
      return NextResponse.json(
        { error: "Date and time are required" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data, error } = await supabase.rpc("check_slot_availability", {
      p_date: date,
      p_time: time,
    })

    if (error) {
      console.error("RPC error:", error)
      return NextResponse.json(
        { error: "Failed to check availability" },
        { status: 500 }
      )
    }

    const currentCount = data ?? 0

    // 999 means a confirmed reservation exists — slot is closed
    if (currentCount >= 999) {
      return NextResponse.json({ available: false, remaining: 0, confirmed: true })
    }

    const available = currentCount < MAX_RESERVATIONS_PER_SLOT

    return NextResponse.json({
      available,
      remaining: Math.max(0, MAX_RESERVATIONS_PER_SLOT - currentCount),
      confirmed: false,
    })
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    )
  }
}

// GET: fetch all confirmed (booked) time slots for a given date
export async function GET(request: NextRequest) {
  try {
    const date = request.nextUrl.searchParams.get("date")

    if (!date) {
      return NextResponse.json(
        { error: "Date is required" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data, error } = await supabase.rpc("get_booked_slots", {
      p_date: date,
    })

    if (error) {
      console.error("RPC error:", error)
      return NextResponse.json(
        { error: "Failed to fetch booked slots" },
        { status: 500 }
      )
    }

    const bookedTimes = (data ?? []).map((row: { booked_time: string }) => row.booked_time)

    return NextResponse.json({ bookedSlots: bookedTimes })
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    )
  }
}
