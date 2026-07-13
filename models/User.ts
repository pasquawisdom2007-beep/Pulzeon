import mongoose, { Schema, type Model, type Document } from "mongoose"

export interface IUser extends Document {
  name: string
  email: string
  passwordHash: string
  role: "user" | "admin"
  subscription: {
    active: boolean
    plan: "monthly" | "yearly" | null
    startedAt: Date | null
    expiresAt: Date | null
  }
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    subscription: {
      active: { type: Boolean, default: false },
      plan: { type: String, enum: ["monthly", "yearly", null], default: null },
      startedAt: { type: Date, default: null },
      expiresAt: { type: Date, default: null },
    },
  },
  { timestamps: true },
)

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
