import { getSmartHomeSection, subtitleOf, chipsOf, modelOf } from '@/data/products/smartHomeLayout'
import ShowcaseCard from '@/components/category/ShowcaseCard'
import type { Product } from '@/types'

// Smart Home card: model as the title, section subtitle and first feature chip
export default function SmartHomeCard({ product, index = 0 }: { product: Product; index?: number }) {
  const section = getSmartHomeSection(product)
  return (
    <ShowcaseCard
      product={product}
      index={index}
      title={modelOf(product) ?? product.name}
      subtitle={section ? subtitleOf(product, section) : product.shortDescription}
      tag={chipsOf(product)[0]}
    />
  )
}
