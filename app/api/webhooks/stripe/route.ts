import { headers } from "next/headers"
import Stripe from "stripe"
import { dbConnect } from "@/lib/mongodb"
import { Subscription } from "@/models/Subscription"
import { AiCredit } from "@/models/AiCredit"
import { envConfig } from "@/lib/env-config"

// Only initialize Stripe if key is available
const stripe = envConfig.stripeSecretKey
  ? new Stripe(envConfig.stripeSecretKey, {
      apiVersion: "2024-06-20",
    })
  : null

export async function POST(req: Request) {
  try {
    if (!envConfig.stripeSecretKey || !stripe) {
      return new Response("Stripe not configured", { status: 503 })
    }

    const body = await req.text()
    const headersList = await headers()
    const signature = headersList.get("stripe-signature") || ""

    let event: Stripe.Event

    try {
      event = stripe!.webhooks.constructEvent(body, signature, envConfig.stripeWebhookSecret)
    } catch (error) {
      console.error("[v0] Stripe signature verification failed:", error)
      return new Response("Invalid signature", { status: 400 })
    }

    await dbConnect()

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.client_reference_id

        if (userId) {
          // Create or update subscription
          const subscription = await Subscription.findOneAndUpdate(
            { userId },
            {
              userId,
              plan: "monthly",
              status: "active",
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              startDate: new Date(),
              endDate: null,
              price: session.amount_total || 0,
              features: {
                videoUpscaler4k: true,
                videoEditor: true,
                socialAutoPosting: true,
                pasquaAi: true,
                aiCredits: 100, // 100 credits per month with subscription
              },
            },
            { upsert: true, new: true },
          )

          // Update or create AI credits
          const credits = await AiCredit.findOneAndUpdate(
            { userId },
            {
              userId,
              subscriptionCredits: 100,
              totalCredits: 100,
              remainingCredits: 100,
            },
            { upsert: true, new: true },
          )

          console.log("[v0] Subscription activated for user:", userId)
        }
        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        // Find subscription by Stripe customer ID and update renewal date
        const subscription = await Subscription.findOneAndUpdate(
          { stripeCustomerId: customerId },
          {
            status: "active",
            endDate: null,
          },
          { new: true },
        )

        if (subscription) {
          // Reset monthly credits
          await AiCredit.findOneAndUpdate(
            { userId: subscription.userId },
            {
              subscriptionCredits: 100,
              totalCredits: 100,
              remainingCredits: 100,
              usedCredits: 0,
            },
            { new: true },
          )

          console.log("[v0] Subscription renewed for user:", subscription.userId)
        }
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        // Mark subscription as cancelled/expired
        const subscription = await Subscription.findOneAndUpdate({ stripeCustomerId: customerId }, { status: "cancelled" }, { new: true })

        console.log("[v0] Subscription payment failed for user:", subscription?.userId)
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Mark subscription as cancelled
        await Subscription.findOneAndUpdate({ stripeCustomerId: customerId }, { status: "cancelled" }, { new: true })

        console.log("[v0] Subscription cancelled")
        break
      }

      default:
        console.log(`[v0] Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (error) {
    console.error("[v0] Webhook error:", error)
    return new Response("Webhook processing failed", { status: 500 })
  }
}
