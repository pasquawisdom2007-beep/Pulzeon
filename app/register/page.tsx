import type { Metadata } from "next"
import { Suspense } from "react"
import { RegisterForm } from "@/components/register-form"

export const metadata: Metadata = {
  title: "Sign Up — Pulzeon",
  description: "Create a Pulzeon account to buy digital products.",
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  )
}
