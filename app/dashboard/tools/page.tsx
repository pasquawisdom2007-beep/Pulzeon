"use client"

import Link from "next/link"
import { redirect } from "next/navigation"
import { useSession } from "next-auth/react"
import { NeonButton } from "@/components/ui/neon-button"
import { Wand2, Zap, Share2, Bot } from "lucide-react"

const tools = [
  {
    id: "video-upscaler",
    name: "4K Video Upscaler",
    description: "Upscale videos to extreme 4K quality with AI enhancement. Perfect for social media.",
    icon: Zap,
    href: "/dashboard/tools/video-upscaler",
    features: ["Extreme 4K quality", "After Effects polish", "Auto social posting"],
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: "video-editor",
    name: "Video Effects Editor",
    description: "Professional After Effects-style editing. Smooth transitions, reverse, slideshows, and more.",
    icon: Wand2,
    href: "/dashboard/tools/video-editor",
    features: ["Smooth transitions", "Reverse effect", "Slideshow mode", "Speed control"],
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "social-posting",
    name: "Social Auto-Posting",
    description: "Upload once, post everywhere. Auto-post to TikTok, YouTube, and Instagram with quality intact.",
    icon: Share2,
    href: "/dashboard/tools/social-posting",
    features: ["TikTok integration", "YouTube upload", "Instagram post", "Quality preservation"],
    color: "from-orange-500 to-red-500",
  },
  {
    id: "pasqua-ai",
    name: "Pasqua AI",
    description: "ChatGPT-like AI that builds full-stack websites, WhatsApp bots, and generates code. 2 free credits!",
    icon: Bot,
    href: "/dashboard/tools/ai",
    features: ["Full-stack code generation", "WhatsApp bots", "File uploads", "ZIP export"],
    color: "from-emerald-500 to-teal-500",
  },
]

export default function ToolsPage() {
  const { data: session } = useSession()

  if (!session) {
    redirect("/login?callbackUrl=/dashboard/tools")
  }

  const isAdmin = session.user?.role === "admin"

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-12">
        <h1 className="font-heading text-4xl font-bold text-white text-glow mb-2">Pulzeon Tools</h1>
        <p className="text-lg text-slate-400">
          {isAdmin ? "All tools available for free (Admin)" : "Access premium tools with your subscription"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <Link
              key={tool.id}
              href={tool.href}
              className="group relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-navy-800/50 to-navy-900/50 p-6 transition-all hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20"
            >
              {/* Gradient background */}
              <div
                className={`absolute inset-0 opacity-0 transition-opacity group-hover:opacity-10 bg-gradient-to-br ${tool.color}`}
              />

              {/* Content */}
              <div className="relative z-10">
                <div className="mb-4 inline-block rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-3">
                  <Icon className="h-6 w-6 text-cyan-400" />
                </div>

                <h2 className="mb-2 font-heading text-xl font-bold text-white">{tool.name}</h2>
                <p className="mb-4 text-sm text-slate-400">{tool.description}</p>

                <div className="mb-6 space-y-1">
                  {tool.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <span className="h-1 w-1 rounded-full bg-cyan-400" />
                      {feature}
                    </div>
                  ))}
                </div>

                <NeonButton className="w-full" size="sm">
                  Open Tool
                </NeonButton>
              </div>

              {/* Bottom accent */}
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${tool.color} opacity-0 transition-opacity group-hover:opacity-50`} />
            </Link>
          )
        })}
      </div>

      {/* Credits section for non-admin */}
      {!isAdmin && (
        <section className="mt-12 rounded-2xl border border-cyan-500/30 bg-navy-800/50 p-8">
          <h2 className="mb-4 font-heading text-2xl font-bold text-white">AI Credits</h2>
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-cyan-500/20 bg-navy-900/50 p-4">
              <p className="text-sm text-slate-400">Total Credits</p>
              <p className="text-2xl font-bold text-cyan-400">2</p>
              <p className="text-xs text-slate-500 mt-1">Free demo credits</p>
            </div>
            <div className="rounded-xl border border-cyan-500/20 bg-navy-900/50 p-4">
              <p className="text-sm text-slate-400">Used</p>
              <p className="text-2xl font-bold text-orange-400">0</p>
              <p className="text-xs text-slate-500 mt-1">This month</p>
            </div>
            <div className="rounded-xl border border-cyan-500/20 bg-navy-900/50 p-4">
              <p className="text-sm text-slate-400">Remaining</p>
              <p className="text-2xl font-bold text-emerald-400">2</p>
              <p className="text-xs text-slate-500 mt-1">Available now</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-4">
            Start with 2 free credits to test Pasqua AI. Upgrade to Premium to unlock unlimited AI, videos, and social posting.
          </p>
          <NeonButton asChild>
            <Link href="/pricing">Upgrade to Premium</Link>
          </NeonButton>
        </section>
      )}
    </div>
  )
}
