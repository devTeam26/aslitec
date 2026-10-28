import { APPLIANCE_GROUPS } from '@/data/products/appliancesLayout'
import heroBanner from '@/assets/banners/appliances/hero-wide.webp'
import CategoryShowcase from '@/components/category/CategoryShowcase'

export default function AppliancesPage() {
  return (
    <CategoryShowcase
      slug="appliances"
      title="Appliances"
      intro="aslitec electric kettles, from fast-boil modern to classic and retro."
      hero={heroBanner}
      heroAlt="aslitec kettles on a kitchen counter"
      groups={APPLIANCE_GROUPS}
    />
  )
}
