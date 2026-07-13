import Link from "next/link"
import { SITE } from "@/lib/site"

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/60 bg-background/60">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-neon-cyan/60 bg-neon-cyan/10 text-neon-cyan shadow-neon">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
              </svg>
            </span>
            <span className="text-lg font-bold">{SITE.name}</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {SITE.tagline}. Digital templates, past questions, source code and premium drops.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/shop" className="hover:text-neon-cyan">Shop</Link></li>
            <li><Link href="/pricing" className="hover:text-neon-cyan">Premium</Link></li>
            <li><Link href="/blog" className="hover:text-neon-cyan">Updates & Blog</Link></li>
            <li><Link href="/dashboard" className="hover:text-neon-cyan">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">Support</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/faq" className="hover:text-neon-cyan">FAQ</Link></li>
            <li><Link href="/contact" className="hover:text-neon-cyan">Contact</Link></li>
            <li><Link href="/terms" className="hover:text-neon-cyan">Terms & Refund Policy</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">Join the community</h3>
          <div className="mt-3 flex flex-col gap-2">
            <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-neon-cyan/40 px-3 py-2 text-sm text-neon-cyan transition-all hover:shadow-neon">
              WhatsApp Channel
            </a>
            <a href={SITE.telegram} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-neon-blue/40 px-3 py-2 text-sm text-neon-cyan transition-all hover:shadow-neon-blue">
              Telegram Channel
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border/60 py-6">
        <p className="text-center text-sm font-semibold tracking-wide text-neon-cyan text-glow-soft">
          {SITE.credit}
        </p>
        <p className="mt-1 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
