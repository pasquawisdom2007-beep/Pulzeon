import type { Metadata } from "next"
import Link from "next/link"
import { SectionHeading } from "@/components/section-heading"
import { NeonButton } from "@/components/ui/neon-button"
import { SITE } from "@/lib/site"

export const metadata: Metadata = {
  title: "Contact & Support — Pulzeon",
  description: "Get support from Pulzeon via our WhatsApp and Telegram channels.",
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <SectionHeading
        center
        eyebrow="Support"
        title="Get in touch"
        subtitle="Questions about a product, your order or Premium? Reach us on our channels — we respond fast."
      />

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-cyan-500/20 bg-navy-800/40 p-8 text-center">
          <h2 className="font-heading text-xl font-semibold text-white">WhatsApp Channel</h2>
          <p className="text-sm text-slate-400">Follow for updates and quick support.</p>
          <NeonButton asChild className="w-full">
            <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer">
              Chat on WhatsApp
            </a>
          </NeonButton>
        </div>
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-cyan-500/20 bg-navy-800/40 p-8 text-center">
          <h2 className="font-heading text-xl font-semibold text-white">Telegram Channel</h2>
          <p className="text-sm text-slate-400">Join for announcements and drops.</p>
          <NeonButton asChild variant="outline" className="w-full">
            <a href={SITE.telegram} target="_blank" rel="noopener noreferrer">
              Join Telegram
            </a>
          </NeonButton>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-cyan-500/20 bg-navy-800/40 p-8 text-center">
        <p className="text-slate-300">
          Prefer to browse first? Check our{" "}
          <Link href="/faq" className="text-cyan-400 hover:text-cyan-300">
            FAQ
          </Link>{" "}
          or head to the{" "}
          <Link href="/shop" className="text-cyan-400 hover:text-cyan-300">
            Shop
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
