"use client"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { NeonButton } from "@/components/ui/neon-button"

export function SubscribeButton({
  plan,
  label,
  variant = "solid",
}: {
  plan: "monthly" | "yearly"
  label: string
  variant?: "solid" | "outline"
}) {
  const { status } = useSession()
  const router = useRouter()

  function handleClick() {
    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=/checkout?plan=${plan}`)
      return
    }
    router.push(`/checkout?plan=${plan}`)
  }

  return (
    <NeonButton onClick={handleClick} size="lg" variant={variant} className="w-full">
      {label}
    </NeonButton>
  )
}
