import Link from "next/link"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/session"
import { isSubscriptionActive, getProducts } from "@/lib/data"
import { NeonButton } from "@/components/ui/neon-button"
import { SITE } from "@/lib/site"

export const metadata: Metadata = { title: "Premium Area — Pulzeon" }
export const dynamic = "force-dynamic"

export default async function PremiumPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login?callbackUrl=/dashboard/premium")

  const active = await isSubscriptionActive(user.id)
  if (!active) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-heading text-3xl font-bold text-white text-glow">Premium members only</h1>
        <p className="mt-3 text-slate-400">
          This area is exclusive to active Pulzeon Premium subscribers. Subscribe to unlock exclusive monthly drops,
          early access, a VIP group invite and more.
        </p>
        <NeonButton asChild size="lg" className="mt-6">
          <Link href="/pricing">Go Premium</Link>
        </NeonButton>
      </div>
    )
  }

  const products = await getProducts()
  const drops = products.filter((p) => p.premiumOnly)
  const discountCode = "PULZEON20"

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between border-b border-cyan-500/20 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">Members only</span>
          <h1 className="font-heading text-3xl font-bold text-white text-glow">Premium Area</h1>
        </div>
        <span className="text-xs uppercase tracking-widest text-cyan-500/70">{SITE.credit}</span>
      </div>

      {/* Perks grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-cyan-400 bg-navy-800/60 p-6 shadow-neon">
          <h2 className="font-heading text-lg font-semibold text-cyan-300">Your 20% discount code</h2>
          <p className="mt-2 text-sm text-slate-400">Use this at checkout on any shop item.</p>
          <p className="mt-4 rounded-lg border border-dashed border-cyan-400/60 bg-navy-950/60 px-4 py-3 text-center font-heading text-2xl font-bold tracking-widest text-white">
            {discountCode}
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-navy-800/40 p-6">
          <h2 className="font-heading text-lg font-semibold text-white">VIP group access</h2>
          <p className="mt-2 text-sm text-slate-400">Join the members-only VIP channels for priority support.</p>
          <div className="mt-4 flex flex-col gap-3">
            <NeonButton asChild className="w-full">
              <a href={SITE.premium.vipWhatsapp} target="_blank" rel="noopener noreferrer">
                Join VIP WhatsApp
              </a>
            </NeonButton>
            <NeonButton asChild variant="outline" className="w-full">
              <a href={SITE.premium.vipTelegram} target="_blank" rel="noopener noreferrer">
                Join VIP Telegram
              </a>
            </NeonButton>
          </div>
        </div>
      </div>

      {/* Monthly drops */}
      <section className="mt-10">
        <h2 className="mb-4 font-heading text-xl font-semibold text-white">Exclusive monthly drops</h2>
        {drops.length === 0 ? (
          <p className="text-slate-400">The next exclusive drop is coming soon. Check back shortly.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {drops.map((p) => (
              <div key={p.id} className="rounded-xl border border-cyan-500/20 bg-navy-800/40 p-6">
                <h3 className="font-heading text-lg font-semibold text-white">{p.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{p.description}</p>
                <ul className="mt-3 flex flex-col gap-1">
                  {p.included.map((i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400 shadow-neon" />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
