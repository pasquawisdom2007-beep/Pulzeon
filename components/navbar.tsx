"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { useState } from "react"
import { useCart } from "@/components/cart-context"
import { SITE } from "@/lib/site"

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/pricing", label: "Premium" },
  { href: "/blog", label: "Updates" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { count } = useCart()
  const [open, setOpen] = useState(false)
  const isAdmin = (session?.user as any)?.role === "admin"

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5">
        <Link href="/" className="flex items-center gap-2" aria-label="Pulzeon home">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-neon-cyan/60 bg-neon-cyan/10 text-neon-cyan shadow-neon">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
              <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" fill="currentColor" />
            </svg>
          </span>
          <span className="text-xl font-bold tracking-tight text-glow-soft">{SITE.name}</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-neon-cyan ${
                pathname === l.href ? "text-neon-cyan text-glow-soft" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className="relative rounded-md p-2 text-muted-foreground transition-colors hover:text-neon-cyan"
            aria-label={`Cart with ${count} items`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-neon-cyan px-1 text-[11px] font-bold text-background">
                {count}
              </span>
            )}
          </Link>

          {session ? (
            <div className="hidden items-center gap-2 md:flex">
              {isAdmin && (
                <Link href="/admin" className="rounded-md px-3 py-2 text-sm font-medium text-neon-cyan hover:text-glow-soft">
                  Admin
                </Link>
              )}
              <Link href="/dashboard" className="rounded-md border border-border px-3 py-2 text-sm font-medium hover:border-neon-cyan/60 hover:text-neon-cyan">
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-neon-cyan"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/login" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-neon-cyan">
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg border border-neon-cyan/50 bg-neon-cyan/15 px-4 py-2 text-sm font-semibold text-neon-cyan shadow-neon transition-all hover:scale-105 hover:shadow-neon-lg"
              >
                Sign up
              </Link>
            </div>
          )}

          <button
            className="rounded-md p-2 text-muted-foreground md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
              {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border/60 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  pathname === l.href ? "bg-white/5 text-neon-cyan" : "text-muted-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-border/60" />
            {session ? (
              <>
                {isAdmin && (
                  <Link href="/admin" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-neon-cyan">
                    Admin
                  </Link>
                )}
                <Link href="/dashboard" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium">
                  Dashboard
                </Link>
                <button
                  onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }) }}
                  className="rounded-md px-3 py-2 text-left text-sm font-medium text-muted-foreground"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium">
                  Login
                </Link>
                <Link href="/register" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-semibold text-neon-cyan">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
