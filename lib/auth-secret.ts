/**
 * Resolves the NextAuth secret.
 *
 * In production you MUST set NEXTAUTH_SECRET (see .env.example). In development
 * / preview environments where it may be unset, we fall back to a fixed
 * development-only string so the app can boot and be explored. This fallback is
 * never used when NODE_ENV === "production".
 */
export const authSecret =
  process.env.NEXTAUTH_SECRET ||
  (process.env.NODE_ENV === "production" ? undefined : "pulzeon-dev-only-secret-change-me")
