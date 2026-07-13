import Link from "next/link"
import { SITE } from "@/lib/site"

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
  footer: React.ReactNode
}) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <div className="rounded-2xl border border-cyan-500/30 bg-navy-800/50 p-8 shadow-neon backdrop-blur-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="font-heading text-2xl font-extrabold text-white text-glow">
            Pul<span className="text-cyan-400">zeon</span>
          </Link>
          <h1 className="mt-4 font-heading text-2xl font-bold text-white">{title}</h1>
          <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
        </div>
        {children}
        <div className="mt-6 text-center text-sm text-slate-400">{footer}</div>
      </div>
      <p className="mt-6 text-center text-xs uppercase tracking-widest text-cyan-500/70">{SITE.credit}</p>
    </div>
  )
}
