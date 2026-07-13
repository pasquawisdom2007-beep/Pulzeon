import mongoose, { Schema, type Model, type Document } from "mongoose"

export interface IVideoJob extends Document {
  userId: string
  jobType: "4k-upscale" | "effects-editor" | "auto-post"
  status: "pending" | "processing" | "completed" | "failed"
  inputVideoUrl: string
  outputVideoUrl?: string
  cloudinaryPublicId?: string
  
  // For 4K upscaling
  upscaleQuality?: "high" | "extreme"
  
  // For effects editor
  effects?: Array<{
    type: "smooth-transition" | "reverse" | "slideshow" | "speed-change"
    params: Record<string, any>
  }>
  sourceClips?: Array<{
    url: string
    duration?: number
  }>
  
  // For auto-posting
  platforms?: Array<"tiktok" | "youtube" | "instagram">
  postingStatus?: Record<string, "pending" | "posted" | "failed">
  
  error?: string
  progress?: number // 0-100
  createdAt: Date
  updatedAt: Date
}

const VideoJobSchema = new Schema<IVideoJob>(
  {
    userId: { type: String, required: true, index: true },
    jobType: {
      type: String,
      enum: ["4k-upscale", "effects-editor", "auto-post"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    inputVideoUrl: { type: String, required: true },
    outputVideoUrl: { type: String, default: null },
    cloudinaryPublicId: { type: String, default: null },
    
    upscaleQuality: { type: String, enum: ["high", "extreme"], default: "high" },
    
    effects: [
      {
        type: { type: String, enum: ["smooth-transition", "reverse", "slideshow", "speed-change"] },
        params: { type: Schema.Types.Mixed },
      },
    ],
    sourceClips: [
      {
        url: { type: String, required: true },
        duration: { type: Number, default: null },
      },
    ],
    
    platforms: [{ type: String, enum: ["tiktok", "youtube", "instagram"] }],
    postingStatus: { type: Schema.Types.Mixed, default: {} },
    
    error: { type: String, default: null },
    progress: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true },
)

export const VideoJob: Model<IVideoJob> = mongoose.models.VideoJob || mongoose.model<IVideoJob>("VideoJob", VideoJobSchema)
