"use client"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { useCart } from "@/components/cart-context"
import { NeonButton } from "@/components/ui/neon-button"
import type { ProductDTO } from "@/lib/data"

export function ProductActions({ product }: { product: ProductDTO }) {
  const { status } = useSession()
  const router = useRouter()
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const loggedIn = status === "authenticated"

  function handleAddToCart() {
    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      coverImage: product.coverImage,
      slug: product.slug,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  function handleBuyNow() {
    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      coverImage: product.coverImage,
      slug: product.slug,
    })
    router.push("/checkout")
  }

  if (!loggedIn) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-slate-400">You must be logged in to purchase.</p>
        <NeonButton onClick={() => router.push(`/login?callbackUrl=/shop/${product.slug}`)} size="lg">
          Log in to Buy
        </NeonButton>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <NeonButton onClick={handleBuyNow} size="lg">
        Buy Now
      </NeonButton>
      <NeonButton onClick={handleAddToCart} size="lg" variant="outline">
        {added ? "Added to cart ✓" : "Add to Cart"}
      </NeonButton>
    </div>
  )
}
