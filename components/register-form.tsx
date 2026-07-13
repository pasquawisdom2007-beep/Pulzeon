"use client"

import { useState } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { AuthShell } from "@/components/auth-shell"
import { NeonButton } from "@/components/ui/neon-button"

export function RegisterForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Something went wrong.")
        setLoading(false)
        return
      }
      // auto-login after successful signup
      await signIn("credentials", { email, password, redirect: false })
      router.push("/dashboard")
      router.refresh()
    } catch {
      setError("Network error. Please try again.")
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Sign up to purchase products and unlock Premium."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-cyan-400 hover:text-cyan-300">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error ? (
          <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-300">{error}</p>
        ) : null}
        <label className="flex flex-col gap-1 text-sm text-slate-300">
          Full name
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-cyan-500/30 bg-navy-900/60 px-4 py-2.5 text-white outline-none focus:border-cyan-400 focus:shadow-neon"
          />
        </label>
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
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-cyan-500/30 bg-navy-900/60 px-4 py-2.5 text-white outline-none focus:border-cyan-400 focus:shadow-neon"
          />
        </label>
        <NeonButton type="submit" size="lg" disabled={loading} className="mt-2 w-full">
          {loading ? "Creating account..." : "Create Account"}
        </NeonButton>
      </form>
    </AuthShell>
  )
}
