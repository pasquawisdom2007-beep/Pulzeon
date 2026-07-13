import mongoose, { Schema, type Model, type Document } from "mongoose"

export interface IAiCredit extends Document {
  userId: string
  totalCredits: number
  usedCredits: number
  remainingCredits: number
  subscriptionCredits: number // included with subscription
  paidCredits: number // purchased separately
  lastResetDate: Date
  nextResetDate: Date | null
  transactions: Array<{
    type: "earn" | "use"
    amount: number
    reason: string
    createdAt: Date
  }>
  createdAt: Date
  updatedAt: Date
}

const AiCreditSchema = new Schema<IAiCredit>(
  {
    userId: { type: String, required: true, index: true, unique: true },
    totalCredits: { type: Number, default: 2 }, // 2 free demo credits
    usedCredits: { type: Number, default: 0 },
    remainingCredits: { type: Number, default: 2 },
    subscriptionCredits: { type: Number, default: 0 },
    paidCredits: { type: Number, default: 0 },
    lastResetDate: { type: Date, required: true },
    nextResetDate: { type: Date, default: null },
    transactions: [
      {
        type: { type: String, enum: ["earn", "use"], required: true },
        amount: { type: Number, required: true },
        reason: { type: String, required: true },
        createdAt: { type: Date, default: () => new Date() },
      },
    ],
  },
  { timestamps: true },
)

export const AiCredit: Model<IAiCredit> = mongoose.models.AiCredit || mongoose.model<IAiCredit>("AiCredit", AiCreditSchema)
