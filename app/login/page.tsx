import type { Metadata } from "next"
import { Suspense } from "react"
import { LoginForm } from "@/components/login-form"

export const metadata: Metadata = {
  title: "Log In — Pulzeon",
  description: "Log in to your Pulzeon account.",
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
