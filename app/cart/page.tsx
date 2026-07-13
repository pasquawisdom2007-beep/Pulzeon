"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useCart } from "@/components/cart-context"
import { NeonButton } from "@/components/ui/neon-button"
import { formatNaira } from "@/lib/catalog"

export default function CartPage() {
  const { items, removeItem, total, clear } = useCart()
  const { status } = useSession()
  const router = useRouter()

  function handleCheckout() {
    if (status !== "authenticated") {
      router.push("/login?callbackUrl=/checkout")
      return
    }
    router.push("/checkout")
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-8 font-heading text-3xl font-bold text-white text-glow">Your Cart</h1>

      {items.length === 0 ? (
        <div className="rounded-xl border border-cyan-500/20 bg-navy-800/40 p-10 text-center">
          <p className="text-slate-400">Your cart is empty.</p>
          <NeonButton asChild className="mt-6">
            <Link href="/shop">Browse the Shop</Link>
          </NeonButton>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <ul className="flex flex-col gap-4">
            {items.map((item) => (
              <li
                key={item.productId}
                className="flex items-center gap-4 rounded-xl border border-cyan-500/20 bg-navy-800/40 p-4"
              >
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-cyan-500/20">
                  <Image
                    src={item.coverImage || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <Link href={`/shop/${item.slug}`} className="font-medium text-white hover:text-cyan-300">
                    {item.title}
                  </Link>
                  <p className="text-sm text-cyan-400">{formatNaira(item.price)}</p>
                </div>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-sm text-slate-400 transition-colors hover:text-red-400"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between rounded-xl border border-cyan-500/30 bg-navy-800/60 p-5 shadow-neon">
            <span className="text-lg text-slate-300">Total</span>
            <span className="font-heading text-2xl font-bold text-cyan-400 text-glow">{formatNaira(total)}</span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <button onClick={clear} className="text-sm text-slate-400 hover:text-red-400">
              Clear cart
            </button>
            <NeonButton onClick={handleCheckout} size="lg">
              Proceed to Checkout
            </NeonButton>
          </div>
        </div>
      )}
    </div>
  )
}
