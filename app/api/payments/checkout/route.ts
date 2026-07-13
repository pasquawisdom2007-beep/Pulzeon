import Stripe from "stripe"
import { getCurrentUser } from "@/lib/session"
import { envConfig } from "@/lib/env-config"

// Only initialize Stripe if key is available
const stripe = envConfig.stripeSecretKey 
  ? new Stripe(envConfig.stripeSecretKey, {
      apiVersion: "2024-06-20",
    })
  : null

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    if (!envConfig.stripeEnabled || !stripe) {
      return new Response(
        JSON.stringify({
          error: "Payments are not enabled. Please configure Stripe API keys.",
        }),
        { status: 503 },
      )
    }

    const { planType } = await req.json()

    if (!planType || !["monthly", "yearly"].includes(planType)) {
      return new Response(JSON.stringify({ error: "Invalid plan type" }), { status: 400 })
    }

    // Define pricing (in cents)
    const pricing = {
      monthly: {
        name: "Pulzeon Pro - Monthly",
        amount: 4999, // $49.99/month
        description: "Unlimited video tools, AI, and social posting",
      },
      yearly: {
        name: "Pulzeon Pro - Yearly",
        amount: 49999, // $499.99/year (saves ~$100)
        description: "Unlimited video tools, AI, and social posting (annual billing)",
      },
    }

    const plan = pricing[planType as keyof typeof pricing]

    // Create Stripe checkout session
    const session = await stripe!.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan.name,
              description: plan.description,
            },
            unit_amount: plan.amount,
            recurring: {
              interval: planType === "monthly" ? "month" : "year",
              interval_count: 1,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${envConfig.nextAuthUrl}/dashboard?checkout=success`,
      cancel_url: `${envConfig.nextAuthUrl}/pricing?checkout=cancelled`,
      client_reference_id: user.id,
      customer_email: user.email,
    })

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        sessionUrl: session.url,
      }),
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Payment error:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to create checkout session",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500 },
    )
  }
}
