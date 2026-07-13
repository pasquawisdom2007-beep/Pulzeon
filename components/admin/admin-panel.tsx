"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { NeonButton } from "@/components/ui/neon-button"
import { formatNaira } from "@/lib/catalog"
import type { AdminOrder, ProductDTO, UpdateDTO } from "@/lib/data"

type Stats = { revenue: number; paidCount: number; pendingCount: number; productCount: number; userCount: number }
type Tab = "orders" | "products" | "updates"

export function AdminPanel({
  stats,
  initialOrders,
  initialProducts,
  initialUpdates,
}: {
  stats: Stats
  initialOrders: AdminOrder[]
  initialProducts: ProductDTO[]
  initialUpdates: UpdateDTO[]
}) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>("orders")
  const [orders, setOrders] = useState(initialOrders)
  const [busy, setBusy] = useState<string | null>(null)

  async function updateOrder(id: string, action: "confirm" | "reject") {
    setBusy(id)
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })
      const data = await res.json()
      if (res.ok) {
        setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: data.status } : o)))
        router.refresh()
      }
    } finally {
      setBusy(null)
    }
  }

  return (
    <div>
      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total revenue" value={formatNaira(stats.revenue)} highlight />
        <StatCard label="Paid orders" value={String(stats.paidCount)} />
        <StatCard label="Pending" value={String(stats.pendingCount)} />
        <StatCard label="Products" value={String(stats.productCount)} />
      </div>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {(["orders", "products", "updates"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={
              "rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition-all " +
              (tab === t
                ? "border-cyan-400 bg-cyan-400/10 text-cyan-300 shadow-neon"
                : "border-cyan-500/20 text-slate-400 hover:border-cyan-400/60 hover:text-cyan-300")
            }
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "orders" ? <OrdersTab orders={orders} onUpdate={updateOrder} busy={busy} /> : null}
      {tab === "products" ? <ProductsTab products={initialProducts} /> : null}
      {tab === "updates" ? <UpdatesTab updates={initialUpdates} /> : null}
    </div>
  )
}

function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={
        "rounded-xl border p-5 " +
        (highlight ? "border-cyan-400 bg-navy-800/60 shadow-neon" : "border-cyan-500/20 bg-navy-800/40")
      }
    >
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className={"mt-1 font-heading text-2xl font-bold " + (highlight ? "text-cyan-400 text-glow" : "text-white")}>
        {value}
      </p>
    </div>
  )
}

