"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Upload, Plus, Trash2, Loader } from "lucide-react"
import { NeonButton } from "@/components/ui/neon-button"

type EffectType = "smooth-transition" | "reverse" | "slideshow" | "speed-change"

interface Clip {
  id: string
  file?: File
  url?: string
  duration?: number
}

export default function VideoEditorPage() {
  const { data: session } = useSession()
  const [clips, setClips] = useState<Clip[]>([])
  const [effectType, setEffectType] = useState<EffectType>("smooth-transition")
  const [speedFactor, setSpeedFactor] = useState(1)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  if (!session) {
    redirect("/login?callbackUrl=/dashboard/tools/video-editor")
  }

  const effects: EffectType[] = ["smooth-transition", "reverse", "slideshow", "speed-change"]

  const handleAddClip = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files) {
      for (let i = 0; i < files.length && i < 20; i++) {
        // Max 20 clips
        const file = files[i]
        setClips((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            file,
          },
        ])
      }
    }
  }

  const removeClip = (id: string) => {
    setClips((prev) => prev.filter((c) => c.id !== id))
  }

  const handleRender = async () => {
    if (clips.length === 0) {
      alert("Please add at least one clip")
      return
    }

    setLoading(true)
    try {
      // Upload clips and create edit job
      const sourceClips: Array<{ url: string; duration?: number }> = []

      for (const clip of clips) {
        if (clip.file) {
          const formData = new FormData()
          formData.append("file", clip.file)
          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })
          const { url } = await uploadRes.json()
          sourceClips.push({ url })
        }
      }

      const response = await fetch("/api/video/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobType: "effects-editor",
          inputVideoUrl: sourceClips[0]?.url || "",
          sourceClips,
          effects: [
            {
              type: effectType,
              params:
                effectType === "speed-change"
                  ? { factor: speedFactor }
                  : {},
            },
          ],
        }),
      })

      const data = await response.json()
      if (data.jobId) {
        alert("Video rendering started! Check your dashboard for the result.")
        setProgress(50)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Failed to start rendering")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-heading text-3xl font-bold text-white text-glow mb-2">Video Effects Editor</h1>
      <p className="text-slate-400 mb-8">
        Professional After Effects-style editing. Add transitions, reverse clips, create slideshows, and control speed.
      </p>

      <div className="space-y-6">
        {/* Clips Section */}
        <div className="rounded-2xl border border-cyan-500/20 bg-navy-800/50 p-6">
          <h2 className="font-semibold text-white mb-4">Video Clips (Max 20)</h2>

          <div className="relative mb-6">
            <input
              type="file"
              accept="video/*"
              multiple
              onChange={handleAddClip}
              disabled={clips.length >= 20 || loading}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-cyan-500/50 bg-navy-900/50 p-8 hover:border-cyan-400 transition">
              <Upload className="h-8 w-8 text-cyan-400 mb-2" />
              <p className="text-white font-medium">Add Video Clips</p>
              <p className="text-sm text-slate-400">
                {clips.length} / 20 clips · Drag and drop or click
              </p>
            </div>
          </div>

          {clips.length > 0 && (
            <div className="space-y-2">
              {clips.map((clip, idx) => (
                <div
                  key={clip.id}
                  className="flex items-center justify-between rounded-lg bg-navy-900/50 border border-cyan-500/20 p-3"
                >
                  <span className="text-sm text-slate-300">
                    {idx + 1}. {clip.file?.name || "Clip"}
                  </span>
                  <button
                    onClick={() => removeClip(clip.id)}
                    className="p-1 hover:bg-red-500/20 rounded transition"
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Effects Section */}
        <div className="rounded-2xl border border-cyan-500/20 bg-navy-800/50 p-6">
          <h2 className="font-semibold text-white mb-4">Choose Effect</h2>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {effects.map((effect) => (
              <button
                key={effect}
                onClick={() => setEffectType(effect)}
                className={`rounded-lg border-2 p-3 text-left transition ${
                  effectType === effect
                    ? "border-cyan-400 bg-cyan-500/20"
                    : "border-cyan-500/30 bg-navy-900/50 hover:border-cyan-400/50"
                }`}
              >
                <p className="font-medium text-white capitalize text-sm">
                  {effect.replace("-", " ")}
                </p>
              </button>
            ))}
          </div>

          {effectType === "speed-change" && (
            <div className="mb-4">
              <label className="text-sm text-slate-300 block mb-2">Speed Factor: {speedFactor.toFixed(1)}x</label>
              <input
                type="range"
                min="0.25"
                max="2"
                step="0.25"
                value={speedFactor}
                onChange={(e) => setSpeedFactor(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>0.25x (Slowest)</span>
                <span>2x (Fastest)</span>
              </div>
            </div>
          )}
        </div>

        {/* Render Button */}
        <NeonButton
          onClick={handleRender}
          disabled={clips.length === 0 || loading}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Loader className="h-4 w-4 animate-spin mr-2" />
              Rendering ({progress}%)
            </>
          ) : (
            "Render Video"
          )}
        </NeonButton>
      </div>
    </div>
  )
}
