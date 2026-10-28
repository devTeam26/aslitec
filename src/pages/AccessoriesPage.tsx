import { ACCESSORY_GROUPS } from '@/data/products/accessoriesLayout'
import heroBanner from '@/assets/banners/accessories/hero-wide.webp'
import CategoryShowcase from '@/components/category/CategoryShowcase'

export default function AccessoriesPage() {
  return (
    <CategoryShowcase
      slug="accessories"
      title="Accessories"
      intro="Earphones, cases, chargers, powerbanks, stylus pens and more from aslitec."
      hero={heroBanner}
      heroAlt="aslitec accessories on podiums"
      groups={ACCESSORY_GROUPS}
    />
  )
}
