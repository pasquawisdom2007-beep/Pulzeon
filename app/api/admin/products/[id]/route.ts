import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/session"
import { dbConnect } from "@/lib/mongodb"
import { Product } from "@/models/Product"

export const runtime = "nodejs"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  try {
    const body = await req.json()
    await dbConnect()
    const update: Record<string, any> = {}
    for (const key of ["title", "category", "shortDescription", "description", "coverImage", "fileUrl", "featured", "premiumOnly"]) {
      if (key in body) update[key] = body[key]
    }
    if ("price" in body) update.price = Number(body.price)
    if ("included" in body) {
      update.included = Array.isArray(body.included)
        ? body.included
        : String(body.included || "").split("\n").map((s: string) => s.trim()).filter(Boolean)
    }
    const product = await Product.findByIdAndUpdate(params.id, update, { new: true })
    if (!product) return NextResponse.json({ error: "Not found." }, { status: 404 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[v0] update product error:", err)
    return NextResponse.json({ error: "Could not update product." }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  await dbConnect()
  await Product.findByIdAndDelete(params.id)
  return NextResponse.json({ ok: true })
}
