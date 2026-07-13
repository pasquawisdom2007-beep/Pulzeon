import Link from "next/link"
import { getLatestUpdate } from "@/lib/data"

export async function UpdateTicker() {
  const update = await getLatestUpdate()
  if (!update) return null

  return (
    <Link
      href="/blog"
      className="group block border-y border-cyan-500/20 bg-navy-900/60 py-2 backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-hidden px-4">
        <span className="flex shrink-0 items-center gap-2 rounded-full border border-cyan-400/40 bg-navy-950 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-300">
          <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400 shadow-neon" />
          Latest
        </span>
        <p className="truncate text-sm text-slate-300 transition-colors group-hover:text-cyan-300">
          <span className="font-semibold text-white">{update.title}</span>
          {" — "}
          {update.description}
        </p>
      </div>
    </Link>
  )
}
