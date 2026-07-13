import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { getCurrentUser } from "@/lib/session"
import { dbConnect } from "@/lib/mongodb"
import { AiCredit } from "@/models/AiCredit"
import { envConfig } from "@/lib/env-config"

export async function POST(req: Request) {
  try {
    // Check if user is logged in
    const user = await getCurrentUser()
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    // Check if AI is enabled
    if (!envConfig.aiEnabled) {
      return new Response(JSON.stringify({ error: "AI features are not enabled. Please configure OpenAI API key." }), { status: 503 })
    }

    // For admin, unlimited access
    const isAdmin = user.role === "admin"

    // For regular users, check AI credits
    if (!isAdmin) {
      await dbConnect()
      const credits = await AiCredit.findOne({ userId: user.id })

      if (!credits || credits.remainingCredits <= 0) {
        return new Response(
          JSON.stringify({
            error: "You have no AI credits remaining. Please purchase credits or upgrade to a subscription plan.",
            remainingCredits: credits?.remainingCredits || 0,
          }),
          { status: 402 },
        )
      }
    }

    const body = await req.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages format" }), { status: 400 })
    }

    // Use Vercel AI Gateway with OpenAI provider
    const model = openai.chat("gpt-4o")

    // Stream the response
    const result = streamText({
      model,
      messages,
      system: `You are Pasqua AI, an intelligent assistant created by Pulzeon. You help users with:
1. Building full-stack websites (React, Node.js, databases)
2. Creating WhatsApp bots and chat applications
3. Video editing and enhancement
4. Code generation and debugging
5. Project architecture and best practices

You can generate complete, production-ready code. When asked to build something:
- Provide modular, well-structured code
- Include proper error handling
- Use modern best practices
- Generate a complete project structure
- Ready to be packaged and downloaded as ZIP

Be helpful, creative, and thorough in your responses. The user has paid for this service, so provide maximum value.`,
    })

    // Deduct credit after streaming starts (for regular users)
    if (!isAdmin) {
      await dbConnect()
      const credits = await AiCredit.findOne({ userId: user.id })
      if (credits) {
        credits.usedCredits += 1
        credits.remainingCredits = Math.max(0, credits.remainingCredits - 1)
        credits.transactions.push({
          type: "use",
          amount: 1,
          reason: "AI chat interaction",
          createdAt: new Date(),
        })
        await credits.save()
      }
    }

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("[v0] AI route error:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to process AI request",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500 },
    )
  }
}
