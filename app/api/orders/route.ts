import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/session"
import { dbConnect } from "@/lib/mongodb"
import { Order } from "@/models/Order"
import { Product } from "@/models/Product"
import { SITE } from "@/lib/site"

export const runtime = "nodejs"

/**
 * Creates a PENDING order from a manual Opay transfer.
 * The order is unlocked later when an admin confirms the payment.
 *
 * Payment provider is abstracted (paymentMethod field) so a gateway like
 * Paystack/Flutterwave can be added later without changing this flow.
 */
export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Please log in to place an order." }, { status: 401 })

  try {
    const body = await req.json()
    const { type, productIds, subscriptionPlan, reference, proofUrl } = body

    await dbConnect()

    if (type === "subscription") {
      if (!["monthly", "yearly"].includes(subscriptionPlan)) {
        return NextResponse.json({ error: "Invalid subscription plan." }, { status: 400 })
      }
      const amount = subscriptionPlan === "monthly" ? SITE.premium.monthly : SITE.premium.yearly
      const order = await Order.create({
        user: user.id,
        userEmail: user.email,
        type: "subscription",
        items: [],
        subscriptionPlan,
        amount,
        status: "pending",
        paymentMethod: "manual-opay",
        reference: reference || "",
        proofUrl: proofUrl || "",
      })
      return NextResponse.json({ ok: true, orderId: order._id.toString() }, { status: 201 })
    }

    // product order
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ error: "No products selected." }, { status: 400 })
    }
    const products = await Product.find({ _id: { $in: productIds } }).lean()
    if (products.length === 0) {
      return NextResponse.json({ error: "Products not found." }, { status: 400 })
    }
    const items = products.map((p: any) => ({ productId: p._id, title: p.title, price: p.price }))
    const amount = items.reduce((s, i) => s + i.price, 0)

    const order = await Order.create({
      user: user.id,
      userEmail: user.email,
      type: "product",
      items,
      amount,
      status: "pending",
      paymentMethod: "manual-opay",
      reference: reference || "",
      proofUrl: proofUrl || "",
    })
    return NextResponse.json({ ok: true, orderId: order._id.toString() }, { status: 201 })
  } catch (err) {
    console.error("[v0] create order error:", err)
    return NextResponse.json({ error: "Could not create order." }, { status: 500 })
  }
}

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await dbConnect()
  const orders = await Order.find({ user: user.id }).sort({ createdAt: -1 }).lean()
  return NextResponse.json({
    orders: orders.map((o: any) => ({
      id: o._id.toString(),
      type: o.type,
      amount: o.amount,
      status: o.status,
      createdAt: o.createdAt,
    })),
  })
}
