"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2, X, Check } from "lucide-react"

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

export function MenuManager({
  initialCategories,
}: {
  initialCategories: MenuCategory[]
}) {
  const [categories, setCategories] = useState(initialCategories)
  const [activeTab, setActiveTab] = useState(categories[0]?.id ?? "")
  const [showAddItem, setShowAddItem] = useState(false)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
  })

  const activeCategory = categories.find((c) => c.id === activeTab)

  const resetForm = () => {
    setForm({ name: "", description: "", price: "" })
    setShowAddItem(false)
    setEditingItem(null)
  }

  // Add category
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return
    const supabase = createClient()
    const maxSort = Math.max(0, ...categories.map((c) => c.sort_order))

    const { data, error } = await supabase
      .from("menu_categories")
      .insert({ name: newCategoryName.trim(), sort_order: maxSort + 1 })
      .select()
      .single()

    if (error) {
      toast.error("Failed to add category")
      return
    }

    setCategories((prev) => [...prev, { ...data, menu_items: [] }])
    setNewCategoryName("")
    setShowAddCategory(false)
    setActiveTab(data.id)
    toast.success("Category added")
  }

  // Delete category
  const handleDeleteCategory = async (catId: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("menu_categories").delete().eq("id", catId)
    if (error) {
      toast.error("Failed to delete category")
      return
    }

    setCategories((prev) => prev.filter((c) => c.id !== catId))
    if (activeTab === catId) {
      setActiveTab(categories.find((c) => c.id !== catId)?.id ?? "")
    }
    toast.success("Category deleted")
  }

  // Add item
  const handleAddItem = async () => {
    if (!form.name || !form.price || !activeTab) return
    const supabase = createClient()
    const items = activeCategory?.menu_items ?? []
    const maxSort = Math.max(0, ...items.map((i) => i.sort_order))

    const { data, error } = await supabase
      .from("menu_items")
      .insert({
        category_id: activeTab,
        name: form.name,
        description: form.description || null,
        price: parseFloat(form.price),
        sort_order: maxSort + 1,
      })
      .select()
      .single()

    if (error) {
      toast.error("Failed to add item")
      return
    }

    setCategories((prev) =>
      prev.map((c) =>
        c.id === activeTab
          ? { ...c, menu_items: [...c.menu_items, data] }
          : c
      )
    )
    resetForm()
    toast.success("Item added")
  }

  // Update item
  const handleUpdateItem = async (itemId: string) => {
    if (!form.name || !form.price) return
    const supabase = createClient()

    const { error } = await supabase
      .from("menu_items")
      .update({
        name: form.name,
        description: form.description || null,
        price: parseFloat(form.price),
      })
      .eq("id", itemId)

    if (error) {
      toast.error("Failed to update item")
      return
    }

    setCategories((prev) =>
      prev.map((c) => ({
        ...c,
        menu_items: c.menu_items.map((i) =>
          i.id === itemId
            ? {
                ...i,
                name: form.name,
                description: form.description || null,
                price: parseFloat(form.price),
              }
            : i
        ),
      }))
    )
    resetForm()
    toast.success("Item updated")
  }

  // Toggle sold out
  const toggleSoldOut = async (item: MenuItem) => {
    const supabase = createClient()
    const { error } = await supabase
      .from("menu_items")
      .update({ is_sold_out: !item.is_sold_out })
      .eq("id", item.id)

    if (error) {
      toast.error("Failed to update item")
      return
    }

    setCategories((prev) =>
      prev.map((c) => ({
        ...c,
        menu_items: c.menu_items.map((i) =>
          i.id === item.id ? { ...i, is_sold_out: !i.is_sold_out } : i
        ),
      }))
    )
  }

  // Delete item
  const handleDeleteItem = async (itemId: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("menu_items").delete().eq("id", itemId)
    if (error) {
      toast.error("Failed to delete item")
      return
    }

    setCategories((prev) =>
      prev.map((c) => ({
        ...c,
        menu_items: c.menu_items.filter((i) => i.id !== itemId),
      }))
    )
    toast.success("Item deleted")
  }

  return (
    <div>
      {/* Category tabs */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <div key={cat.id} className="group flex items-center">
            <button
              onClick={() => {
                setActiveTab(cat.id)
                resetForm()
              }}
              className={`px-4 py-2 text-xs uppercase tracking-[0.15em] transition-all ${
                activeTab === cat.id
                  ? "border border-primary bg-primary/10 text-primary"
                  : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.name} ({cat.menu_items.length})
            </button>
            <button
              onClick={() => handleDeleteCategory(cat.id)}
              className="ml-1 p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
              aria-label={`Delete ${cat.name} category`}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {showAddCategory ? (
          <div className="flex items-center gap-2">
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              className="h-8 w-40 border-border bg-card text-sm text-foreground"
              onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
            />
            <button
              onClick={handleAddCategory}
              className="p-1 text-primary"
              aria-label="Confirm add category"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                setShowAddCategory(false)
                setNewCategoryName("")
              }}
              className="p-1 text-muted-foreground"
              aria-label="Cancel add category"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAddCategory(true)}
            className="flex items-center gap-1 border border-dashed border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            <Plus className="h-3 w-3" />
            Category
          </button>
        )}
      </div>

      {/* Items list */}
      {activeCategory && (
        <div className="space-y-2">
          {activeCategory.menu_items.map((item) => (
            <div
              key={item.id}
              className={`border border-border bg-card p-4 ${
                item.is_sold_out ? "opacity-60" : ""
              }`}
            >
              {editingItem === item.id ? (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Name</Label>
                      <Input
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        className="mt-1 border-border bg-secondary text-foreground"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Description
                      </Label>
                      <Input
                        value={form.description}
                        onChange={(e) =>
                          setForm({ ...form, description: e.target.value })
                        }
                        className="mt-1 border-border bg-secondary text-foreground"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Price
                      </Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={form.price}
                        onChange={(e) =>
                          setForm({ ...form, price: e.target.value })
                        }
                        className="mt-1 border-border bg-secondary text-foreground"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleUpdateItem(item.id)}
                      className="bg-primary text-primary-foreground hover:bg-gold-light"
                    >
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-medium text-foreground">
                        {item.name}
                      </h3>
                      {item.is_sold_out && (
                        <span className="bg-red-400/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-red-400">
                          Sold Out
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <span className="font-serif text-sm font-bold text-primary">
                    {`${Number(item.price).toLocaleString()} ден`}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleSoldOut(item)}
                      className={`px-2 py-1 text-[10px] uppercase tracking-wider transition-colors ${
                        item.is_sold_out
                          ? "bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20"
                          : "bg-red-400/10 text-red-400 hover:bg-red-400/20"
                      }`}
                    >
                      {item.is_sold_out ? "Restock" : "Sold Out"}
                    </button>
                    <button
                      onClick={() => {
                        setEditingItem(item.id)
                        setForm({
                          name: item.name,
                          description: item.description ?? "",
                          price: String(item.price),
                        })
                      }}
                      className="p-2 text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={`Edit ${item.name}`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 text-muted-foreground transition-colors hover:text-destructive"
                      aria-label={`Delete ${item.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add new item */}
          {showAddItem ? (
            <div className="border border-dashed border-primary/30 bg-card p-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Name</Label>
                  <Input
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="Item name"
                    className="mt-1 border-border bg-secondary text-foreground"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Description
                  </Label>
                  <Input
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Item description"
                    className="mt-1 border-border bg-secondary text-foreground"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    placeholder="0.00"
                    className="mt-1 border-border bg-secondary text-foreground"
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  onClick={handleAddItem}
                  className="bg-primary text-primary-foreground hover:bg-gold-light"
                >
                  Add Item
                </Button>
                <Button size="sm" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddItem(true)}
              className="flex w-full items-center justify-center gap-2 border border-dashed border-border py-4 text-xs uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              <Plus className="h-4 w-4" />
              Add Menu Item
            </button>
          )}
        </div>
      )}
    </div>
  )
}
