import { dbConnect } from "@/lib/mongodb"
import { Product } from "@/models/Product"
import { Order } from "@/models/Order"
import { Update } from "@/models/Update"
import { User } from "@/models/User"

export type ProductDTO = {
  id: string
  title: string
  slug: string
  category: string
  shortDescription: string
  description: string
  price: number
  coverImage: string
  included: string[]
  featured: boolean
  premiumOnly: boolean
}

export type UpdateDTO = {
  id: string
  title: string
  description: string
  date: string
}

function toProductDTO(p: any): ProductDTO {
  return {
    id: p._id.toString(),
    title: p.title,
    slug: p.slug,
    category: p.category,
    shortDescription: p.shortDescription,
    description: p.description || "",
    price: p.price,
    coverImage: p.coverImage || "",
    included: p.included || [],
    featured: !!p.featured,
    premiumOnly: !!p.premiumOnly,
  }
}

export async function getProducts(opts?: { category?: string; search?: string }): Promise<ProductDTO[]> {
  await dbConnect()
  const query: Record<string, any> = {}
  if (opts?.category && opts.category !== "All") query.category = opts.category
  if (opts?.search) {
    query.$or = [
      { title: { $regex: opts.search, $options: "i" } },
      { shortDescription: { $regex: opts.search, $options: "i" } },
      { category: { $regex: opts.search, $options: "i" } },
    ]
  }
  const products = await Product.find(query).sort({ createdAt: -1 }).lean()
  return products.map(toProductDTO)
}

export async function getFeaturedProducts(limit = 4): Promise<ProductDTO[]> {
  await dbConnect()
  const products = await Product.find({ premiumOnly: false }).sort({ featured: -1, createdAt: -1 }).limit(limit).lean()
  return products.map(toProductDTO)
}

export async function getProductByIdOrSlug(idOrSlug: string): Promise<ProductDTO | null> {
  await dbConnect()
  let doc: any = null
  if (/^[0-9a-fA-F]{24}$/.test(idOrSlug)) {
    doc = await Product.findById(idOrSlug).lean()
  }
  if (!doc) doc = await Product.findOne({ slug: idOrSlug }).lean()
  return doc ? toProductDTO(doc) : null
}

export async function getLatestUpdate(): Promise<UpdateDTO | null> {
  await dbConnect()
  const u: any = await Update.findOne().sort({ date: -1, createdAt: -1 }).lean()
  if (!u) return null
  return { id: u._id.toString(), title: u.title, description: u.description, date: new Date(u.date).toISOString() }
}

export async function getUpdates(): Promise<UpdateDTO[]> {
  await dbConnect()
  const list = await Update.find().sort({ date: -1, createdAt: -1 }).lean()
  return list.map((u: any) => ({
    id: u._id.toString(),
    title: u.title,
    description: u.description,
    date: new Date(u.date).toISOString(),
  }))
}

export type DashboardData = {
  subscription: { active: boolean; plan: string | null; expiresAt: string | null }
  ownedProducts: (ProductDTO & { orderRef: string })[]
  orders: {
    id: string
    type: string
    amount: number
    status: string
    reference: string
    createdAt: string
    itemTitles: string[]
    subscriptionPlan: string | null
  }[]
}

export async function getDashboardData(userId: string): Promise<DashboardData> {
  await dbConnect()
  const [user, orders] = await Promise.all([
    User.findById(userId).lean() as any,
    Order.find({ user: userId }).sort({ createdAt: -1 }).lean() as any,
  ])

  // Owned products = distinct products across PAID product orders.
  const ownedIds = new Set<string>()
  const ownedRefById: Record<string, string> = {}
  for (const o of orders) {
    if (o.status === "paid" && o.type === "product") {
      for (const it of o.items || []) {
        if (it.productId) {
          const pid = it.productId.toString()
          ownedIds.add(pid)
          ownedRefById[pid] = o._id.toString()
        }
      }
    }
  }

  let ownedProducts: (ProductDTO & { orderRef: string })[] = []
  if (ownedIds.size > 0) {
    const products = await Product.find({ _id: { $in: Array.from(ownedIds) } }).lean()
    ownedProducts = products.map((p: any) => ({ ...toProductDTO(p), orderRef: ownedRefById[p._id.toString()] }))
  }

  const subActive =
    !!user?.subscription?.active &&
    (!user?.subscription?.expiresAt || new Date(user.subscription.expiresAt) > new Date())

  return {
    subscription: {
      active: subActive,
      plan: user?.subscription?.plan ?? null,
      expiresAt: user?.subscription?.expiresAt ? new Date(user.subscription.expiresAt).toISOString() : null,
    },
    ownedProducts,
    orders: orders.map((o: any) => ({
      id: o._id.toString(),
      type: o.type,
      amount: o.amount,
      status: o.status,
      reference: o.reference || "",
      createdAt: new Date(o.createdAt).toISOString(),
      itemTitles: (o.items || []).map((i: any) => i.title),
      subscriptionPlan: o.subscriptionPlan ?? null,
    })),
  }
}

export async function isSubscriptionActive(userId: string): Promise<boolean> {
  await dbConnect()
  const user: any = await User.findById(userId).lean()
  if (!user?.subscription?.active) return false
  if (user.subscription.expiresAt && new Date(user.subscription.expiresAt) <= new Date()) return false
  return true
}

export async function getAdminStats() {
  await dbConnect()
  const [paidOrders, pendingCount, productCount, userCount] = await Promise.all([
    Order.find({ status: "paid" }).lean() as any,
    Order.countDocuments({ status: "pending" }),
    Product.countDocuments({}),
    User.countDocuments({}),
  ])
  const revenue = paidOrders.reduce((s: number, o: any) => s + (o.amount || 0), 0)
  return { revenue, paidCount: paidOrders.length, pendingCount, productCount, userCount }
}
