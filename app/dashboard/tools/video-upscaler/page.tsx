"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Upload, Loader, Download, CheckCircle } from "lucide-react"
import { NeonButton } from "@/components/ui/neon-button"

export default function VideoUpscalerPage() {
  const { data: session } = useSession()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [jobId, setJobId] = useState<string | null>(null)
  const [status, setStatus] = useState<"pending" | "processing" | "completed" | "failed">("pending")
  const [outputUrl, setOutputUrl] = useState<string | null>(null)
  const [quality, setQuality] = useState<"high" | "extreme">("high")

  if (!session) {
    redirect("/login?callbackUrl=/dashboard/tools/video-upscaler")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024 * 1024) {
        alert("File too large. Maximum 5GB allowed.")
        return
      }
      setFile(selectedFile)
    }
  }

  const handleUpscale = async () => {
    if (!file) return

    setLoading(true)
    try {
      // In a real implementation, you would upload to cloud storage first
      // For now, we'll create a job that references a URL
      const formData = new FormData()
      formData.append("file", file)

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const { url } = await uploadRes.json()

      const response = await fetch("/api/video/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobType: "4k-upscale",
          inputVideoUrl: url,
          upscaleQuality: quality,
        }),
      })

      const data = await response.json()
      if (data.jobId) {
        setJobId(data.jobId)
        setStatus("processing")
        // Poll for status every 5 seconds
        pollJobStatus(data.jobId)
      }
    } catch (error) {
      console.error("Error:", error)
      setStatus("failed")
    } finally {
      setLoading(false)
    }
  }

  const pollJobStatus = async (id: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/video/process?jobId=${id}`)
        const job = await res.json()

        setStatus(job.status)
        if (job.status === "completed") {
          setOutputUrl(job.outputVideoUrl)
          clearInterval(interval)
        } else if (job.status === "failed") {
          clearInterval(interval)
        }
      } catch (error) {
        console.error("Error checking status:", error)
      }
    }, 5000)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-heading text-3xl font-bold text-white text-glow mb-2">4K Video Upscaler</h1>
      <p className="text-slate-400 mb-8">
        Transform your videos to extreme 4K quality with AI enhancement. Perfect for social media with After Effects polish.
      </p>

      <div className="rounded-2xl border border-cyan-500/20 bg-navy-800/50 p-8">
        {!jobId ? (
          <div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-3">Upload Video</label>
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
                  <p className="text-sm text-slate-400 mt-1">Max 5GB • MP4, WebM, MOV</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-3">Upscale Quality</label>
              <div className="grid grid-cols-2 gap-3">
                {(["high", "extreme"] as const).map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuality(q)}
                    className={`rounded-lg border-2 p-4 text-center transition ${
                      quality === q
                        ? "border-cyan-400 bg-cyan-500/20"
                        : "border-cyan-500/30 bg-navy-900/50 hover:border-cyan-400/50"
                    }`}
                  >
                    <p className="font-medium text-white capitalize">{q}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {q === "high" ? "Faster processing" : "Maximum quality"}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <NeonButton
              onClick={handleUpscale}
              disabled={!file || loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                "Upscale to 4K"
              )}
            </NeonButton>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-6">
              {status === "processing" && (
                <>
                  <Loader className="h-12 w-12 animate-spin text-cyan-400 mx-auto mb-4" />
                  <p className="text-xl font-bold text-white">Processing Your Video</p>
                  <p className="text-slate-400 mt-2">This may take a few minutes...</p>
                </>
              )}
              {status === "completed" && (
                <>
                  <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
                  <p className="text-xl font-bold text-white">Upscaling Complete!</p>
                  <p className="text-slate-400 mt-2">Your 4K video is ready to download</p>
                </>
              )}
              {status === "failed" && (
                <>
                  <p className="text-xl font-bold text-red-400">Processing Failed</p>
                  <p className="text-slate-400 mt-2">Please try again with a different video</p>
                </>
              )}
            </div>

            {status === "completed" && outputUrl && (
              <NeonButton asChild className="w-full mb-4">
                <a href={outputUrl} download>
                  <Download className="h-4 w-4 mr-2" />
                  Download 4K Video
                </a>
              </NeonButton>
            )}

            <NeonButton
              variant="outline"
              onClick={() => {
                setJobId(null)
                setStatus("pending")
                setFile(null)
              }}
              className="w-full"
            >
              Start New Upload
            </NeonButton>
          </div>
        )}
      </div>
    </div>
  )
}
