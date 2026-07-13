import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/session"
import { dbConnect } from "@/lib/mongodb"
import { Order } from "@/models/Order"
import { Product } from "@/models/Product"

export const runtime = "nodejs"

/**
 * Secure download gate. Verifies the logged-in user owns a PAID order that
 * contains the requested product, then redirects to the product file URL.
 */
export async function GET(req: Request, { params }: { params: { orderRef: string } }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const productId = searchParams.get("product")
  if (!productId) return NextResponse.json({ error: "Missing product" }, { status: 400 })

  await dbConnect()
  const order: any = await Order.findOne({
    _id: params.orderRef,
    user: user.id,
    status: "paid",
  }).lean()

  if (!order) return NextResponse.json({ error: "No paid order found for this item." }, { status: 403 })

  const owns = (order.items || []).some((i: any) => i.productId?.toString() === productId)
  if (!owns) return NextResponse.json({ error: "You do not own this product." }, { status: 403 })

  const product: any = await Product.findById(productId).lean()
  if (!product?.fileUrl) {
    return NextResponse.json({ error: "Download not available yet. Please contact support." }, { status: 404 })
  }

  return NextResponse.redirect(product.fileUrl)
}
