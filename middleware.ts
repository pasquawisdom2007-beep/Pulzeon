import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { authSecret } from "@/lib/auth-secret"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Admin area requires an admin role.
    if (pathname.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
    return NextResponse.next()
  },
  {
    secret: authSecret,
    callbacks: {
      // Returning true means authorized. Any signed-in user passes here;
      // the role check for /admin happens in the middleware body above.
      authorized: ({ token }) => Boolean(token),
    },
    pages: { signIn: "/login" },
  },
)

export const config = {
  matcher: ["/dashboard/:path*", "/checkout/:path*", "/admin/:path*"],
}
