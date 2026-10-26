import { motion } from 'framer-motion'

// The one scroll-reveal used across the site: a short, gentle fade-up that
// plays once when about a fifth of the element is on screen.
export const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, delay, ease: 'easeOut' },
} as const)

export default function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} {...reveal(delay)}>
      {children}
    </motion.div>
  )
}
