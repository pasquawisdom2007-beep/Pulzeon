import Link from "next/link"
import type { Metadata } from "next"
import { getFeaturedProducts } from "@/lib/data"
import { ProductCard } from "@/components/product-card"
import { SectionHeading } from "@/components/section-heading"
import { UpdateTicker } from "@/components/update-ticker"
import { NeonButton } from "@/components/ui/neon-button"
import { SITE } from "@/lib/site"

export const metadata: Metadata = {
  title: "Pulzeon — Premium Digital Products & Templates",
  description:
    "Buy ATS CVs, business plans, Canva bundles, past questions, source code and more. Go Pulzeon Premium for exclusive monthly drops.",
}

const testimonials = [
  {
    name: "Chidera A.",
    role: "Graduate, Lagos",
    quote: "The ATS CV pack got me shortlisted in a week. Clean templates and super easy to edit.",
  },
  {
    name: "Emeka O.",
    role: "Developer",
    quote: "The source code packs saved me days of work. Well commented and ready to deploy.",
  },
  {
    name: "Blessing U.",
    role: "JAMB Candidate",
    quote: "Past questions with explanations made revision so much faster. Worth every naira.",
  },
]

export default async function HomePage() {
  const featured = await getFeaturedProducts(4)

  return (
    <div>
      <UpdateTicker />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-20 text-center sm:py-28">
          <span className="rounded-full border border-cyan-400/40 bg-navy-900/60 px-4 py-1.5 text-sm font-medium text-cyan-300 backdrop-blur-sm">
            Digital products for the ambitious
          </span>
          <h1 className="max-w-4xl text-balance font-heading text-4xl font-extrabold leading-tight text-white text-glow sm:text-6xl">
            Level up with premium <span className="text-cyan-400">digital templates</span> &amp; tools
          </h1>
          <p className="max-w-2xl text-pretty text-lg leading-relaxed text-slate-300">
            CVs, business plans, Canva bundles, past questions, source code and more — instant downloads, built to help
            you win. Go Premium for exclusive monthly drops.
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
            <NeonButton asChild size="lg">
              <Link href="/shop">Browse the Shop</Link>
            </NeonButton>
            <NeonButton asChild size="lg" variant="outline">
              <Link href="/pricing">Go Premium</Link>
            </NeonButton>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Best sellers" title="Featured products" subtitle="Our most popular digital packs." />
          <Link href="/shop" className="text-sm font-semibold text-cyan-400 hover:text-cyan-300">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Subscription pitch */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-navy-800/50 p-8 shadow-neon sm:p-12">
          <div className="relative z-10 flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="text-sm font-semibold uppercase tracking-widest text-cyan-400">Pulzeon Premium</span>
              <h2 className="mt-2 text-balance font-heading text-3xl font-bold text-white sm:text-4xl">
                Unlock exclusive monthly drops &amp; 20% off everything
              </h2>
              <p className="mt-3 text-pretty leading-relaxed text-slate-300">
                Early access to new templates, a members-only template drop each month, a VIP group invite and priority
                support — from just ₦2,000/month.
              </p>
            </div>
            <NeonButton asChild size="lg">
              <Link href="/pricing">See Premium Plans</Link>
            </NeonButton>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeading center eyebrow="Loved by buyers" title="What people are saying" />
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col gap-4 rounded-xl border border-cyan-500/20 bg-navy-800/40 p-6 backdrop-blur-sm"
            >
              <blockquote className="text-pretty leading-relaxed text-slate-300">{`"${t.quote}"`}</blockquote>
              <figcaption className="mt-auto">
                <div className="font-semibold text-white">{t.name}</div>
                <div className="text-sm text-cyan-400">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h2 className="text-balance font-heading text-3xl font-bold text-white text-glow sm:text-4xl">
          Ready to get started?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-pretty leading-relaxed text-slate-300">
          Create a free account and start downloading premium digital products today.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <NeonButton asChild size="lg">
            <Link href="/register">Create Account</Link>
          </NeonButton>
          <NeonButton asChild size="lg" variant="outline">
            <Link href="/contact">Contact {SITE.name}</Link>
          </NeonButton>
        </div>
      </section>
    </div>
  )
}
