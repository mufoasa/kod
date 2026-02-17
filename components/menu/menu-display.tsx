"use client"

import { useState } from "react"
import Image from "next/image"

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

export function MenuDisplay({ categories }: { categories: MenuCategory[] }) {
  const [activeCategory, setActiveCategory] = useState<string>(
    categories[0]?.id ?? ""
  )

  const active = categories.find((c) => c.id === activeCategory)

  return (
    <section className="min-h-screen pt-32 pb-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        {/* Page heading */}
        <div className="mb-16 text-center">
          <div className="mb-6 flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-primary" />
            <span className="text-xs uppercase tracking-[0.3em] text-primary">
              Our Menu
            </span>
            <span className="h-px w-8 bg-primary" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-foreground md:text-6xl">
            <span className="text-balance">Exquisite Flavors</span>
          </h1>
        </div>

        {/* Category tabs */}
        <div className="mb-16 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 text-xs uppercase tracking-[0.2em] transition-all ${
                activeCategory === cat.id
                  ? "border border-primary bg-primary text-primary-foreground"
                  : "border border-border bg-transparent text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Items */}
        {active && (
          <div className="space-y-0">
            {active.menu_items.map((item) => (
              <div
                key={item.id}
                className={`flex items-start gap-5 border-b border-border py-8 ${
                  item.is_sold_out ? "opacity-50" : ""
                }`}
              >
                {item.image_url && (
                  <div className="relative hidden h-20 w-20 flex-shrink-0 overflow-hidden sm:block">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                )}
                <div className="flex flex-1 items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-serif text-xl font-semibold text-foreground">
                        {item.name}
                      </h3>
                      {item.is_sold_out && (
                        <span className="bg-destructive/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-destructive">
                          Sold Out
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <p className="flex-shrink-0 font-serif text-xl font-bold text-primary">
                    {`${Number(item.price).toLocaleString()} ден`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {active && active.menu_items.length === 0 && (
          <p className="text-center text-muted-foreground">
            No items in this category yet.
          </p>
        )}
      </div>
    </section>
  )
}
