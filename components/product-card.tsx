"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { formatNaira, type ProductData } from "@/lib/catalog"

export function ProductCard({ product }: { product: ProductData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-cyan-500/20 bg-navy-800/40 backdrop-blur-sm transition-all duration-300 hover:border-cyan-400/70 hover:shadow-neon"
    >
      <Link href={`/shop/${product.slug}`} className="flex flex-1 flex-col">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={product.coverImage || "/placeholder.svg"}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 rounded-full border border-cyan-400/40 bg-navy-950/80 px-3 py-1 text-xs font-medium text-cyan-300">
            {product.category}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="text-balance font-heading text-lg font-semibold text-white transition-colors group-hover:text-cyan-300">
            {product.title}
          </h3>
          <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-slate-400">{product.shortDescription}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-heading text-xl font-bold text-cyan-400 text-glow">{formatNaira(product.price)}</span>
            <span className="text-sm font-medium text-slate-300 transition-colors group-hover:text-cyan-300">
              View →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
