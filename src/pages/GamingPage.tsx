import { GAMING_GROUPS } from '@/data/products/gamingLayout'
import heroBanner from '@/assets/banners/gaming/hero-wide.webp'
import CategoryShowcase from '@/components/category/CategoryShowcase'

export default function GamingPage() {
  return (
    <CategoryShowcase
      slug="gaming"
      title="Gaming"
      intro="aslitec G7 Pro wireless RGB controllers for PlayStation 4, PC and mobile."
      hero={heroBanner}
      heroAlt="aslitec G7 Pro controllers in an RGB-lit gaming room"
      darkHero
      groups={GAMING_GROUPS}
    />
  )
}
