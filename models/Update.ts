import mongoose, { Schema, type Model, type Document } from "mongoose"

export interface IUpdate extends Document {
  title: string
  description: string
  date: Date
  createdAt: Date
}

const UpdateSchema = new Schema<IUpdate>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true },
)

export const Update: Model<IUpdate> =
  mongoose.models.Update || mongoose.model<IUpdate>("Update", UpdateSchema)
