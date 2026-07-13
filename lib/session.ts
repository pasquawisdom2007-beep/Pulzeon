import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export type SessionUser = {
  id: string
  name?: string | null
  email?: string | null
  role: "user" | "admin"
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions)
  if (!session?.user) return null
  return session.user as SessionUser
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser()
  if (!user) throw new Error("UNAUTHORIZED")
  return user
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await getCurrentUser()
  if (!user || user.role !== "admin") throw new Error("FORBIDDEN")
  return user
}
