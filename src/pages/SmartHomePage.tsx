import { SMART_HOME_GROUPS, SMART_HOME_SECTIONS, smartHomeAnchor } from '@/data/products/smartHomeLayout'
import heroBanner from '@/assets/banners/smart-home/hero-wide.webp'
import CategoryShowcase from '@/components/category/CategoryShowcase'
import SmartHomeCard from '@/components/smart-home/SmartHomeCard'

const groups = SMART_HOME_GROUPS.map((g) => ({
  ...g,
  id: smartHomeAnchor(g.name),
  sections: g.sections
    .map((name) => SMART_HOME_SECTIONS.find((s) => s.name === name)!)
    .map((s) => ({ id: smartHomeAnchor(s.name), name: s.name, match: s.match })),
}))

export default function SmartHomePage() {
  return (
    <CategoryShowcase
      slug="smart-home"
      title="Smart Home"
      intro="aslitec security cameras and video doorbell."
      hero={heroBanner}
      heroAlt="aslitec smart home devices"
      groups={groups}
      Card={SmartHomeCard}
    />
  )
}
