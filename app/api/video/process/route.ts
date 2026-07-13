import { getCurrentUser } from "@/lib/session"
import { dbConnect } from "@/lib/mongodb"
import { VideoJob } from "@/models/VideoJob"
import { Subscription } from "@/models/Subscription"
import { envConfig } from "@/lib/env-config"

type ProcessingType = "4k-upscale" | "effects-editor" | "auto-post"

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    if (!envConfig.videoProcessingEnabled && user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Video processing not enabled" }), { status: 503 })
    }

    await dbConnect()

    // Check subscription for regular users
    if (user.role !== "admin") {
      const subscription = await Subscription.findOne({ userId: user.id })

      if (!subscription || !subscription.features.videoUpscaler4k) {
        return new Response(
          JSON.stringify({
            error: "You need an active subscription to use video tools. Please upgrade your plan.",
          }),
          { status: 402 },
        )
      }
    }

    const body = await req.json()
    const { jobType, inputVideoUrl, upscaleQuality, effects, sourceClips, platforms }: {
      jobType: ProcessingType
      inputVideoUrl: string
      upscaleQuality?: string
      effects?: any[]
      sourceClips?: any[]
      platforms?: string[]
    } = body

    if (!jobType || !inputVideoUrl) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: jobType, inputVideoUrl",
        }),
        { status: 400 },
      )
    }

    // Create video job
    const job = new VideoJob({
      userId: user.id,
      jobType,
      inputVideoUrl,
      upscaleQuality: upscaleQuality || "high",
      effects: effects || [],
      sourceClips: sourceClips || [],
      platforms: platforms || [],
      status: "pending",
    })

    await job.save()

    // In a real implementation, you would queue this for background processing
    // For now, we return the job ID so the client can poll for status
    // You'd typically use a queue service like Bull, Agenda, or AWS SQS

    return new Response(
      JSON.stringify({
        jobId: job._id,
        status: "pending",
        message: "Video job created. Processing will begin shortly.",
      }),
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Video processing error:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to process video",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500 },
    )
  }
}

// GET - check job status
export async function GET(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const jobId = searchParams.get("jobId")

    if (!jobId) {
      return new Response(JSON.stringify({ error: "Missing jobId parameter" }), { status: 400 })
    }

    await dbConnect()
    const job = await VideoJob.findById(jobId)

    if (!job) {
      return new Response(JSON.stringify({ error: "Job not found" }), { status: 404 })
    }

    // Only allow user to check their own jobs
    if (job.userId !== user.id && user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 })
    }

    return new Response(JSON.stringify(job), { status: 200 })
  } catch (error) {
    console.error("[v0] Video status error:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to check video status",
      }),
      { status: 500 },
    )
  }
}
