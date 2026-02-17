import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminShell } from "@/components/admin/admin-shell"

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  return <AdminShell userEmail={user.email ?? ""}>{children}</AdminShell>
}
