import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/session"
import { dbConnect } from "@/lib/mongodb"
import { Order } from "@/models/Order"
import { User } from "@/models/User"

export const runtime = "nodejs"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const { action } = await req.json()
    await dbConnect()
    const order = await Order.findById(params.id)
    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 })

    if (action === "confirm") {
      order.status = "paid"
      order.paidAt = new Date()
      await order.save()

      // Unlock: subscription orders activate premium access.
      // Product orders are unlocked automatically since ownership is
      // derived from the user's PAID product orders.
      if (order.type === "subscription") {
        const now = new Date()
        const expires = new Date(now)
        if (order.subscriptionPlan === "yearly") expires.setFullYear(expires.getFullYear() + 1)
        else expires.setMonth(expires.getMonth() + 1)

        await User.findByIdAndUpdate(order.user, {
          subscription: {
            active: true,
            plan: order.subscriptionPlan,
            startedAt: now,
            expiresAt: expires,
          },
        })
      }
      return NextResponse.json({ ok: true, status: "paid" })
    }

    if (action === "reject") {
      order.status = "rejected"
      await order.save()
      return NextResponse.json({ ok: true, status: "rejected" })
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 })
  } catch (err) {
    console.error("[v0] confirm order error:", err)
    return NextResponse.json({ error: "Could not update order." }, { status: 500 })
  }
}
