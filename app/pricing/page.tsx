import type { Metadata } from "next"
import { SectionHeading } from "@/components/section-heading"
import { SubscribeButton } from "@/components/subscribe-button"
import { formatNaira, SITE } from "@/lib/site"

export const metadata: Metadata = {
  title: "Pricing — Pulzeon Premium",
  description: "Go Pulzeon Premium for exclusive monthly template drops, early access, a VIP group and 20% off.",
}

const features = [
  "Access to all free updates",
  "Early access to new templates",
  "Exclusive monthly template drop",
  "Private VIP WhatsApp/Telegram group",
  "20% discount code on shop items",
  "Priority support response",
]

const freeIncluded = [true, false, false, false, false, false]
const premiumIncluded = [true, true, true, true, true, true]

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <SectionHeading
        center
        eyebrow="Pricing"
        title="Simple pricing, serious value"
        subtitle="Buy products individually, or go Premium for exclusive perks refreshed every month."
      />

      <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
        {/* Free */}
        <div className="flex flex-col gap-4 rounded-2xl border border-cyan-500/20 bg-navy-800/40 p-6">
          <h3 className="font-heading text-xl font-bold text-white">Free</h3>
          <p className="font-heading text-3xl font-extrabold text-white">₦0</p>
          <p className="text-sm text-slate-400">Browse and buy products individually.</p>
          <ul className="mt-2 flex flex-1 flex-col gap-2 text-sm text-slate-300">
            <li>Buy any product one-time</li>
            <li>Instant downloads</li>
            <li>Access to your dashboard</li>
          </ul>
        </div>

        {/* Monthly */}
        <div className="relative flex flex-col gap-4 rounded-2xl border border-cyan-400 bg-navy-800/60 p-6 shadow-neon">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-cyan-400 bg-navy-950 px-3 py-1 text-xs font-semibold text-cyan-300">
            Most popular
          </span>
          <h3 className="font-heading text-xl font-bold text-cyan-300">Premium Monthly</h3>
          <p className="font-heading text-3xl font-extrabold text-white">
            {formatNaira(SITE.premium.monthly)}
            <span className="text-base font-medium text-slate-400">/mo</span>
          </p>
          <p className="text-sm text-slate-400">All premium perks, billed monthly.</p>
          <ul className="mt-2 flex flex-1 flex-col gap-2 text-sm text-slate-300">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400 shadow-neon" />
                {f}
              </li>
            ))}
          </ul>
          <SubscribeButton plan="monthly" label="Subscribe Monthly" />
        </div>

        {/* Yearly */}
        <div className="flex flex-col gap-4 rounded-2xl border border-cyan-500/20 bg-navy-800/40 p-6">
          <h3 className="font-heading text-xl font-bold text-white">Premium Yearly</h3>
          <p className="font-heading text-3xl font-extrabold text-white">
            {formatNaira(SITE.premium.yearly)}
            <span className="text-base font-medium text-slate-400">/yr</span>
          </p>
          <p className="text-sm text-cyan-400">Save {formatNaira(SITE.premium.monthly * 12 - SITE.premium.yearly)} a year</p>
          <ul className="mt-2 flex flex-1 flex-col gap-2 text-sm text-slate-300">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400 shadow-neon" />
                {f}
              </li>
            ))}
          </ul>
          <SubscribeButton plan="yearly" label="Subscribe Yearly" variant="outline" />
        </div>
      </div>

      {/* Comparison table */}
      <div className="mt-16 overflow-x-auto">
        <h2 className="mb-6 text-center font-heading text-2xl font-bold text-white">Feature comparison</h2>
        <table className="w-full min-w-[520px] border-collapse overflow-hidden rounded-xl border border-cyan-500/20">
          <thead>
            <tr className="bg-navy-800/60 text-left">
              <th className="p-4 font-heading text-sm font-semibold text-white">Feature</th>
              <th className="p-4 text-center font-heading text-sm font-semibold text-slate-300">Free</th>
              <th className="p-4 text-center font-heading text-sm font-semibold text-cyan-300">Premium</th>
            </tr>
          </thead>
          <tbody>
            {features.map((f, i) => (
              <tr key={f} className="border-t border-cyan-500/10">
                <td className="p-4 text-sm text-slate-300">{f}</td>
                <td className="p-4 text-center text-sm">
                  <span className={freeIncluded[i] ? "text-cyan-400" : "text-slate-600"}>
                    {freeIncluded[i] ? "✓" : "—"}
                  </span>
                </td>
                <td className="p-4 text-center text-sm">
                  <span className={premiumIncluded[i] ? "text-cyan-400" : "text-slate-600"}>
                    {premiumIncluded[i] ? "✓" : "—"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
