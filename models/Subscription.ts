import mongoose, { Schema, type Model, type Document } from "mongoose"

export interface ISubscription extends Document {
  userId: string
  plan: "free" | "monthly" | "yearly"
  status: "active" | "cancelled" | "expired"
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  startDate: Date
  endDate: Date | null
  price: number // in cents
  features: {
    videoUpscaler4k: boolean
    videoEditor: boolean
    socialAutoPosting: boolean
    pasquaAi: boolean
    aiCredits: number // number of free/included credits
  }
  createdAt: Date
  updatedAt: Date
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: { type: String, required: true, index: true },
    plan: { type: String, enum: ["free", "monthly", "yearly"], default: "free" },
    status: { type: String, enum: ["active", "cancelled", "expired"], default: "active" },
    stripeCustomerId: { type: String, default: null },
    stripeSubscriptionId: { type: String, default: null },
    startDate: { type: Date, required: true },
    endDate: { type: Date, default: null },
    price: { type: Number, default: 0 },
    features: {
      videoUpscaler4k: { type: Boolean, default: false },
      videoEditor: { type: Boolean, default: false },
      socialAutoPosting: { type: Boolean, default: false },
      pasquaAi: { type: Boolean, default: false },
      aiCredits: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
)

export const Subscription: Model<ISubscription> = mongoose.models.Subscription || mongoose.model<ISubscription>("Subscription", SubscriptionSchema)
