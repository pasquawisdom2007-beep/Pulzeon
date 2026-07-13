import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

/** True when a MongoDB connection string is configured. */
export const hasDb = !!MONGODB_URI

/**
 * Cached connection across hot reloads in dev and across serverless
 * invocations in production. Prevents connection storms.
 */
interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: MongooseCache | undefined
}

const cached: MongooseCache = global._mongoose ?? { conn: null, promise: null }
global._mongoose = cached

export async function dbConnect(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not set. Add it to your environment variables.")
  }
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false })
      .then((m) => m)
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}
