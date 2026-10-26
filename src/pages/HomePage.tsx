import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, ShieldCheck, Truck, BadgeCheck, Headphones } from 'lucide-react'
import type { Product } from '@/types'
import { bestSellers, mockProducts, newArrivals, productsByCategory } from '@/data/mockProducts'
import { modelOf } from '@/data/products/smartHomeLayout'
import { scenesOf } from '@/data/products/smartHomeDetail'
import CampaignBanners from '@/components/home/CampaignBanners'
import { STORES } from '@/components/common/BuyNowButton'

// Home page in the spirit of EZVIZ / UNIQ / UAG: full-bleed hero slider,
// shop-by-category, tabbed top picks, split feature banners, room scenes,
// collections and where-to-buy. Artwork: scripts/generate-home-banners.mjs
import gamingWide from '@/assets/banners/home/hero-gaming-wide.webp'
import gamingPhone from '@/assets/banners/home/hero-gaming-mobile.webp'
import casesWide from '@/assets/banners/home/hero-cases-wide.webp'
import casesPhone from '@/assets/banners/home/hero-cases-mobile.webp'
import powerWide from '@/assets/banners/home/hero-power-wide.webp'
import powerPhone from '@/assets/banners/home/hero-power-mobile.webp'
import smartWide from '@/assets/banners/home/hero-smart-home-wide.webp'
import smartPhone from '@/assets/banners/home/hero-smart-home-mobile.webp'
import kettleWide from '@/assets/banners/home/hero-appliances-wide.webp'
import kettlePhone from '@/assets/banners/home/hero-appliances-mobile.webp'
import gripPanel from '@/assets/banners/home/feature-grip-square.webp'
import waterproofPanel from '@/assets/banners/home/feature-waterproof-square.webp'
import stylusPanel from '@/assets/banners/home/feature-stylus-square.webp'

import FadeUp, { reveal } from '@/components/common/FadeUp'
const EASE = [0.16, 1, 0.3, 1] as const

// Lifestyle clips dropped into src/assets/videos/ (see PROMPTS.md there) are
// picked up automatically: hero-<slide>.mp4 replaces a hero slide's artwork,
// action-<slide>.mp4 adds a card to the "In Action" reel.
const VIDEOS = import.meta.glob('/src/assets/videos/*.mp4', { eager: true, import: 'default' }) as Record<string, string>
const video = (name: string): string | undefined => VIDEOS[`/src/assets/videos/${name}.mp4`]

const Eyebrow = ({ children, light = false }: { children: React.ReactNode; light?: boolean }) => (
  <p className={`text-[11px] font-bold uppercase tracking-[.35em] ${light ? 'text-[#f09a6c]' : 'text-[#D4693A]'}`}>{children}</p>
)

const byModel = (model: string) => mockProducts.find((p) => modelOf(p) === model)

// ── 1. Hero slider ───────────────────────────────────────────────────────────
type Scheme = 'light' | 'dark' | 'orange'
const SLIDES: { key: string; wide: string; phone: string; tab: string; title: string; text: string; href: string; scheme: Scheme; wall: string }[] = [
  { key: 'smart-home', wide: smartWide,  phone: smartPhone,  tab: 'Smart Home',  title: 'Always Watching.\nAlways Home.', text: 'Eva security cameras with 2K clarity, colour night vision and two-way audio.', href: '/categories/smart-home', scheme: 'light', wall: '#e6cfc0' },
  { key: 'gaming', wide: gamingWide, phone: gamingPhone, tab: 'Gaming',      title: 'Play in\nFull Colour.',          text: 'G7 Pro wireless controllers with 16.8M-colour RGB and dual haptics.',         href: '/categories/gaming', scheme: 'dark', wall: '#141a25' },
  { key: 'cases', wide: casesWide,  phone: casesPhone,  tab: 'Phone Cases', title: 'Made to\nBe Held.',              text: 'Maze, Cyber Mech, Silicone and Leather Kickstand cases for every style.',     href: '/categories/accessories#acc-case-phone', scheme: 'light', wall: '#efe6dc' },
  { key: 'power', wide: powerWide,  phone: powerPhone,  tab: 'Power',       title: 'Power That\nKeeps Up.',          text: 'Power banks, GaN chargers and grip rings built for the day.',       href: '/categories/accessories#acc-powerbank', scheme: 'orange', wall: '#cf6a3c' },
  { key: 'appliances', wide: kettleWide, phone: kettlePhone, tab: 'Appliances',  title: 'The Kettle,\nReimagined.',       text: 'Glass and double-wall stainless kettles that boil fast and look good doing it.', href: '/categories/appliances', scheme: 'light', wall: '#e1e7de' },
]
const SLIDE_MS = 6500

