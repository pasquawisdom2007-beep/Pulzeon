"use client"

import { useMemo, useState } from "react"
import { ProductCard } from "@/components/product-card"
import type { ProductDTO } from "@/lib/data"

export function ShopGrid({ products }: { products: ProductDTO[] }) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category))
    return ["All", ...Array.from(set)]
  }, [products])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return products.filter((p) => {
      const matchesCat = category === "All" || p.category === category
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      return matchesCat && matchesSearch
    })
  }, [products, search, category])

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full rounded-lg border border-cyan-500/30 bg-navy-800/60 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition-colors focus:border-cyan-400 focus:shadow-neon"
          aria-label="Search products"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-all " +
                (category === cat
                  ? "border-cyan-400 bg-cyan-400/10 text-cyan-300 shadow-neon"
                  : "border-cyan-500/20 text-slate-400 hover:border-cyan-400/60 hover:text-cyan-300")
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-slate-400">No products match your search.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
