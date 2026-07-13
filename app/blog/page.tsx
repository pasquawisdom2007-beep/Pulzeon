import type { Metadata } from "next"
import { getUpdates } from "@/lib/data"
import { SectionHeading } from "@/components/section-heading"

export const metadata: Metadata = {
  title: "Updates & Blog — Pulzeon",
  description: "Latest Pulzeon announcements, product drops and updates.",
}

export const dynamic = "force-dynamic"

export default async function BlogPage() {
  const updates = await getUpdates()

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <SectionHeading
        eyebrow="News"
        title="Updates & announcements"
        subtitle="Everything new at Pulzeon — new products, premium drops and platform updates."
      />

      <div className="mt-10 flex flex-col gap-6">
        {updates.length === 0 ? (
          <p className="text-slate-400">No updates yet. Check back soon.</p>
        ) : (
          updates.map((u) => (
            <article
              key={u.id}
              className="rounded-xl border border-cyan-500/20 bg-navy-800/40 p-6 transition-colors hover:border-cyan-400/50"
            >
              <time className="text-xs font-medium uppercase tracking-wide text-cyan-400">
                {new Date(u.date).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })}
              </time>
              <h2 className="mt-2 font-heading text-xl font-semibold text-white">{u.title}</h2>
              <p className="mt-2 text-pretty leading-relaxed text-slate-300">{u.description}</p>
            </article>
          ))
        )}
      </div>
    </div>
  )
}
