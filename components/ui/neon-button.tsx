"use client"

import Link from "next/link"
import { forwardRef } from "react"

type Variant = "primary" | "outline" | "ghost"
type Size = "sm" | "md" | "lg"

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold tracking-wide transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan/70 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97]"

const variants: Record<Variant, string> = {
  primary:
    "bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/50 hover:bg-neon-cyan/25 hover:shadow-neon-lg hover:scale-[1.03] shadow-neon",
  outline:
    "bg-transparent text-foreground border border-border hover:border-neon-cyan/60 hover:text-neon-cyan hover:shadow-neon",
  ghost:
    "bg-transparent text-muted-foreground hover:text-neon-cyan hover:bg-white/5",
}

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
}

type CommonProps = {
  variant?: Variant
  size?: Size
  className?: string
  children: React.ReactNode
}

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined
  }

type ButtonAsLink = CommonProps & {
  href: string
}

export const NeonButton = forwardRef<HTMLButtonElement, ButtonAsButton | ButtonAsLink>(
  function NeonButton({ variant = "primary", size = "md", className = "", children, ...props }, ref) {
    const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`
    if ("href" in props && props.href) {
      return (
        <Link href={props.href} className={cls}>
          {children}
        </Link>
      )
    }
    return (
      <button ref={ref} className={cls} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
        {children}
      </button>
    )
  },
)
