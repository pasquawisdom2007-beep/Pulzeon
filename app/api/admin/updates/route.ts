import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/session"
import { dbConnect } from "@/lib/mongodb"
import { Update } from "@/models/Update"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  try {
    const { title, description, date } = await req.json()
    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required." }, { status: 400 })
    }
    await dbConnect()
    const doc = await Update.create({ title, description, date: date ? new Date(date) : new Date() })
    return NextResponse.json({ ok: true, id: doc._id.toString() }, { status: 201 })
  } catch (err) {
    console.error("[v0] create update error:", err)
    return NextResponse.json({ error: "Could not create update." }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 })
  await dbConnect()
  await Update.findByIdAndDelete(id)
  return NextResponse.json({ ok: true })
}
