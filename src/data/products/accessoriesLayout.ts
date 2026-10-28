import type { Product } from '@/types'
import type { ShowcaseGroup } from '@/components/category/CategoryShowcase'
import audioBanner from '@/assets/banners/accessories/audio-wide.webp'
import protectionBanner from '@/assets/banners/accessories/protection-wide.webp'
import powerBanner from '@/assets/banners/accessories/power-wide.webp'
import wearablesBanner from '@/assets/banners/accessories/wearables-wide.webp'
import comfortBanner from '@/assets/banners/smart-home/comfort-wide.webp'
import driveBanner from '@/assets/banners/smart-home/drive-wide.webp'

// Sections on the Accessories page (also used by the navbar menu)
export const ACCESSORY_SECTIONS = [
  {
    key: 'earphones',
    title: 'Earphones',
    filter: (p: Product) => p.tags.includes('earphones'),
  },
  {
    key: 'case-phone',
    title: 'Cases',
    filter: (p: Product) => p.tags.includes('case') && !p.tags.includes('waterproof-case'),
  },
  {
    key: 'grip',
    title: 'Phone Grips & Ring Stands',
    filter: (p: Product) => p.tags.includes('grip') && !p.tags.includes('case'),
  },
  {
    key: 'lens',
    title: 'Lens Protectors',
    filter: (p: Product) => p.tags.includes('lens protector'),
  },
  {
    key: 'charger',
    title: 'Home Charger Adapter',
    filter: (p: Product) => p.tags.includes('charger'),
  },
  {
    key: 'smart-band',
    title: 'Smart Bands',
    filter: (p: Product) => p.tags.includes('smart band'),
  },
  {
    key: 'stylus',
    title: 'Stylus',
    filter: (p: Product) => p.tags.includes('stylus'),
  },
  {
    key: 'powerbank',
    title: 'Powerbank',
    filter: (p: Product) => p.tags.includes('powerbank'),
  },
  {
    key: 'waterproof',
    title: 'WaterProof Case',
    filter: (p: Product) => p.tags.includes('waterproof-case'),
  },
  {
    key: 'fan',
    title: 'Bladeless Fans',
    filter: (p: Product) => p.tags.includes('fan'),
  },
  {
    key: 'humidifier',
    title: 'Humidifiers & Diffusers',
    filter: (p: Product) => p.tags.includes('humidifier') || p.tags.includes('diffuser'),
  },
  {
    key: 'car-mount',
    title: 'Magnetic Car Mounts',
    filter: (p: Product) => p.tags.includes('car mount'),
  },
]

export const accessorySectionId = (key: string) => `acc-${key}`

// Groups on the Accessories page, each with its banner and sections
const group = (id: string, name: string, tagline: string, banner: string, keys: string[], darkBanner = false): ShowcaseGroup => ({
  id: `acc-group-${id}`,
  name,
  tagline,
  banner,
  darkBanner,
  sections: keys.map((key) => {
    const s = ACCESSORY_SECTIONS.find((x) => x.key === key)!
    return { id: accessorySectionId(s.key), name: s.title, match: s.filter }
  }),
})

export const ACCESSORY_GROUPS: ShowcaseGroup[] = [
  group('audio', 'Audio', 'SoundPod Elite wired earphones in USB-C and Lightning', audioBanner, ['earphones']),
  group('protection', 'Phone Protection', 'Cases, grips, lens guards and waterproof pouches', protectionBanner, ['case-phone', 'waterproof', 'lens', 'grip']),
  group('power', 'Power & Charging', 'GaN chargers and slim powerbanks for every day', powerBanner, ['charger', 'powerbank'], true),
  group('wearables', 'Wearables & Writing', 'Smart bands and stylus pens', wearablesBanner, ['smart-band', 'stylus']),
  group('home', 'Home Comfort', 'Bladeless fans, humidifiers and aroma diffusers', comfortBanner, ['fan', 'humidifier']),
  group('car', 'In the Car', 'Magnetic mounts for every dashboard and vent', driveBanner, ['car-mount'], true),
]
