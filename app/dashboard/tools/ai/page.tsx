"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { NeonButton } from "@/components/ui/neon-button"
import { Send, Copy, Loader } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function AiPage() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  if (!session) {
    redirect("/login?callbackUrl=/dashboard/tools/ai")
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = input
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
        }),
      })

      const data = await response.json()
      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error: ${data.error}` },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.content || "No response" },
        ])
      }
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 flex flex-col h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-white text-glow mb-2">Pasqua AI</h1>
        <p className="text-slate-400">
          Chat with AI to build full-stack websites, WhatsApp bots, generate code, and more. Start with 2 free credits!
        </p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-cyan-500/20 bg-navy-800/50 p-6 mb-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center">
            <div>
              <p className="text-2xl font-bold text-white mb-2">Welcome to Pasqua AI</p>
              <p className="text-slate-400 max-w-md">
                Ask me to build a full-stack website, create a WhatsApp bot, generate code, or anything else you need. I can upload files and provide ZIP exports!
              </p>
            </div>
          </div>
        ) : (
          messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xl rounded-lg p-4 ${
                  message.role === "user"
                    ? "bg-cyan-500/20 border border-cyan-500/50 text-white"
                    : "bg-navy-900/50 border border-cyan-500/20 text-slate-200"
                }`}
              >
                <p className="text-sm md:text-base whitespace-pre-wrap">{message.content}</p>
                {message.role === "assistant" && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => copyToClipboard(message.content, idx.toString())}
                      className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 transition"
                    >
                      <Copy className="h-3 w-3" />
                      {copied === idx.toString() ? "Copied!" : "Copy"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 bg-navy-900/50 border border-cyan-500/20 rounded-lg p-4 text-cyan-300">
              <Loader className="h-4 w-4 animate-spin" />
              <span className="text-sm">Pasqua AI is thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything... (e.g., 'Build a todo app with React and Node.js')"
          className="flex-1 rounded-lg border border-cyan-500/30 bg-navy-900/60 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-cyan-400 focus:shadow-neon"
          disabled={isLoading}
        />
        <NeonButton
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-6"
        >
          <Send className="h-4 w-4" />
        </NeonButton>
      </form>

      <p className="text-xs text-slate-500 mt-4 text-center">
        Tip: Ask Pasqua AI to generate code, build projects, create bots, or provide ZIP exports!
      </p>
    </div>
  )
}
