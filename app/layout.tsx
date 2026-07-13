import type { Metadata, Viewport } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FloatingButtons } from "@/components/floating-buttons"
import { AnimatedBackground } from "@/components/animated-background"
import { SITE } from "@/lib/site"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" })
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" })

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "Pulzeon is a digital product store for CV templates, business docs, past questions, source code and more. Buy instantly or go Pulzeon Premium. Powered by PASQUA TECH.",
  keywords: ["Pulzeon", "digital products", "CV templates", "past questions", "source code", "PASQUA TECH"],
  authors: [{ name: "PASQUA TECH" }],
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: "Premium digital products, delivered instantly. Powered by PASQUA TECH.",
    siteName: SITE.name,
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#050814",
  colorScheme: "dark",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark bg-background ${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen antialiased">
        <Providers>
          <AnimatedBackground />
          <Navbar />
          <main className="mx-auto min-h-[70vh] w-full max-w-7xl px-4 pb-16 pt-8">{children}</main>
          <Footer />
          <FloatingButtons />
        </Providers>
      </body>
    </html>
  )
}
