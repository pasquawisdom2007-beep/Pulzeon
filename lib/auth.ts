import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { dbConnect } from "@/lib/mongodb"
import { User } from "@/models/User"
import { authSecret } from "@/lib/auth-secret"

// Admin credentials - hardcoded for special access
const ADMIN_EMAIL = "paschalpasqua2009@gmail.com"
const ADMIN_PASSWORD = "nelsonbryanjaypaschal1620"

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  secret: authSecret,
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        // Check admin credentials first
        if (credentials.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && credentials.password === ADMIN_PASSWORD) {
          return {
            id: "admin-system",
            name: "Pasqua Admin",
            email: ADMIN_EMAIL,
            role: "admin",
          } as any
        }
        
        // Check database for regular users
        try {
          await dbConnect()
          const user = await User.findOne({ email: credentials.email.toLowerCase() })
          if (!user) return null
          const valid = await bcrypt.compare(credentials.password, user.passwordHash)
          if (!valid) return null
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          } as any
        } catch (error) {
          console.error("[v0] Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).id = token.id
        ;(session.user as any).role = token.role
      }
      return session
    },
  },
}
