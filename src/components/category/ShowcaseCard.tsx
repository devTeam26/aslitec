import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Product } from '@/types'

// EZVIZ-style product card in the aslitec palette
interface Props {
  product: Product
  index?: number
  title?: string
  subtitle?: string
  tag?: string
}

// Name without the brand, split into model and variant ("G7 Pro Controller – Black RGB")
// plus the feature chips from the short description
export function cardText(p: Product) {
  const [title, variant] = p.name.replace(/^aslitec\s+/i, '').split(/\s+[–-]\s+/)
  const chips = p.shortDescription?.split(/\s*·\s*|\.\s+/).map((c) => c.replace(/\.$/, '').trim()).filter(Boolean) ?? []
  const subtitle = variant ?? chips.shift() ?? ''
  return { title, subtitle, tag: chips.find((c) => c.length <= 26) }
}

export default function ShowcaseCard({ product, index = 0, ...text }: Props) {
  const img = product.images[0]?.url
  const fallback = cardText(product)
  const title = text.title ?? fallback.title
  const subtitle = text.subtitle ?? fallback.subtitle
  const tag = 'tag' in text ? text.tag : fallback.tag

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={`/products/${product.slug}`}
        className="group flex flex-col h-full bg-white px-4 pt-6 pb-6 text-center transition-shadow duration-300 hover:shadow-[0_10px_30px_rgba(45,52,68,0.12)]"
      >
        {/* Image is absolutely positioned so a tall photo can't stretch the square box */}
        <div className="relative aspect-square w-full shrink-0">
          {img && (
            <img
              src={img}
              alt={product.name}
              className="absolute inset-0 size-full object-contain transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          )}
        </div>
        <div className="h-7 mt-3 flex items-center justify-center">
          {tag && (
            <span className="max-w-full truncate rounded-full border border-[#D4693A] px-2.5 py-0.5 text-[11px] text-[#D4693A]">
              {tag}
            </span>
          )}
        </div>
        <h3 className="mt-2 text-lg md:text-2xl font-semibold text-[#2d3444] truncate" title={product.name}>
          {title}
        </h3>
        <p className="mt-1.5 text-sm text-[#777] truncate">{subtitle}</p>
        <span className="mt-5 mx-auto inline-flex items-center justify-center rounded-full bg-[#D4693A] px-7 py-2 text-sm font-semibold text-white transition-colors group-hover:bg-[#2d3444]">
          More
        </span>
      </Link>
    </motion.div>
  )
}
