import "dotenv/config"
import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import { CATALOG, SEED_UPDATES } from "../lib/catalog"
import { User } from "../models/User"
import { Product } from "../models/Product"
import { Update } from "../models/Update"

/**
 * Seed script — creates the admin account, sample products and update entries.
 *
 * Usage:
 *   1. Copy .env.example to .env and fill in MONGODB_URI (+ optional ADMIN_* vars)
 *   2. Run:  npm run seed
 */
async function seed() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error("[seed] MONGODB_URI is not set. Add it to your .env file.")
    process.exit(1)
  }

  await mongoose.connect(uri)
  console.log("[seed] Connected to MongoDB")

  // --- Admin account ---------------------------------------------------------
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@pulzeon.com").toLowerCase()
  const adminPassword = process.env.ADMIN_PASSWORD || "PulzeonAdmin123!"
  const adminName = process.env.ADMIN_NAME || "Pulzeon Admin"

  const passwordHash = await bcrypt.hash(adminPassword, 10)
  await User.findOneAndUpdate(
    { email: adminEmail },
    {
      $set: { name: adminName, passwordHash, role: "admin" },
      $setOnInsert: { email: adminEmail },
    },
    { upsert: true, new: true },
  )
  console.log(`[seed] Admin ready -> ${adminEmail} / ${adminPassword}`)

  // --- Products --------------------------------------------------------------
  for (const p of CATALOG) {
    await Product.findOneAndUpdate({ slug: p.slug }, { $set: p }, { upsert: true, new: true })
  }
  console.log(`[seed] Upserted ${CATALOG.length} products`)

  // --- Updates ---------------------------------------------------------------
  const updateCount = await Update.countDocuments({})
  if (updateCount === 0) {
    const now = Date.now()
    await Update.insertMany(
      SEED_UPDATES.map((u, i) => ({ ...u, date: new Date(now - i * 86400000) })),
    )
    console.log(`[seed] Inserted ${SEED_UPDATES.length} updates`)
  } else {
    console.log(`[seed] Updates already present (${updateCount}), skipping`)
  }

  await mongoose.disconnect()
  console.log("[seed] Done. Disconnected.")
  process.exit(0)
}

seed().catch((err) => {
  console.error("[seed] Failed:", err)
  process.exit(1)
})
