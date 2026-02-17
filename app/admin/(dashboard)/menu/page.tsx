import { createClient } from "@/lib/supabase/server"
import { MenuManager } from "@/components/admin/menu-manager"

interface MenuItem {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  is_sold_out: boolean
  sort_order: number
  category_id: string
}

interface MenuCategory {
  id: string
  name: string
  sort_order: number
  menu_items: MenuItem[]
}

export default async function AdminMenuPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from("menu_categories")
    .select("id, name, sort_order, menu_items(id, name, description, price, image_url, is_sold_out, sort_order, category_id)")
    .order("sort_order", { ascending: true })

  const sorted = (categories as MenuCategory[] | null)?.map((cat) => ({
    ...cat,
    menu_items: cat.menu_items?.sort((a, b) => a.sort_order - b.sort_order) ?? [],
  })) ?? []

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">
          Menu Management
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add, edit, or remove menu items and categories.
        </p>
      </div>
      <MenuManager initialCategories={sorted} />
    </div>
  )
}
