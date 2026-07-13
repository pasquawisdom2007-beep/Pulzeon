import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProductByIdOrSlug } from "@/lib/data"
import { ProductActions } from "@/components/product-actions"
import { formatNaira } from "@/lib/catalog"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProductByIdOrSlug(params.id)
  if (!product) return { title: "Product not found — Pulzeon" }
  return {
    title: `${product.title} — Pulzeon`,
    description: product.shortDescription,
  }
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProductByIdOrSlug(params.id)
  if (!product || product.premiumOnly) notFound()

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <Link href="/shop" className="mb-6 inline-block text-sm text-cyan-400 hover:text-cyan-300">
        ← Back to shop
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-cyan-500/30 shadow-neon">
          <Image
            src={product.coverImage || "/placeholder.svg"}
            alt={product.title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col gap-5">
          <span className="w-fit rounded-full border border-cyan-400/40 bg-navy-900/60 px-3 py-1 text-xs font-medium text-cyan-300">
            {product.category}
          </span>
          <h1 className="text-balance font-heading text-3xl font-bold text-white text-glow sm:text-4xl">
            {product.title}
          </h1>
          <p className="text-2xl font-bold text-cyan-400 text-glow">{formatNaira(product.price)}</p>
          <p className="text-pretty leading-relaxed text-slate-300">{product.description}</p>

          <div className="rounded-xl border border-cyan-500/20 bg-navy-800/40 p-5">
            <h2 className="mb-3 font-heading text-lg font-semibold text-white">What&apos;s included</h2>
            <ul className="flex flex-col gap-2">
              {product.included.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400 shadow-neon" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-2">
            <ProductActions product={product} />
          </div>
        </div>
      </div>
    </div>
  )
}
