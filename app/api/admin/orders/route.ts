import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/session"
import { dbConnect } from "@/lib/mongodb"
import { Order } from "@/models/Order"

export const runtime = "nodejs"

export async function GET(req: Request) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  await dbConnect()
  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")
  const query = status ? { status } : {}
  const orders = await Order.find(query).sort({ createdAt: -1 }).lean()
  return NextResponse.json({
    orders: orders.map((o: any) => ({
      id: o._id.toString(),
      userEmail: o.userEmail,
      type: o.type,
      items: (o.items || []).map((i: any) => ({ title: i.title, price: i.price })),
      subscriptionPlan: o.subscriptionPlan,
      amount: o.amount,
      status: o.status,
      reference: o.reference,
      proofUrl: o.proofUrl,
      createdAt: o.createdAt,
    })),
  })
}
