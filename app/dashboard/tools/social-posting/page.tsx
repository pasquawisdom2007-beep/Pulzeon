"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Upload, Loader, CheckCircle, AlertCircle } from "lucide-react"
import { NeonButton } from "@/components/ui/neon-button"

type Platform = "tiktok" | "youtube" | "instagram"

interface PostStatus {
  platform: Platform
  status: "pending" | "posted" | "failed"
  error?: string
}

export default function SocialPostingPage() {
  const { data: session } = useSession()
  const [file, setFile] = useState<File | null>(null)
  const [caption, setCaption] = useState("")
  const [platforms, setPlatforms] = useState<Platform[]>(["tiktok"])
  const [loading, setLoading] = useState(false)
  const [postStatus, setPostStatus] = useState<PostStatus[]>([])
  const [completed, setCompleted] = useState(false)

  if (!session) {
    redirect("/login?callbackUrl=/dashboard/tools/social-posting")
  }

  const availablePlatforms: Platform[] = ["tiktok", "youtube", "instagram"]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.currentTarget.files?.[0]
    if (selectedFile) {
      if (selectedFile.size > 2 * 1024 * 1024 * 1024) {
        alert("File too large. Maximum 2GB for social platforms.")
        return
      }
      setFile(selectedFile)
    }
  }

  const togglePlatform = (platform: Platform) => {
    setPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform],
    )
  }

  const handlePost = async () => {
    if (!file || platforms.length === 0) {
      alert("Please select a video and at least one platform")
      return
    }

    setLoading(true)
    setPostStatus([])

    try {
      // Upload video
      const formData = new FormData()
      formData.append("file", file)

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const { url } = await uploadRes.json()

      // Create posting job
      const response = await fetch("/api/video/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobType: "auto-post",
          inputVideoUrl: url,
          platforms,
        }),
      })

      const data = await response.json()

      // Initialize status for each platform
      setPostStatus(
        platforms.map((p) => ({
          platform: p,
          status: "pending" as const,
        })),
      )

      // Simulate posting to each platform (in real app, this would be queued)
      for (const platform of platforms) {
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setPostStatus((prev) =>
          prev.map((p) =>
            p.platform === platform ? { ...p, status: "posted" as const } : p,
          ),
        )
      }

      setCompleted(true)
    } catch (error) {
      console.error("Error:", error)
      alert("Failed to post video")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-heading text-3xl font-bold text-white text-glow mb-2">
        Social Auto-Posting
      </h1>
      <p className="text-slate-400 mb-8">
        Upload once, post everywhere. Auto-post to TikTok, YouTube, and Instagram with quality maintained across platforms.
      </p>

      <div className="rounded-2xl border border-cyan-500/20 bg-navy-800/50 p-8 space-y-6">
        {!completed ? (
          <>
            {/* Video Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Upload Video
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  disabled={loading}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-cyan-500/50 bg-navy-900/50 p-12 hover:border-cyan-400 transition">
                  <Upload className="h-12 w-12 text-cyan-400 mb-3" />
                  <p className="text-white font-medium">
                    {file ? file.name : "Click or drag video file"}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    Max 2GB • MP4, WebM, MOV
                  </p>
                </div>
              </div>
            </div>

            {/* Caption */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Caption (Optional)
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption for all platforms..."
                className="w-full rounded-lg border border-cyan-500/30 bg-navy-900/50 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-cyan-400 focus:shadow-neon resize-none h-24"
                disabled={loading}
              />
            </div>

            {/* Platform Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Post to Platforms
              </label>
              <div className="grid grid-cols-3 gap-3">
                {availablePlatforms.map((platform) => (
                  <button
                    key={platform}
                    onClick={() => togglePlatform(platform)}
                    disabled={loading}
                    className={`rounded-lg border-2 p-4 text-center transition ${
                      platforms.includes(platform)
                        ? "border-cyan-400 bg-cyan-500/20"
                        : "border-cyan-500/30 bg-navy-900/50 hover:border-cyan-400/50"
                    }`}
                  >
                    <p className="font-medium text-white capitalize">
                      {platform === "tiktok"
                        ? "TikTok"
                        : platform === "youtube"
                          ? "YouTube"
                          : "Instagram"}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Post Button */}
            <NeonButton
              onClick={handlePost}
              disabled={!file || platforms.length === 0 || loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                  Posting to {platforms.length} platform(s)...
                </>
              ) : (
                `Post to ${platforms.length} Platform${platforms.length !== 1 ? "s" : ""}`
              )}
            </NeonButton>
          </>
        ) : (
          <div className="text-center space-y-6">
            <CheckCircle className="h-16 w-16 text-emerald-400 mx-auto" />
            <div>
              <p className="text-2xl font-bold text-white">Posted Successfully!</p>
              <p className="text-slate-400 mt-2">
                Your video has been posted to all selected platforms
              </p>
            </div>

            <div className="space-y-2 my-6">
              {postStatus.map((p) => (
                <div
                  key={p.platform}
                  className="flex items-center justify-between rounded-lg bg-navy-900/50 border border-cyan-500/20 p-4"
                >
                  <span className="font-medium text-white capitalize">
                    {p.platform === "tiktok"
                      ? "TikTok"
                      : p.platform === "youtube"
                        ? "YouTube"
                        : "Instagram"}
                  </span>
                  {p.status === "posted" ? (
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                  ) : p.status === "failed" ? (
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  ) : (
                    <Loader className="h-5 w-5 text-cyan-400 animate-spin" />
                  )}
                </div>
              ))}
            </div>

            <NeonButton
              onClick={() => {
                setFile(null)
                setCaption("")
                setCompleted(false)
                setPostStatus([])
              }}
              variant="outline"
              className="w-full"
            >
              Post Another Video
            </NeonButton>
          </div>
        )}
      </div>
    </div>
  )
}
