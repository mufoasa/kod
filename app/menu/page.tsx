import { createClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { MenuDisplay } from "@/components/menu/menu-display"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Menu | Kod Steak Bar",
  description: "Explore our premium steak menu featuring dry-aged cuts, A5 Wagyu, craft cocktails, and world-class wines.",
}

interface MenuItem {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  is_sold_out: boolean
  sort_order: number
}

interface MenuCategory {
  id: string
  name: string
  sort_order: number
  menu_items: MenuItem[]
}

export default async function MenuPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from("menu_categories")
    .select("id, name, sort_order, menu_items(id, name, description, price, image_url, is_sold_out, sort_order)")
    .order("sort_order", { ascending: true })

  const sortedCategories = (categories as MenuCategory[] | null)?.map((cat) => ({
    ...cat,
    menu_items: cat.menu_items?.sort((a, b) => a.sort_order - b.sort_order) ?? [],
  })) ?? []

  return (
    <main>
      <SiteHeader />
      <MenuDisplay categories={sortedCategories} />
      <SiteFooter />
    </main>
  )
}
