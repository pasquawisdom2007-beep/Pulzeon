"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

export type CartItem = {
  id: string
  title: string
  price: number
  image?: string
  category?: string
}

type CartContextValue = {
  items: CartItem[]
  count: number
  total: number
  add: (item: CartItem) => void
  remove: (id: string) => void
  has: (id: string) => boolean
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = "pulzeon_cart"

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {
      /* ignore */
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, hydrated])

  const value = useMemo<CartContextValue>(() => {
    return {
      items,
      count: items.length,
      total: items.reduce((sum, i) => sum + i.price, 0),
      add: (item) => setItems((prev) => (prev.some((p) => p.id === item.id) ? prev : [...prev, item])),
      remove: (id) => setItems((prev) => prev.filter((p) => p.id !== id)),
      has: (id) => items.some((p) => p.id === id),
      clear: () => setItems([]),
    }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
