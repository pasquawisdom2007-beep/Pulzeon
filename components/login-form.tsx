"use client"

import { useState } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthShell } from "@/components/auth-shell"
import { NeonButton } from "@/components/ui/neon-button"

export function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const callbackUrl = params.get("callbackUrl") || "/dashboard"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const res = await signIn("credentials", { email, password, redirect: false })
    setLoading(false)
    if (res?.error) {
      setError("Invalid email or password.")
      return
    }
    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to buy products and access your dashboard."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-cyan-400 hover:text-cyan-300">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error ? (
          <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-300">{error}</p>
        ) : null}
        <label className="flex flex-col gap-1 text-sm text-slate-300">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-cyan-500/30 bg-navy-900/60 px-4 py-2.5 text-white outline-none focus:border-cyan-400 focus:shadow-neon"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-300">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-cyan-500/30 bg-navy-900/60 px-4 py-2.5 text-white outline-none focus:border-cyan-400 focus:shadow-neon"
          />
        </label>
        <NeonButton type="submit" size="lg" disabled={loading} className="mt-2 w-full">
          {loading ? "Logging in..." : "Log In"}
        </NeonButton>
      </form>
    </AuthShell>
  )
}
