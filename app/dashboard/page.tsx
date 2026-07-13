import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/session"
import { getDashboardData, getLatestUpdate } from "@/lib/data"
import { NeonButton } from "@/components/ui/neon-button"
import { formatNaira, SITE } from "@/lib/site"

export const metadata: Metadata = { title: "Dashboard — Pulzeon" }
export const dynamic = "force-dynamic"

function statusBadge(status: string) {
  const map: Record<string, string> = {
    paid: "border-cyan-400/50 bg-cyan-400/10 text-cyan-300",
    pending: "border-amber-400/50 bg-amber-400/10 text-amber-300",
    rejected: "border-red-400/50 bg-red-400/10 text-red-300",
  }
  return map[status] || "border-slate-500/40 bg-slate-500/10 text-slate-300"
}

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login?callbackUrl=/dashboard")

  const [data, update] = await Promise.all([getDashboardData(user.id), getLatestUpdate()])

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Header with branding */}
      <div className="mb-8 flex flex-col gap-1 border-b border-cyan-500/20 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-heading text-3xl font-bold text-white text-glow">Dashboard</h1>
          <span className="text-xs uppercase tracking-widest text-cyan-500/70">{SITE.credit}</span>
        </div>
        <p className="text-slate-400">Welcome back, {user.name || user.email}.</p>
      </div>

      {/* Latest update banner */}
      {update ? (
        <div className="mb-8 flex items-start gap-3 rounded-xl border border-cyan-500/20 bg-navy-800/40 p-4">
          <span className="mt-1 h-2 w-2 shrink-0 animate-pulse rounded-full bg-cyan-400 shadow-neon" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-400">Latest update</p>
            <p className="font-medium text-white">{update.title}</p>
            <p className="text-sm text-slate-400">{update.description}</p>
          </div>
        </div>
      ) : null}

      {/* Subscription status */}
      <section className="mb-10 rounded-2xl border border-cyan-500/30 bg-navy-800/50 p-6 shadow-neon">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-semibold text-white">Pulzeon Premium</h2>
            {data.subscription.active ? (
              <p className="mt-1 text-sm text-cyan-300">
                Active ({data.subscription.plan})
                {data.subscription.expiresAt
                  ? ` · renews/expires ${new Date(data.subscription.expiresAt).toLocaleDateString("en-NG")}`
                  : ""}
              </p>
            ) : (
              <p className="mt-1 text-sm text-slate-400">You don&apos;t have an active subscription.</p>
            )}
          </div>
          {data.subscription.active ? (
            <NeonButton asChild>
              <Link href="/dashboard/premium">Open Premium Area</Link>
            </NeonButton>
          ) : (
            <NeonButton asChild variant="outline">
              <Link href="/pricing">Go Premium</Link>
            </NeonButton>
          )}
        </div>
      </section>

      {/* Owned products */}
      <section className="mb-10">
        <h2 className="mb-4 font-heading text-xl font-semibold text-white">Your products</h2>
        {data.ownedProducts.length === 0 ? (
          <div className="rounded-xl border border-cyan-500/20 bg-navy-800/40 p-8 text-center">
            <p className="text-slate-400">You haven&apos;t purchased any products yet.</p>
            <NeonButton asChild className="mt-4">
              <Link href="/shop">Browse the Shop</Link>
            </NeonButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.ownedProducts.map((p) => (
              <div key={p.id} className="flex flex-col gap-3 rounded-xl border border-cyan-500/20 bg-navy-800/40 p-4">
                <div className="relative aspect-video overflow-hidden rounded-lg border border-cyan-500/20">
                  <Image
                    src={p.coverImage || "/placeholder.svg"}
                    alt={p.title}
                    fill
                    sizes="33vw"
                    className="object-cover"
                  />
                </div>
                <h3 className="font-medium text-white">{p.title}</h3>
                <NeonButton asChild className="mt-auto w-full">
                  <a href={`/api/download/${p.orderRef}?product=${p.id}`}>Download</a>
                </NeonButton>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Order history */}
      <section>
        <h2 className="mb-4 font-heading text-xl font-semibold text-white">Order history</h2>
        {data.orders.length === 0 ? (
          <p className="text-slate-400">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-cyan-500/20">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="bg-navy-800/60 text-left text-slate-300">
                  <th className="p-4 font-semibold">Item</th>
                  <th className="p-4 font-semibold">Amount</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.orders.map((o) => (
                  <tr key={o.id} className="border-t border-cyan-500/10 text-slate-300">
                    <td className="p-4">
                      {o.type === "subscription"
                        ? `Premium (${o.subscriptionPlan})`
                        : o.itemTitles.join(", ") || "Product order"}
                    </td>
                    <td className="p-4 text-cyan-400">{formatNaira(o.amount)}</td>
                    <td className="p-4">
                      <span className={"rounded-full border px-3 py-1 text-xs font-medium " + statusBadge(o.status)}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-4">{new Date(o.createdAt).toLocaleDateString("en-NG")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
