import type { ShowcaseGroup } from '@/components/category/CategoryShowcase'
import rgbBanner from '@/assets/banners/gaming/rgb-wide.webp'
import camoBanner from '@/assets/banners/gaming/camo-wide.webp'

// Groups and sections on the Gaming page
export const GAMING_GROUPS: ShowcaseGroup[] = [
  {
    id: 'gm-rgb',
    name: 'RGB Controllers',
    tagline: 'Full-body RGB in classic black and glacier white',
    banner: rgbBanner,
    darkBanner: true,
    sections: [{ id: 'gm-g7-pro', name: 'G7 Pro RGB', match: (p) => p.tags.includes('controller') && !p.tags.includes('camo') }],
  },
  {
    id: 'gm-camo',
    name: 'Camo Editions',
    tagline: 'Forest green, urban gray and arctic blue camo',
    banner: camoBanner,
    darkBanner: true,
    sections: [{ id: 'gm-g7-pro-camo', name: 'G7 Pro Camo', match: (p) => p.tags.includes('controller') && p.tags.includes('camo') }],
  },
]
