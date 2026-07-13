import mongoose, { Schema, type Model, type Document } from "mongoose"

export interface IProduct extends Document {
  title: string
  slug: string
  category: string
  shortDescription: string
  description: string
  price: number
  coverImage: string
  fileUrl: string
  included: string[]
  featured: boolean
  premiumOnly: boolean
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: { type: String, required: true },
    shortDescription: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    coverImage: { type: String, default: "" },
    fileUrl: { type: String, default: "" },
    included: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    premiumOnly: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema)
