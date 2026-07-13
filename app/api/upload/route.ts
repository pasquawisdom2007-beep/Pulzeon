import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/session"
import { isCloudinaryConfigured, uploadDataUri } from "@/lib/cloudinary"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: "File uploads are not configured. Add your Cloudinary keys to enable uploads." },
      { status: 503 },
    )
  }

  try {
    const form = await req.formData()
    const file = form.get("file") as File | null
    const folder = (form.get("folder") as string) || "pulzeon"
    if (!file) return NextResponse.json({ error: "No file provided." }, { status: 400 })

    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 8MB)." }, { status: 400 })
    }

    const bytes = Buffer.from(await file.arrayBuffer())
    const dataUri = `data:${file.type};base64,${bytes.toString("base64")}`
    const url = await uploadDataUri(dataUri, folder)
    return NextResponse.json({ url })
  } catch (err) {
    console.error("[v0] upload error:", err)
    return NextResponse.json({ error: "Upload failed." }, { status: 500 })
  }
}
