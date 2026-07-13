import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/session"
import { getAdminOrders, getAdminProducts, getAdminStats, getUpdates } from "@/lib/data"
import { AdminPanel } from "@/components/admin/admin-panel"
import { SITE } from "@/lib/site"

export const metadata: Metadata = { title: "Admin — Pulzeon" }
export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login?callbackUrl=/admin")
  if (user.role !== "admin") redirect("/dashboard")

  const [stats, orders, products, updates] = await Promise.all([
    getAdminStats(),
    getAdminOrders(),
    getAdminProducts(),
    getUpdates(),
  ])

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-6">
        <h1 className="font-heading text-3xl font-bold text-white text-glow">Admin Panel</h1>
        <span className="text-xs uppercase tracking-widest text-cyan-500/70">{SITE.credit}</span>
      </div>
      <AdminPanel stats={stats} initialOrders={orders} initialProducts={products} initialUpdates={updates} />
    </div>
  )
}
