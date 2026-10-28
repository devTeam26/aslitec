import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useGetProductsByCategoryQuery } from '@/data/useMockData'
import { useHashScroll } from '@/lib/useHashScroll'
import FadeUp from '@/components/common/FadeUp'
import ShowcaseCard from './ShowcaseCard'
import type { Product } from '@/types'

// EZVIZ-style category page: scene hero, pill tabs, banner per group,
// then white product cards under each section label (aslitec palette).
// Shared by Smart Home, Gaming, Accessories and Appliances.

export interface ShowcaseSection {
  id: string
  name: string
  match: (p: Product) => boolean
}

export interface ShowcaseGroup {
  id: string
  name: string
  tagline: string
  banner: string
  darkBanner?: boolean
  sections: ShowcaseSection[]
}

interface Props {
  slug: string
  title: string
  intro: string
  hero: string
  heroAlt: string
  darkHero?: boolean
  groups: ShowcaseGroup[]
  Card?: React.ComponentType<{ product: Product; index?: number }>
}

// ── Sticky pill tabs ──────────────────────────────────────────────────────────
function GroupTabs({ groups }: { groups: { id: string; name: string }[] }) {
  const [active, setActive] = useState(groups[0]?.id ?? '')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length) setActive(visible[0].target.id)
      },
      { rootMargin: '-140px 0px -60% 0px' }
    )
    groups.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [groups])

  const go = (id: string) => {
    const el = document.getElementById(id)
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 130, behavior: 'smooth' })
  }

  return (
    <div data-nav-scheme="light" className="sticky top-16 md:top-[68px] z-30 bg-white shadow-[0_1px_0_#E8E4DF]">
      <div className="mx-auto max-w-[1200px] px-4">
        <div className="flex gap-3 overflow-x-auto py-3" style={{ scrollbarWidth: 'none' }}>
          {groups.map(({ id, name }) => (
            <button
              key={id}
              onClick={() => go(id)}
              className={`shrink-0 rounded-full border px-5 py-1.5 text-xs md:text-sm transition-colors ${
                active === id
                  ? 'border-[#D4693A] bg-[#D4693A] text-white'
                  : 'border-[#E8E4DF] text-[#2d3444] hover:border-[#D4693A] hover:text-[#D4693A]'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CategoryShowcase({ slug, title, intro, hero, heroAlt, darkHero, groups, Card = ShowcaseCard }: Props) {
  const { data, isLoading } = useGetProductsByCategoryQuery(slug)
  const products = data?.data ?? []
  useHashScroll(!isLoading && products.length > 0)

  // Groups resolved to their non-empty sections
  const resolved = groups.map((g) => ({
    ...g,
    resolved: g.sections
      .map((s) => ({ ...s, items: products.filter(s.match) }))
      .filter((s) => s.items.length > 0),
  })).filter((g) => isLoading || g.resolved.length > 0)

  return (
    <div data-nav-scheme="light" className="min-h-screen bg-[#FAFAF8] pt-16 md:pt-[68px]">
      {/* Solid white header backing, as on EZVIZ (the site navbar is transparent) */}
      <div className="fixed inset-x-0 top-0 z-40 h-16 md:h-[68px] bg-white" />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className={`relative overflow-hidden ${darkHero ? 'bg-[#12171f]' : 'bg-[#F7F3EE]'}`}>
        <img
          src={hero}
          alt={heroAlt}
          className="block w-full h-[220px] sm:h-[300px] md:h-auto md:aspect-[1920/620] object-cover object-[75%_center]"
        />
        <div className={`md:absolute md:inset-0 flex items-center md:bg-transparent ${darkHero ? 'bg-[#12171f]' : 'bg-white'}`}>
          <div className="mx-auto w-full max-w-[1200px] px-4">
            <motion.div
              className="max-w-[420px] py-6 md:py-0"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className={`text-3xl md:text-5xl font-semibold ${darkHero ? 'text-white' : 'text-[#2d3444]'}`}>{title}</h1>
              <p className={`mt-3 text-sm md:text-base leading-relaxed ${darkHero ? 'text-white/75' : 'text-[#666]'}`}>{intro}</p>
            </motion.div>
          </div>
        </div>
      </section>

      <GroupTabs groups={resolved} />

      {/* ── GROUPS ───────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1200px] px-4 pb-24">
        {isLoading ? (
          <div className="pt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : (
          resolved.map((group) => (
            <section key={group.id} id={group.id} className="pt-8">
              <FadeUp>
                <div className="relative overflow-hidden">
                  <img
                    src={group.banner}
                    alt=""
                    className="block w-full h-[150px] sm:h-[200px] md:h-auto md:aspect-[1920/440] object-cover object-[85%_center]"
                    loading="lazy"
                  />
                  <div className={`md:absolute md:inset-0 flex items-center px-5 py-4 md:px-16 md:py-0 md:bg-transparent ${group.darkBanner ? 'bg-[#1b1f26]' : 'bg-white'}`}>
                    <div className="md:max-w-[45%]">
                      <h2 className={`text-2xl md:text-4xl font-semibold ${group.darkBanner ? 'text-white' : 'text-[#2d3444]'}`}>
                        {group.name}
                      </h2>
                      <p className={`mt-1 md:mt-2 text-sm md:text-base ${group.darkBanner ? 'text-white/75' : 'text-[#666]'}`}>
                        {group.tagline}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeUp>

              {group.resolved.map((section) => (
                <div key={section.id} id={section.id}>
                  <h3 className="px-4 pt-8 pb-5 text-base font-semibold text-[#2d3444]">{section.name}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {section.items.map((p, i) => (
                      <Card key={p.id} product={p} index={i} />
                    ))}
                  </div>
                </div>
              ))}
            </section>
          ))
        )}
      </div>
    </div>
  )
}
