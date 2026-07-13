"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useCart } from "@/components/cart-context"
import { NeonButton } from "@/components/ui/neon-button"
import { formatNaira, SITE } from "@/lib/site"

export function CheckoutClient() {
  const params = useSearchParams()
  const plan = params.get("plan") as "monthly" | "yearly" | null
  const isSubscription = plan === "monthly" || plan === "yearly"

  const { items, total, clear } = useCart()
  const router = useRouter()

  const [reference, setReference] = useState("")
  const [proofUrl, setProofUrl] = useState("")
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)

  const amount = isSubscription
    ? plan === "monthly"
      ? SITE.premium.monthly
      : SITE.premium.yearly
    : total

  const planLabel = plan === "monthly" ? "Premium Monthly" : plan === "yearly" ? "Premium Yearly" : ""

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError("")
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Upload failed")
      setProofUrl(data.url)
    } catch (err: any) {
      setError(err.message || "Could not upload proof. You can still submit and send proof via WhatsApp.")
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      const payload = isSubscription
        ? { type: "subscription", subscriptionPlan: plan, reference, proofUrl }
        : { type: "product", productIds: items.map((i) => i.productId), reference, proofUrl }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Could not create order")
      if (!isSubscription) clear()
      router.push("/dashboard?order=pending")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  const emptyProductCart = !isSubscription && items.length === 0

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-8 font-heading text-3xl font-bold text-white text-glow">Checkout</h1>

      {emptyProductCart ? (
        <div className="rounded-xl border border-cyan-500/20 bg-navy-800/40 p-10 text-center">
          <p className="text-slate-400">Your cart is empty.</p>
          <NeonButton asChild className="mt-6">
            <Link href="/shop">Browse the Shop</Link>
          </NeonButton>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* Order summary */}
          <section className="rounded-xl border border-cyan-500/20 bg-navy-800/40 p-6">
            <h2 className="mb-4 font-heading text-lg font-semibold text-white">Order summary</h2>
            {isSubscription ? (
              <div className="flex items-center justify-between text-slate-300">
                <span>{planLabel}</span>
                <span className="text-cyan-400">{formatNaira(amount)}</span>
              </div>
            ) : (
              <ul className="flex flex-col gap-2">
                {items.map((i) => (
                  <li key={i.productId} className="flex items-center justify-between text-slate-300">
                    <span>{i.title}</span>
                    <span className="text-cyan-400">{formatNaira(i.price)}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 flex items-center justify-between border-t border-cyan-500/10 pt-4">
              <span className="font-semibold text-white">Total</span>
              <span className="font-heading text-xl font-bold text-cyan-400 text-glow">{formatNaira(amount)}</span>
            </div>
          </section>

          {/* Payment details */}
          <section className="rounded-xl border border-cyan-400 bg-navy-800/60 p-6 shadow-neon">
            <h2 className="mb-4 font-heading text-lg font-semibold text-cyan-300">Pay via Opay transfer</h2>
            <p className="mb-4 text-sm text-slate-400">
              Send exactly <span className="font-semibold text-cyan-400">{formatNaira(amount)}</span> to the account
              below, then submit your payment proof.
            </p>
            <dl className="flex flex-col gap-3">
              <div className="flex items-center justify-between rounded-lg bg-navy-950/60 px-4 py-3">
                <dt className="text-sm text-slate-400">Account Number</dt>
                <dd className="font-heading text-lg font-bold text-white">{SITE.payment.accountNumber}</dd>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-navy-950/60 px-4 py-3">
                <dt className="text-sm text-slate-400">Bank</dt>
                <dd className="font-medium text-white">{SITE.payment.bank}</dd>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-navy-950/60 px-4 py-3">
                <dt className="text-sm text-slate-400">Account Name</dt>
                <dd className="font-medium text-white">{SITE.payment.accountName}</dd>
              </div>
            </dl>
          </section>

          {/* Proof form */}
          {!showForm ? (
            <NeonButton size="lg" onClick={() => setShowForm(true)}>
              I&apos;ve made payment
            </NeonButton>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-cyan-500/20 bg-navy-800/40 p-6">
              <h2 className="font-heading text-lg font-semibold text-white">Submit payment proof</h2>
              {error ? (
                <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm text-amber-300">
                  {error}
                </p>
              ) : null}
              <label className="flex flex-col gap-1 text-sm text-slate-300">
                Transaction reference
                <input
                  type="text"
                  required
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. Opay ref / session ID"
                  className="rounded-lg border border-cyan-500/30 bg-navy-900/60 px-4 py-2.5 text-white outline-none focus:border-cyan-400 focus:shadow-neon"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-slate-300">
                Payment screenshot
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="rounded-lg border border-cyan-500/30 bg-navy-900/60 px-4 py-2.5 text-sm text-slate-400 file:mr-4 file:rounded-md file:border-0 file:bg-cyan-500/20 file:px-3 file:py-1 file:text-cyan-300"
                />
              </label>
              {uploading ? <p className="text-sm text-cyan-400">Uploading proof...</p> : null}
              {proofUrl ? <p className="text-sm text-cyan-400">Proof uploaded ✓</p> : null}
              <NeonButton type="submit" size="lg" disabled={submitting || uploading} className="mt-2">
                {submitting ? "Submitting..." : "Submit for confirmation"}
              </NeonButton>
              <p className="text-xs text-slate-500">
                Your order will be marked pending until we confirm your payment. You&apos;ll see it in your dashboard.
              </p>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