function HeroSlider() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchX = useRef<number | null>(null)
  const slide = SLIDES[i]
  const clip = video(`hero-${slide.key}`)
  const light = slide.scheme !== 'light' || !!clip
  const go = (d: number) => setI((c) => (c + d + SLIDES.length) % SLIDES.length)

  useEffect(() => {
    if (paused) return
    const t = setTimeout(() => go(1), SLIDE_MS)
    return () => clearTimeout(t)
  }, [i, paused])

  // the navbar reads its colours from the section under it on scroll
  useEffect(() => { window.dispatchEvent(new Event('scroll')) }, [i])

  return (
    <section
      data-nav-scheme={slide.scheme}
      className="relative overflow-hidden bg-[#12171f] aspect-[9/16] max-h-[100svh] md:aspect-auto md:h-[min(100svh,calc(100vw*820/1920))] md:min-h-[500px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
        touchX.current = null
      }}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={i}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        >
          {clip ? (
            <>
              <video src={clip} poster={slide.wide} autoPlay muted loop playsInline className="size-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-transparent md:bg-gradient-to-r md:from-black/60 md:via-black/25" />
            </>
          ) : (
          /* slow push-in so every slide feels like footage */
          <motion.picture
            className="block size-full"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: SLIDE_MS / 1000 + 1.5, ease: 'easeOut' }}
          >
            <source media="(min-width: 768px)" srcSet={slide.wide} />
            <img src={slide.phone} alt={slide.tab} className="size-full object-cover md:object-[85%_center]" />
          </motion.picture>
          )}
        </motion.div>
      </AnimatePresence>

      {/* keeps the copy readable where the artwork is cropped on narrower desktops */}
      <div
        className={`absolute inset-y-0 left-0 hidden ${clip ? '' : 'md:block'} w-[55%] xl:w-[40%] transition-[background] duration-700`}
        style={{ background: `linear-gradient(90deg, ${slide.wall}e6 0%, ${slide.wall}99 55%, transparent 100%)` }}
      />

      <div className="absolute inset-0 flex items-start md:items-center">
        <div className="container pt-24 md:pt-16 md:pb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              className="max-w-[540px] md:max-w-[44%] xl:max-w-[540px]"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <Eyebrow light={light}>{slide.tab}</Eyebrow>
              <h1 className={`mt-3 whitespace-pre-line text-[clamp(34px,4.6vw,76px)] font-black leading-[.95] tracking-tight ${light ? 'text-white' : 'text-[#2d3444]'}`}>
                {slide.title}
              </h1>
              <p className={`mt-4 max-w-[400px] text-sm md:text-base leading-relaxed ${light ? 'text-white/75' : 'text-[#555]'}`}>{slide.text}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to={slide.href}
                  className={`inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold transition-colors ${
                    slide.scheme === 'orange' ? 'bg-white text-[#D4693A] hover:bg-[#2d3444] hover:text-white' : 'bg-[#D4693A] text-white hover:bg-[#bf5a2f]'
                  }`}
                >
                  Shop Now <ArrowRight className="size-4" />
                </Link>
                <Link
                  to={slide.href}
                  className={`hidden sm:inline-flex items-center rounded-full border px-7 py-3 text-sm font-semibold transition-colors ${
                    light ? 'border-white/60 text-white hover:bg-white hover:text-[#2d3444]' : 'border-[#2d3444]/30 text-[#2d3444] hover:bg-[#2d3444] hover:text-white'
                  }`}
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* arrows */}
      <div className="absolute inset-y-0 left-0 right-0 hidden xl:flex items-center justify-between px-4 pointer-events-none">
        {[[-1, ChevronLeft], [1, ChevronRight]].map(([d, Icon]) => {
          const I = Icon as typeof ChevronLeft
          return (
            <button
              key={d as number}
              onClick={() => go(d as number)}
              aria-label={d === -1 ? 'Previous slide' : 'Next slide'}
              className={`pointer-events-auto flex size-11 items-center justify-center rounded-full backdrop-blur-sm transition-colors ${
                light ? 'bg-white/10 text-white hover:bg-white/25' : 'bg-white/60 text-[#2d3444] hover:bg-white'
              }`}
            >
              <I className="size-5" />
            </button>
          )
        })}
      </div>

      {/* EZVIZ-style tab bar with progress */}
      <div className="absolute inset-x-0 bottom-0">
        <div className="container pb-5 md:pb-8">
          <div className="grid grid-cols-5 gap-2 md:gap-6">
            {SLIDES.map((s, si) => (
              <button key={s.tab} onClick={() => setI(si)} className="group text-left">
                <span className={`block h-[3px] overflow-hidden rounded-full ${light ? 'bg-white/25' : 'bg-[#2d3444]/15'}`}>
                  {si === i ? (
                    <motion.span
                      key={`${i}-${paused}`}
                      className={`block h-full ${light ? 'bg-white' : 'bg-[#D4693A]'}`}
                      initial={{ width: paused ? '100%' : '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: paused ? 0 : SLIDE_MS / 1000, ease: 'linear' }}
                    />
                  ) : si < i ? <span className={`block h-full ${light ? 'bg-white/60' : 'bg-[#2d3444]/40'}`} /> : null}
                </span>
                <span className={`mt-2 hidden lg:block text-xs font-semibold transition-colors ${
                  si === i ? (light ? 'text-white' : 'text-[#2d3444]') : (light ? 'text-white/50 group-hover:text-white' : 'text-[#2d3444]/50 group-hover:text-[#2d3444]')
                }`}>{s.tab}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── 2. Shop by category ──────────────────────────────────────────────────────
const CATEGORY_TILES = [
  { label: 'Gaming',        href: '/categories/gaming',                     bg: '#2d3444', pick: () => productsByCategory.gaming[0] },
  { label: 'Phone Cases',   href: '/categories/accessories#acc-case-phone', bg: '#F1E6DA', pick: () => mockProducts.find((p) => /cyber mech/i.test(p.name)) },
  { label: 'Power Banks',   href: '/categories/accessories#acc-powerbank',  bg: '#EADFF1', pick: () => mockProducts.find((p) => /power ?bank/i.test(p.name)) },
  { label: 'Chargers',      href: '/categories/accessories#acc-charger',    bg: '#E5E8EE', pick: () => mockProducts.find((p) => /charger adapter|travel adapter/i.test(p.name)) ?? mockProducts.find((p) => /charger/i.test(p.name)) },
  { label: 'Audio',         href: '/categories/accessories#acc-earphones',  bg: '#EFEDEA', pick: () => mockProducts.find((p) => /earphone|soundpod/i.test(p.name)) },
  { label: 'Smart Home',    href: '/categories/smart-home',                 bg: '#E3ECF3', pick: () => productsByCategory['smart-home'][0] },
  { label: 'Appliances',    href: '/categories/appliances',                 bg: '#E4EBE1', pick: () => productsByCategory.appliances[0] },
  { label: 'Stylus',        href: '/categories/accessories#acc-stylus',     bg: '#F6E3E3', pick: () => mockProducts.find((p) => /stylus|pencil/i.test(p.name)) },
]

function ShopByCategory() {
  return (
    <section data-nav-scheme="light" className="bg-white py-16 md:py-24">
      <div className="container">
        <FadeUp className="mb-8 md:mb-12 flex items-end justify-between gap-6">
          <div>
            <Eyebrow>Explore</Eyebrow>
            <h2 className="mt-2 text-3xl md:text-5xl font-black tracking-tight text-[#2d3444]">Shop by Category</h2>
          </div>
        </FadeUp>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-5">
          {CATEGORY_TILES.map((c, ci) => {
            const img = c.pick()?.images[0]?.url
            const dark = c.bg === '#2d3444'
            return (
              <FadeUp key={c.label} delay={(ci % 4) * 0.06}>
                <Link
                  to={c.href}
                  className="group relative flex aspect-[4/5] flex-col overflow-hidden rounded-3xl p-5 md:p-6"
                  style={{ background: c.bg }}
                >
                  <span className={`text-base md:text-xl font-black ${dark ? 'text-white' : 'text-[#2d3444]'}`}>{c.label}</span>
                  <span className={`mt-1 inline-flex items-center gap-1 text-xs font-semibold ${dark ? 'text-white/60' : 'text-[#2d3444]/60'} group-hover:text-[#D4693A] transition-colors`}>
                    Shop now <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                  {img && (
                    <img
                      src={img}
                      alt={c.label}
                      loading="lazy"
                      className="absolute inset-x-[10%] bottom-[4%] h-[66%] w-[80%] object-contain drop-shadow-[0_18px_24px_rgba(0,0,0,0.18)] transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3"
                    />
                  )}
                </Link>
              </FadeUp>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ── 3. Top picks (tabbed rail) ───────────────────────────────────────────────
const NEW_IDS = new Set(newArrivals.map((p) => p.id))

function ProductTile({ product }: { product: Product }) {
  return (
    <Link to={`/products/${product.slug}`} className="group block w-[220px] md:w-[260px] shrink-0 snap-start">
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#F4F1EC]">
        {NEW_IDS.has(product.id) && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-[#D4693A] px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">New</span>
        )}
        {product.images[0] && (
          <img
            src={product.images[0].url}
            alt={product.name}
            loading="lazy"
            className="size-full object-contain p-7 mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-[#999]">{product.category.name}</p>
      <h3 className="mt-1 text-sm font-semibold text-[#2d3444] leading-snug line-clamp-2 group-hover:text-[#D4693A] transition-colors">
        {product.name.replace(/^aslitec\s+/i, '')}
      </h3>
    </Link>
  )
}

const PICK_TABS: { label: string; products: Product[]; href: string }[] = [
  { label: 'Just Released', products: newArrivals.slice(0, 12), href: '/categories/accessories' },
  { label: 'Best Sellers',  products: bestSellers,              href: '/categories/accessories' },
  { label: 'Smart Home',    products: productsByCategory['smart-home'], href: '/categories/smart-home' },
  { label: 'Gaming',        products: productsByCategory.gaming, href: '/categories/gaming' },
]

function TopPicks() {
  const [tab, setTab] = useState(0)
  const rail = useRef<HTMLDivElement>(null)
  const scroll = (d: number) => rail.current?.scrollBy({ left: d * rail.current.clientWidth * 0.8, behavior: 'smooth' })
  const current = PICK_TABS[tab]

  return (
    <section data-nav-scheme="light" className="bg-[#FAFAF8] py-16 md:py-24 overflow-hidden">
      <div className="container">
        <FadeUp className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-8">
          <div>
            <Eyebrow>Our Top Picks</Eyebrow>
            <h2 className="mt-2 text-3xl md:text-5xl font-black tracking-tight text-[#2d3444]">Made for Every Day</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1 overflow-x-auto rounded-full bg-white p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shadow-[0_1px_0_#E8E4DF,0_4px_20px_rgba(45,52,68,0.06)]">
              {PICK_TABS.map((t, ti) => (
                <button
                  key={t.label}
                  onClick={() => { setTab(ti); rail.current?.scrollTo({ left: 0 }) }}
                  className={`relative shrink-0 rounded-full px-4 py-2 text-xs md:text-sm font-semibold transition-colors ${
                    tab === ti ? 'text-white' : 'text-[#2d3444] hover:text-[#D4693A]'
                  }`}
                >
                  {tab === ti && <motion.span layoutId="pick-pill" className="absolute inset-0 rounded-full bg-[#2d3444]" transition={{ duration: 0.35, ease: EASE }} />}
                  <span className="relative">{t.label}</span>
                </button>
              ))}
            </div>
            <div className="hidden md:flex gap-2">
              {[-1, 1].map((d) => (
                <button
                  key={d}
                  onClick={() => scroll(d)}
                  aria-label={d < 0 ? 'Scroll left' : 'Scroll right'}
                  className="flex size-10 items-center justify-center rounded-full border border-[#E8E4DF] bg-white text-[#2d3444] hover:border-[#2d3444] transition-colors"
                >
                  {d < 0 ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
                </button>
              ))}
            </div>
          </div>
        </FadeUp>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            ref={rail}
            className="-mx-4 flex snap-x snap-mandatory gap-4 md:gap-6 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            {current.products.map((p) => <ProductTile key={p.id} product={p} />)}
            <Link
              to={current.href}
              className="flex w-[220px] md:w-[260px] shrink-0 snap-start aspect-square flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-[#E8E4DF] text-sm font-bold text-[#2d3444] hover:border-[#D4693A] hover:text-[#D4693A] transition-colors"
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-[#2d3444] text-white"><ArrowRight className="size-5" /></span>
              View all
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

// ── 4. Split feature banners (UAG) ───────────────────────────────────────────
const FEATURES = [
  {
    image: gripPanel, bg: '#12171f', scheme: 'dark' as Scheme, tag: 'Grip Rings', href: '/categories/accessories#acc-grip',
    title: 'All Grip.\nNo Slip.',
    text: 'Wave-textured grip rings for a secure one-handed hold while you scroll, shoot or call. The hinged R002 folds out to prop your phone up for videos.',
    points: ['Wave-textured grip band', 'Fold-out stand on R002', 'Up to 7 colours'],
  },
  {
    image: waterproofPanel, bg: '#1f6f93', scheme: 'dark' as Scheme, tag: 'Waterproof Case', href: '/categories/accessories#acc-waterproof',
    title: 'Dive In.\nStay Dry.',
    text: 'IP68 protection, submersible up to 2 metres for 30 minutes, in a dual-layer shell built to military-grade drop standards.',
    points: ['IP68, 2 m for 30 minutes', 'MIL-STD-810H drop protection', 'Full touchscreen access'],
  },
  {
    image: stylusPanel, bg: '#F4EDE4', scheme: 'light' as Scheme, tag: 'Stylus', href: '/categories/accessories#acc-stylus',
    title: 'Write. Sketch.\nCreate.',
    text: 'Palm rejection and tilt shading in a pencil that feels as natural as paper.',
    points: ['Palm rejection', 'Tilt sensitivity', 'USB-C charging'],
  },
]

function FeatureSplit({ f, index }: { f: (typeof FEATURES)[number]; index: number }) {
  const light = f.scheme === 'dark'
  const href = f.href
  return (
    <section data-nav-scheme={f.scheme} style={{ background: f.bg }} className="overflow-hidden">
      <div className={`grid md:grid-cols-2 items-center ${index % 2 ? 'md:[&>*:first-child]:order-2' : ''}`}>
        <motion.div
          className="relative aspect-square overflow-hidden"
          {...reveal()}
        >
          <img src={f.image} alt={f.tag} loading="lazy" className="size-full object-cover" />
        </motion.div>
        <div className="px-6 py-14 md:px-16 lg:px-24">
          <FadeUp>
            <Eyebrow light={light}>{f.tag}</Eyebrow>
            <h2 className={`mt-3 whitespace-pre-line text-[clamp(40px,5.5vw,80px)] font-black leading-[.92] tracking-tight ${light ? 'text-white' : 'text-[#2d3444]'}`}>
              {f.title}
            </h2>
            <p className={`mt-5 max-w-md text-sm md:text-base leading-relaxed ${light ? 'text-white/70' : 'text-[#666]'}`}>{f.text}</p>
            <ul className="mt-6 space-y-2">
              {f.points.map((pt) => (
                <li key={pt} className={`flex items-center gap-3 text-sm font-semibold ${light ? 'text-white' : 'text-[#2d3444]'}`}>
                  <span className="size-1.5 rounded-full bg-[#D4693A]" /> {pt}
                </li>
              ))}
            </ul>
            <Link
              to={href}
              className={`mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold transition-colors ${
                light ? 'bg-white text-[#2d3444] hover:bg-[#D4693A] hover:text-white' : 'bg-[#2d3444] text-white hover:bg-[#D4693A]'
              }`}
            >
              Shop {f.tag} <ArrowRight className="size-4" />
            </Link>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}

// ── 5. All in one home (EZVIZ room scenes) ───────────────────────────────────
const ROOMS = [
  { room: 'Living Room', models: ['BRZ-A09', 'JS-P200'], scene: 'hero' },
  { room: 'Bedroom',     models: ['VAS-302', 'VRM-370'], scene: 'hero' },
  { room: 'Entrance',    models: ['JS-R03', 'JS-G12'],   scene: 'hero' },
  { room: 'Home Office', models: ['JS-P160', 'VR-A807'], scene: 'hero' },
  { room: 'Yard',        models: ['JS-G20', 'JS-R02'],   scene: 'use' },
  { room: 'On the Road', models: ['MGP40S', 'MGQV2C'],   scene: 'hero' },
].map((r) => {
  const products = r.models.map(byModel).filter((p): p is Product => !!p)
  const s = products[0] ? scenesOf(products[0]) : undefined
  return { ...r, products, image: r.scene === 'use' ? s?.uses[0] ?? s?.hero : s?.hero }
}).filter((r) => r.image && r.products.length)

function HomeScenes() {
  const [i, setI] = useState(0)
  const r = ROOMS[i]
  if (!r) return null
  return (
    <section data-nav-scheme="light" className="bg-[#F7F3EE] py-16 md:py-24">
      <div className="container">
        <FadeUp className="text-center">
          <Eyebrow>The aslitec Smart Home</Eyebrow>
          <h2 className="mt-2 text-3xl md:text-5xl font-black tracking-tight text-[#2d3444]">All in One Home</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm md:text-base text-[#666]">Pick a room and see what fits.</p>
        </FadeUp>

        <div className="mt-8 flex justify-start md:justify-center gap-6 md:gap-10 overflow-x-auto border-b border-[#E8E4DF] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {ROOMS.map((room, ri) => (
            <button
              key={room.room}
              onClick={() => setI(ri)}
              className={`relative shrink-0 pb-3 text-sm md:text-base font-semibold transition-colors ${ri === i ? 'text-[#D4693A]' : 'text-[#2d3444]/60 hover:text-[#2d3444]'}`}
            >
              {room.room}
              {ri === i && <motion.span layoutId="room-line" className="absolute inset-x-0 -bottom-px h-0.5 bg-[#D4693A]" />}
            </button>
          ))}
        </div>

        <div className="relative mt-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#12171f] aspect-[4/3] md:aspect-[1920/800]">
          <AnimatePresence initial={false}>
            <motion.img
              key={r.image}
              src={r.image}
              alt={r.room}
              className="absolute inset-0 size-full object-cover object-[70%_center]"
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: EASE }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-black/35 via-transparent to-transparent" />
        </div>
          <div className="mt-3 flex flex-col gap-2 md:absolute md:left-8 md:bottom-8 md:mt-0 md:w-[320px]">
            <AnimatePresence mode="wait">
              <motion.div key={i} className="flex flex-col gap-2" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.4 }}>
                {r.products.map((p) => (
                  <Link
                    key={p.id}
                    to={`/products/${p.slug}`}
                    className="group flex items-center gap-3 rounded-2xl bg-white p-2 pr-4 shadow-[0_1px_0_#E8E4DF] md:bg-white/90 md:shadow-none md:backdrop-blur-md hover:bg-white transition-colors"
                  >
                    <span className="size-12 shrink-0 overflow-hidden rounded-xl bg-[#F7F3EE]">
                      {p.images[0] && <img src={p.images[0].url} alt="" className="size-full object-contain p-1" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-[#D4693A]">{modelOf(p)}</span>
                      <span className="block truncate text-sm font-semibold text-[#2d3444]">{p.name.replace(/^aslitec\s+/i, '')}</span>
                    </span>
                    <ArrowUpRight className="size-4 shrink-0 text-[#2d3444]/50 group-hover:text-[#D4693A]" />
                  </Link>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── 5b. In Action: vertical lifestyle reels (shown once clips exist) ──────────
const REELS = [
  { key: 'smart-home', title: 'Answer from anywhere', product: 'Eva Security Cameras', href: '/categories/smart-home' },
  { key: 'gaming',     title: 'Game night, lit up',   product: 'G7 Pro Controller',    href: '/categories/gaming' },
  { key: 'cases',      title: 'Grip it. Stand it.',   product: 'Phone Cases & Grips',  href: '/categories/accessories#acc-case-phone' },
  { key: 'power',      title: 'Charged on the move',  product: 'HW121 Powerbank',      href: '/categories/accessories#acc-powerbank' },
  { key: 'appliances', title: 'Morning, sorted',      product: 'Glass Kettle',         href: '/categories/appliances' },
  { key: 'waterproof', title: 'Poolside, worry-free', product: 'WaterProof Case',      href: '/categories/accessories#acc-waterproof' },
].flatMap((r) => { const src = video(`action-${r.key}`); return src ? [{ ...r, src }] : [] })

function InAction() {
  if (!REELS.length) return null
  return (
    <section data-nav-scheme="dark" className="bg-[#12171f] py-16 md:py-24 overflow-hidden">
      <div className="container">
        <FadeUp className="mb-8 md:mb-12">
          <Eyebrow light>Our Products & People in Action</Eyebrow>
          <h2 className="mt-2 text-3xl md:text-5xl font-black tracking-tight text-white">Made for Real Life</h2>
        </FadeUp>
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {REELS.map((r) => (
            <Link key={r.key} to={r.href} className="group relative block w-[240px] md:w-[280px] shrink-0 snap-start aspect-[9/16] overflow-hidden rounded-3xl bg-black">
              <video src={r.src} autoPlay muted loop playsInline preload="metadata" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#f09a6c]">{r.product}</p>
                <h3 className="mt-1 text-lg font-bold text-white leading-snug">{r.title}</h3>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-white/80 group-hover:text-white">
                  Shop now <ArrowRight className="size-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── 6. Featured collections (UNIQ) ───────────────────────────────────────────
const COLLECTIONS = [
  { title: 'Gaming',      sub: 'G7 Pro RGB controllers',   image: gamingPhone, href: '/categories/gaming',                    light: true },
  { title: 'Phone Cases', sub: 'Grip, guard and stand',    image: casesPhone,  href: '/categories/accessories#acc-case-phone', light: false },
  { title: 'Power',       sub: 'Charge anywhere',          image: powerPhone,  href: '/categories/accessories#acc-powerbank',  light: true },
  { title: 'Appliances',  sub: 'Kettles, fast and quiet',  image: kettlePhone, href: '/categories/appliances',                 light: false },
]

function FeaturedCollections() {
  return (
    <section data-nav-scheme="light" className="bg-white py-16 md:py-24">
      <div className="container">
        <FadeUp className="mb-8 md:mb-12">
          <Eyebrow>Featured Collections</Eyebrow>
          <h2 className="mt-2 text-3xl md:text-5xl font-black tracking-tight text-[#2d3444]">Find Your Fit</h2>
        </FadeUp>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {COLLECTIONS.map((c, ci) => (
            <FadeUp key={c.title} delay={ci * 0.07}>
              <Link to={c.href} className="group relative block aspect-[9/16] lg:aspect-[3/4] overflow-hidden rounded-3xl">
                <img src={c.image} alt={c.title} loading="lazy" className="size-full object-cover object-bottom transition-transform duration-700 ease-out group-hover:scale-105" />
                <div className="absolute inset-x-0 top-0 p-5 md:p-7">
                  <h3 className={`text-xl md:text-3xl font-black ${c.light ? 'text-white' : 'text-[#2d3444]'}`}>{c.title}</h3>
                  <p className={`mt-1 text-xs md:text-sm ${c.light ? 'text-white/70' : 'text-[#2d3444]/70'}`}>{c.sub}</p>
                  <span className={`mt-3 inline-flex items-center gap-1 text-xs md:text-sm font-bold ${c.light ? 'text-white' : 'text-[#D4693A]'}`}>
                    Discover <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── 7. Promise strip + where to buy ──────────────────────────────────────────
const PROMISES = [
  { icon: BadgeCheck,  title: '100% Authentic',   text: 'Official aslitec products' },
  { icon: ShieldCheck, title: 'Warranty',         text: 'Covered from day one' },
  { icon: Truck,       title: 'Fast Delivery',    text: 'Through our retail partners' },
  { icon: Headphones,  title: 'Real Support',     text: 'People who know the products' },
]

function WhereToBuy() {
  return (
    <>
      <section data-nav-scheme="light" className="border-y border-[#E8E4DF] bg-[#FAFAF8]">
        <div className="container grid grid-cols-2 lg:grid-cols-4">
          {PROMISES.map(({ icon: Icon, title, text }, pi) => (
            <div key={title} className={`flex items-center gap-3 py-6 md:py-8 ${pi % 2 ? 'pl-4 md:pl-8' : ''} ${pi > 1 ? 'border-t lg:border-t-0 border-[#E8E4DF]' : ''} ${pi > 0 ? 'lg:border-l lg:pl-8' : ''} border-[#E8E4DF]`}>
              <Icon className="size-7 shrink-0 text-[#D4693A]" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-bold text-[#2d3444]">{title}</p>
                <p className="text-xs text-[#888]">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section data-nav-scheme="orange" className="relative overflow-hidden bg-[#D4693A] py-20 md:py-28">
        <div className="absolute -right-32 -top-32 size-[420px] rounded-full border border-white/20" />
        <div className="absolute -right-10 -top-10 size-[260px] rounded-full border border-white/20" />
        <div className="container relative grid gap-10 lg:grid-cols-2 lg:items-center">
          <FadeUp>
            <p className="text-[11px] font-bold uppercase tracking-[.35em] text-white/70">Where to Buy</p>
            <h2 className="mt-3 text-[clamp(40px,6vw,84px)] font-black leading-[.92] tracking-tight text-white">
              Get aslitec<br />Near You.
            </h2>
            <p className="mt-5 max-w-md text-sm md:text-base text-white/75 leading-relaxed">
              Every product on this site is available from our official retail partners, online and in store.
            </p>
          </FadeUp>
          <div className="grid gap-4 sm:grid-cols-2">
            {STORES.map((s, si) => (
              <FadeUp key={s.name} delay={si * 0.08}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col justify-between gap-10 rounded-3xl bg-white p-7 transition-transform hover:-translate-y-1"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#999]">Official partner</span>
                  <span className="flex items-end justify-between gap-4">
                    <span className="text-2xl font-black text-[#2d3444]">{s.name}</span>
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#2d3444] text-white group-hover:bg-[#D4693A] transition-colors">
                      <ArrowUpRight className="size-5" />
                    </span>
                  </span>
                </a>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default function HomePage() {
  return (
    <div>
      <HeroSlider />
      <ShopByCategory />
      <TopPicks />
      <FeatureSplit f={FEATURES[0]} index={0} />
      <HomeScenes />
      <FeatureSplit f={FEATURES[1]} index={1} />
      <InAction />
      <FeaturedCollections />
      <CampaignBanners />
      <FeatureSplit f={FEATURES[2]} index={2} />
      <WhereToBuy />
    </div>
  )
}
