import mongoose, { Schema, type Model, type Document, type Types } from "mongoose"

export interface IOrderItem {
  productId: Types.ObjectId
  title: string
  price: number
}

export interface IOrder extends Document {
  user: Types.ObjectId
  userEmail: string
  type: "product" | "subscription"
  items: IOrderItem[]
  subscriptionPlan: "monthly" | "yearly" | null
  amount: number
  status: "pending" | "paid" | "rejected"
  // Payment provider abstraction — currently "manual" (Opay transfer).
  // A gateway like Paystack/Flutterwave can be added later without
  // changing the rest of the order logic.
  paymentMethod: string
  reference: string
  proofUrl: string
  paidAt: Date | null
  createdAt: Date
  updatedAt: Date
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    title: String,
    price: Number,
  },
  { _id: false },
)

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    userEmail: { type: String, required: true },
    type: { type: String, enum: ["product", "subscription"], required: true },
    items: { type: [OrderItemSchema], default: [] },
    subscriptionPlan: { type: String, enum: ["monthly", "yearly", null], default: null },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "paid", "rejected"], default: "pending", index: true },
    paymentMethod: { type: String, default: "manual-opay" },
    reference: { type: String, default: "" },
    proofUrl: { type: String, default: "" },
    paidAt: { type: Date, default: null },
  },
  { timestamps: true },
)

export const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema)
