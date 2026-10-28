import type { ShowcaseGroup } from '@/components/category/CategoryShowcase'
import type { Product } from '@/types'
import modernBanner from '@/assets/banners/appliances/modern-wide.webp'
import classicBanner from '@/assets/banners/appliances/classic-wide.webp'

const isClassic = (p: Product) => p.tags.includes('retro') || p.tags.includes('classic')

// Groups and sections on the Appliances page
export const APPLIANCE_GROUPS: ShowcaseGroup[] = [
  {
    id: 'ap-modern',
    name: 'Modern Kettles',
    tagline: 'Fast-boil H2 kettles and the glowing Lumina glass',
    banner: modernBanner,
    sections: [{ id: 'ap-electric-kettles', name: 'Electric Kettles', match: (p) => p.tags.includes('kettle') && !isClassic(p) }],
  },
  {
    id: 'ap-classic',
    name: 'Classic & Retro',
    tagline: 'Timeless shapes in brushed steel and mint green',
    banner: classicBanner,
    sections: [{ id: 'ap-classic-kettles', name: 'Classic & Retro Kettles', match: (p) => p.tags.includes('kettle') && isClassic(p) }],
  },
]
