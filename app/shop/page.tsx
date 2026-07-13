import type { Metadata } from "next"
import { getProducts } from "@/lib/data"
import { ShopGrid } from "@/components/shop-grid"
import { SectionHeading } from "@/components/section-heading"

export const metadata: Metadata = {
  title: "Shop — Pulzeon",
  description: "Browse all Pulzeon digital products: CVs, business plans, Canva bundles, past questions and more.",
}

export const dynamic = "force-dynamic"

export default async function ShopPage() {
  const products = await getProducts()
  const shopProducts = products.filter((p) => !p.premiumOnly)

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <SectionHeading
        eyebrow="Shop"
        title="All digital products"
        subtitle="Instant-download templates, guides and source code. Log in to buy."
      />
      <div className="mt-10">
        <ShopGrid products={shopProducts} />
      </div>
    </div>
  )
}
