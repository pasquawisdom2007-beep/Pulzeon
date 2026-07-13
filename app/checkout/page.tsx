import type { Metadata } from "next"
import { Suspense } from "react"
import { CheckoutClient } from "@/components/checkout-client"

export const metadata: Metadata = {
  title: "Checkout — Pulzeon",
  description: "Complete your purchase via secure Opay transfer.",
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutClient />
    </Suspense>
  )
}
