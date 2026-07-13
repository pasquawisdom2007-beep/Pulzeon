import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/session"
import { dbConnect } from "@/lib/mongodb"
import { Product } from "@/models/Product"

export const runtime = "nodejs"

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60)
}

export async function GET() {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  await dbConnect()
  const products = await Product.find().sort({ createdAt: -1 }).lean()
  return NextResponse.json({
    products: products.map((p: any) => ({
      id: p._id.toString(),
      title: p.title,
      category: p.category,
      price: p.price,
      premiumOnly: !!p.premiumOnly,
      featured: !!p.featured,
    })),
  })
}

export async function POST(req: Request) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  try {
    const body = await req.json()
    const { title, category, shortDescription, description, price, coverImage, fileUrl, included, featured, premiumOnly } = body
    if (!title || !category || price == null) {
      return NextResponse.json({ error: "Title, category and price are required." }, { status: 400 })
    }
    await dbConnect()
    let slug = slugify(title)
    if (await Product.findOne({ slug })) slug = `${slug}-${Date.now().toString(36).slice(-4)}`

    const product = await Product.create({
      title,
      slug,
      category,
      shortDescription: shortDescription || "",
      description: description || "",
      price: Number(price),
      coverImage: coverImage || "",
      fileUrl: fileUrl || "",
      included: Array.isArray(included) ? included : String(included || "").split("\n").map((s) => s.trim()).filter(Boolean),
      featured: !!featured,
      premiumOnly: !!premiumOnly,
    })
    return NextResponse.json({ ok: true, id: product._id.toString() }, { status: 201 })
  } catch (err) {
    console.error("[v0] create product error:", err)
    return NextResponse.json({ error: "Could not create product." }, { status: 500 })
  }
}
