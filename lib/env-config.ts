/**
 * Environment configuration with fallbacks
 * This ensures the app works even if some API keys are missing
 */

export const envConfig = {
  // NextAuth
  nextAuthSecret: process.env.NEXTAUTH_SECRET || "pulzeon-dev-only-secret-change-me",
  nextAuthUrl: process.env.NEXTAUTH_URL || "http://localhost:3000",

  // MongoDB
  mongodbUri: process.env.MONGODB_URI || "mongodb+srv://demo:demo@cluster0.mongodb.net/pulzeon?retryWrites=true&w=majority",

  // Stripe
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",

  // OpenAI / Vercel AI Gateway
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  aiGatewayKey: process.env.AI_GATEWAY_API_KEY || process.env.OPENAI_API_KEY || "",

  // Cloudinary
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "demo",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "demo",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "demo",

  // Social Media OAuth (for auto-posting)
  twitterId: process.env.TWITTER_ID || "",
  twitterSecret: process.env.TWITTER_SECRET || "",
  instagramId: process.env.INSTAGRAM_ID || "",
  instagramSecret: process.env.INSTAGRAM_SECRET || "",
  youtubeApiKey: process.env.YOUTUBE_API_KEY || "",
  tiktokClientId: process.env.TIKTOK_CLIENT_ID || "",
  tiktokClientSecret: process.env.TIKTOK_CLIENT_SECRET || "",

  // Feature flags
  stripeEnabled: !!process.env.STRIPE_SECRET_KEY,
  aiEnabled: !!process.env.OPENAI_API_KEY || !!process.env.AI_GATEWAY_API_KEY,
  videoProcessingEnabled: !!process.env.CLOUDINARY_CLOUD_NAME,
  socialPostingEnabled: !!process.env.TWITTER_ID || !!process.env.INSTAGRAM_ID || !!process.env.YOUTUBE_API_KEY || !!process.env.TIKTOK_CLIENT_ID,
}

// Validate critical configs
export function validateEnv() {
  const errors: string[] = []

  if (!process.env.MONGODB_URI) {
    errors.push("MONGODB_URI not set - using demo database")
  }

  if (!process.env.NEXTAUTH_SECRET && process.env.NODE_ENV === "production") {
    errors.push("NEXTAUTH_SECRET not set in production")
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn("[v0] ⚠️ STRIPE_SECRET_KEY not set - payments disabled")
  }

  if (!process.env.OPENAI_API_KEY && !process.env.AI_GATEWAY_API_KEY) {
    console.warn("[v0] ⚠️ OpenAI API key not set - Pasqua AI disabled")
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.warn("[v0] ⚠️ Cloudinary not configured - video processing disabled")
  }

  return { valid: errors.length === 0, errors }
}