function OrdersTab({
  orders,
  onUpdate,
  busy,
}: {
  orders: AdminOrder[]
  onUpdate: (id: string, action: "confirm" | "reject") => void
  busy: string | null
}) {
  if (orders.length === 0) return <p className="text-slate-400">No orders yet.</p>
  return (
    <div className="flex flex-col gap-4">
      {orders.map((o) => (
        <div key={o.id} className="flex flex-col gap-4 rounded-xl border border-cyan-500/20 bg-navy-800/40 p-5 lg:flex-row">
          {o.proofUrl ? (
            <a
              href={o.proofUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative h-28 w-full shrink-0 overflow-hidden rounded-lg border border-cyan-500/20 lg:w-40"
            >
              <Image src={o.proofUrl || "/placeholder.svg"} alt="Payment proof" fill sizes="160px" className="object-cover" />
            </a>
          ) : (
            <div className="flex h-28 w-full shrink-0 items-center justify-center rounded-lg border border-dashed border-cyan-500/20 text-xs text-slate-500 lg:w-40">
              No proof
            </div>
          )}

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-white">{o.userEmail}</span>
              <StatusPill status={o.status} />
            </div>
            <p className="mt-1 text-sm text-slate-300">
              {o.type === "subscription"
                ? `Premium subscription (${o.subscriptionPlan})`
                : o.itemTitles.join(", ") || "Product order"}
            </p>
            <p className="mt-1 text-sm text-cyan-400">{formatNaira(o.amount)}</p>
            <p className="text-xs text-slate-500">
              Ref: {o.reference || "—"} · {new Date(o.createdAt).toLocaleString("en-NG")}
            </p>
          </div>

          {o.status === "pending" ? (
            <div className="flex shrink-0 flex-col gap-2 self-center">
              <NeonButton onClick={() => onUpdate(o.id, "confirm")} disabled={busy === o.id}>
                {busy === o.id ? "..." : "Confirm Payment"}
              </NeonButton>
              <button
                onClick={() => onUpdate(o.id, "reject")}
                disabled={busy === o.id}
                className="text-xs text-slate-400 hover:text-red-400"
              >
                Reject
              </button>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid: "border-cyan-400/50 bg-cyan-400/10 text-cyan-300",
    pending: "border-amber-400/50 bg-amber-400/10 text-amber-300",
    rejected: "border-red-400/50 bg-red-400/10 text-red-300",
  }
  return (
    <span className={"rounded-full border px-3 py-0.5 text-xs font-medium " + (map[status] || "border-slate-500/40 text-slate-300")}>
      {status}
    </span>
  )
}

function ProductsTab({ products }: { products: ProductDTO[] }) {
  const router = useRouter()
  const [form, setForm] = useState({
    title: "",
    category: "",
    price: "",
    shortDescription: "",
    description: "",
    coverImage: "",
    fileUrl: "",
    included: "",
    featured: false,
    premiumOnly: false,
  })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")

  async function addProduct(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMsg("")
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMsg("Product added.")
      setForm({
        title: "",
        category: "",
        price: "",
        shortDescription: "",
        description: "",
        coverImage: "",
        fileUrl: "",
        included: "",
        featured: false,
        premiumOnly: false,
      })
      router.refresh()
    } catch (err: any) {
      setMsg(err.message || "Could not add product.")
    } finally {
      setSaving(false)
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product?")) return
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" })
    if (res.ok) router.refresh()
  }

  const input = "rounded-lg border border-cyan-500/30 bg-navy-900/60 px-4 py-2.5 text-white outline-none focus:border-cyan-400 focus:shadow-neon"

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <form onSubmit={addProduct} className="flex flex-col gap-3 rounded-xl border border-cyan-500/20 bg-navy-800/40 p-5">
        <h3 className="font-heading text-lg font-semibold text-white">Add product</h3>
        {msg ? <p className="text-sm text-cyan-400">{msg}</p> : null}
        <input className={input} placeholder="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className={input} placeholder="Category" required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input className={input} type="number" placeholder="Price (₦)" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input className={input} placeholder="Short description" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} />
        <textarea className={input} placeholder="Full description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input className={input} placeholder="Cover image URL" value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} />
        <input className={input} placeholder="Downloadable file URL (Cloudinary)" value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} />
        <textarea className={input} placeholder="What's included (one per line)" rows={3} value={form.included} onChange={(e) => setForm({ ...form, included: e.target.value })} />
        <div className="flex gap-6 text-sm text-slate-300">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            Featured
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.premiumOnly} onChange={(e) => setForm({ ...form, premiumOnly: e.target.checked })} />
            Premium only
          </label>
        </div>
        <NeonButton type="submit" disabled={saving} className="mt-2">
          {saving ? "Saving..." : "Add Product"}
        </NeonButton>
      </form>

      <div className="flex flex-col gap-3">
        <h3 className="font-heading text-lg font-semibold text-white">All products ({products.length})</h3>
        <div className="flex flex-col gap-2">
          {products.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-3 rounded-lg border border-cyan-500/20 bg-navy-800/40 p-3">
              <div className="min-w-0">
                <p className="truncate font-medium text-white">{p.title}</p>
                <p className="text-xs text-slate-400">
                  {p.category} · {formatNaira(p.price)}
                  {p.premiumOnly ? " · Premium" : ""}
                </p>
              </div>
              <button onClick={() => deleteProduct(p.id)} className="shrink-0 text-xs text-slate-400 hover:text-red-400">
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function UpdatesTab({ updates }: { updates: UpdateDTO[] }) {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")

  async function addUpdate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMsg("")
    try {
      const res = await fetch("/api/admin/updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMsg("Update posted — it's now live on the site.")
      setTitle("")
      setDescription("")
      router.refresh()
    } catch (err: any) {
      setMsg(err.message || "Could not post update.")
    } finally {
      setSaving(false)
    }
  }

  const input = "rounded-lg border border-cyan-500/30 bg-navy-900/60 px-4 py-2.5 text-white outline-none focus:border-cyan-400 focus:shadow-neon"

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <form onSubmit={addUpdate} className="flex flex-col gap-3 rounded-xl border border-cyan-500/20 bg-navy-800/40 p-5">
        <h3 className="font-heading text-lg font-semibold text-white">Post an update</h3>
        <p className="text-xs text-slate-400">Appears instantly on the home ticker, dashboard and blog.</p>
        {msg ? <p className="text-sm text-cyan-400">{msg}</p> : null}
        <input className={input} placeholder="Title" required value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className={input} placeholder="Description" rows={4} required value={description} onChange={(e) => setDescription(e.target.value)} />
        <NeonButton type="submit" disabled={saving} className="mt-2">
          {saving ? "Posting..." : "Post Update"}
        </NeonButton>
      </form>

      <div className="flex flex-col gap-3">
        <h3 className="font-heading text-lg font-semibold text-white">Recent updates</h3>
        {updates.map((u) => (
          <div key={u.id} className="rounded-lg border border-cyan-500/20 bg-navy-800/40 p-4">
            <p className="text-xs text-cyan-400">{new Date(u.date).toLocaleDateString("en-NG")}</p>
            <p className="font-medium text-white">{u.title}</p>
            <p className="text-sm text-slate-400">{u.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
