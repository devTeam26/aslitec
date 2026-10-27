// Builds the home page artwork: hero slides (wide + phone) and square feature
// panels. Real product cut-outs staged on drawn studio sets (podiums, arches,
// coloured light), then a finishing pass (vignette + grain).
// Each image is drawn at K× and exported at several widths (name-<w>w.webp) for
// srcset, plus name.webp at the base size.
// Run: node scripts/generate-home-banners.mjs [slide ...]
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

const A = 'src/assets'
const OUT = `${A}/banners/home`
mkdirSync(OUT, { recursive: true })

const P = {
  ctrlCamo:  `${A}/gaming/WhatsApp Image 2026-07-30 at 10.59.39 (4)-01.webp`,
  ctrlGray:  `${A}/gaming/WhatsApp Image 2026-07-30 at 10.59.39 (4)-03.webp`,
  ctrlWhite: `${A}/gaming/WhatsApp Image 2026-07-30 at 10.59.39 (4)-05.webp`,
  powerbank: `${A}/accessories/Powerbank/HW121-purple.webp`,
  pbSilver:  `${A}/accessories/Powerbank/HW121-silver.webp`,
  charger:   `${A}/accessories/Home Charger Adapter/charger-u.webp`,
  maze:      `${A}/accessories/Cases/No.10 asltitec PC Maze Case/C-RED 3.webp`,
  cyber:     `${A}/accessories/Cases/No.12 aslitec Cyber Mech case/purple.webp`,
  silicone:  `${A}/accessories/Cases/No.20 aslitec Silicone Coordinate case (updated)/orange.webp`,
  kickstand: `${A}/accessories/Cases/No.5 aslitec Leather Kickstand case B/pink.webp`,
  leather:   `${A}/accessories/Cases/No.17 Leather Coordinate case (updated)/blue.webp`,
  waterproof:`${A}/accessories/WaterProof Case/front-01.webp`,
  lanyard:   `${A}/accessories/Cases/No.21 aslitec Lanyard/3 (1).webp`,
  kettleGlass: `${A}/home appliance/app-a6.webp`,
  kettleBlack: `${A}/home appliance/app-a2.webp`,
  kettle3:   `${A}/home appliance/app-a3.webp`,
  pencil:    `${A}/accessories/pencil aslitec/29.webp`,
  pencilBlk: `${A}/accessories/pencil aslitec/30.webp`,
  earphones: `${A}/smart home/Earphones SoundPod Elite - aslitec/front/double C.webp`,
  ringBlack: `${A}/accessories/R001/组 1.webp`,
  ringSand:  `${A}/accessories/R002/组 1.webp`,
  band:      `${A}/accessories/Smart Band/F橙尼龙.webp`,
  lens:      `${A}/accessories/iPh Duo Lens/1.webp`,
  camG20:    `${A}/smart home/Eva Security Cam- aslitec/JS-G20/1.webp`,
  camR02:    `${A}/smart home/Eva Security Cam- aslitec/JS-R02/r02-2.webp`,
  camP200:   `${A}/smart home/Eva Security Cam- aslitec/JS-P200/p200-1.webp`,
  camG12:    `${A}/smart home/Eva Security Cam- aslitec/JS-G12/g12-1.webp`,
  doorbell:  `${A}/smart home/Eva Security Cam- aslitec/JS-R03/3.webp`,
  fan:       `${A}/smart home/1x/BRZ-A09.webp`,
}

// ── SVG helpers ──────────────────────────────────────────────────────────────
const lin = (id, stops, [x1, y1, x2, y2] = [0, 0, 0, 1]) =>
  `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops
    .map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</linearGradient>`
const rad = (id, c, a = 1) =>
  `<radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity="${a}"/><stop offset=".5" stop-color="${c}" stop-opacity="${a * 0.35}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`
const blur = (id, s) => `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${s}"/></filter>`
// Layouts are in base pixels; K scales the raster (SVG through its viewBox)
const K = 2
const svg = (W, H, defs, body) =>
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W * K}" height="${H * K}" viewBox="0 0 ${W} ${H}"><defs>${defs}</defs>${body}</svg>`)

// Stage: a 1 × 0.75 box the props are placed in. Wide slides put it on the
// right (copy sits left); phone slides put it along the bottom (copy on top).
const FORMATS = {
  wide:   { W: 1920, H: 820,  box: { x: 880, y: 40, w: 1000, h: 780 },  widths: [1280, 1920, 2560, 3840] },
  mobile: { W: 1080, H: 1920, box: { x: 30, y: 1000, w: 1020, h: 900 }, widths: [640, 828, 1080, 1440, 2160] },
  square: { W: 1200, H: 1200, box: { x: 60, y: 260, w: 1080, h: 940 },  widths: [640, 960, 1200, 1600, 2400] },
}
const stage = (box) => {
  const s = Math.min(box.w, box.h / 0.75)
  const ox = box.x + (box.w - s) / 2
  const oy = box.y + box.h - s * 0.75
  return { s, X: (u) => ox + u * s, Y: (v) => oy + v * s, L: (d) => d * s }
}

// ── Set pieces ───────────────────────────────────────────────────────────────
let n = 0
function podium(st, { cx, w, top, color, light, dark, floor }) {
  const id = `pd${n++}`
  const x = st.X(cx - w / 2), wpx = st.L(w), ry = wpx * 0.13
  const yTop = st.Y(top), yBot = st.Y(floor)
  return {
    defs: lin(id, [[0, dark], [0.35, color], [0.7, light], [1, dark]], [0, 0, 1, 0]),
    body: `
      <ellipse cx="${x + wpx / 2}" cy="${yBot}" rx="${wpx * 0.62}" ry="${ry * 1.1}" fill="#000" opacity=".28" filter="url(#bl12)"/>
      <path d="M${x} ${yTop} L${x} ${yBot} A${wpx / 2} ${ry} 0 0 0 ${x + wpx} ${yBot} L${x + wpx} ${yTop} Z" fill="url(#${id})"/>
      <ellipse cx="${x + wpx / 2}" cy="${yTop}" rx="${wpx / 2}" ry="${ry}" fill="${light}"/>
      <ellipse cx="${x + wpx / 2}" cy="${yTop}" rx="${wpx / 2 - 1.5}" ry="${ry - 1.5}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2"/>`,
  }
}

const THEMES = {
  // UAG-style: dark, moody, hard rim light
  night: { wall: [['0', '#1a2130'], ['1', '#0b0f16']], floor: [['0', '#141a25'], ['1', '#07090d']], vignette: 0.55, grain: 0.07 },
  // UNIQ-style: warm studio cream
  cream: { wall: [['0', '#f4ede4'], ['1', '#e9dfd2']], floor: [['0', '#e2d5c5'], ['1', '#d4c4b0']], vignette: 0.18, grain: 0.05 },
  // EZVIZ-style: dusk sky gradient
  dusk:  { wall: [['0', '#9fb8d6'], ['.55', '#e9c6ae'], ['1', '#f4dcc7']], floor: [['0', '#e7d3c2'], ['1', '#c9b29e']], vignette: 0.2, grain: 0.05 },
  // Brand orange
  ember: { wall: [['0', '#e2804f'], ['1', '#b9532a']], floor: [['0', '#a94a25'], ['1', '#7d3418']], vignette: 0.35, grain: 0.06 },
  // Fresh sage kitchen light
  sage:  { wall: [['0', '#e6ebe3'], ['1', '#cfd8cb']], floor: [['0', '#c9b7a1'], ['1', '#a8937b']], vignette: 0.2, grain: 0.05 },
  // Pool blue for the waterproof gear
  aqua:  { wall: [['0', '#5fb4cf'], ['1', '#1f6f93']], floor: [['0', '#1a5f80'], ['1', '#0d3a52']], vignette: 0.4, grain: 0.06 },
}

async function cutout(file, hpx, rot = 0) {
  let img = sharp(await sharp(file).trim({ threshold: 1 }).toBuffer())
  const m = await img.metadata()
  img = img.resize({ height: Math.round(hpx), width: Math.round((hpx * m.width) / m.height) })
  if (rot) img = sharp(await img.toBuffer()).rotate(rot, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
  const buf = await img.png().toBuffer()
  const mm = await sharp(buf).metadata()
  return { buf, w: mm.width, h: mm.height }
}

// Soft drop shadow from the product's own silhouette
async function shadowOf(cut, opacity, blurPx) {
  const alpha = await sharp(cut.buf).extractChannel('alpha').toBuffer()
  const pad = blurPx * 3
  return sharp({ create: { width: cut.w, height: cut.h, channels: 3, background: '#000' } })
    .joinChannel(await sharp(alpha).linear(opacity, 0).toBuffer())
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .blur(blurPx).png().toBuffer().then((buf) => ({ buf, pad }))
}

async function render(name, fmt, { theme, floor = 0.62, decor = () => '', podiums = [], items = [], glows = [] }) {
  const { W, H, box, widths } = FORMATS[fmt]
  const st = stage(box)
  const T = THEMES[theme]
  const fy = st.Y(floor)
  let defs = lin('wall', T.wall) + lin('floor', T.floor) + blur('bl12', 12) + blur('bl40', 40) + blur('bl90', 90)
  let body = `<rect width="${W}" height="${H}" fill="url(#wall)"/>`
  body += `<rect y="${fy}" width="${W}" height="${H - fy}" fill="url(#floor)"/>`
  body += `<rect y="${fy - 2}" width="${W}" height="4" fill="#fff" opacity=".12" filter="url(#bl12)"/>`
  body += glows.map(([u, v, r, c, a]) => {
    const id = `g${n++}`; defs += rad(id, c, a)
    return `<circle cx="${st.X(u)}" cy="${st.Y(v)}" r="${st.L(r)}" fill="url(#${id})"/>`
  }).join('')
  body += decor(st, W, H, fy)
  for (const p of podiums) {
    const pd = podium(st, { floor, ...p }); defs += pd.defs; body += pd.body
  }
  const base = sharp(svg(W, H, defs, body))

  const layers = []
  for (const it of items) {
    const cut = await cutout(it.src, st.L(it.h) * K, it.rot ?? 0)
    const left = Math.round(st.X(it.cx) * K - cut.w / 2)
    const top = Math.round(st.Y(it.base) * K - cut.h)
    if (it.shadow !== false) {
      const sh = await shadowOf(cut, 0.45, Math.round(Math.max(6, st.L(0.012)) * K))
      layers.push({ input: sh.buf, left: left - sh.pad + Math.round(st.L(0.012) * K), top: top - sh.pad + Math.round(st.L(0.02) * K) })
    }
    layers.push({ input: cut.buf, left, top })
  }

  const finish = svg(W, H,
    `<radialGradient id="vig" cx=".5" cy=".45" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${T.vignette}"/></radialGradient>
     <filter id="gr"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7"/><feColorMatrix type="saturate" values="0"/></filter>`,
    `<rect width="${W}" height="${H}" fill="url(#vig)"/><rect width="${W}" height="${H}" filter="url(#gr)" opacity="${T.grain}"/>`)

  // Products may overflow the canvas edges; sharp needs every layer inside it
  const clipped = []
  for (const l of layers) {
    const m = await sharp(l.input).metadata()
    const x0 = Math.max(0, l.left), y0 = Math.max(0, l.top)
    const x1 = Math.min(W * K, l.left + m.width), y1 = Math.min(H * K, l.top + m.height)
    if (x1 <= x0 || y1 <= y0) continue
    const input = (x0 !== l.left || y0 !== l.top || x1 - l.left !== m.width || y1 - l.top !== m.height)
      ? await sharp(l.input).extract({ left: x0 - l.left, top: y0 - l.top, width: x1 - x0, height: y1 - y0 }).toBuffer()
      : l.input
    clipped.push({ input, left: x0, top: y0 })
  }

  const master = await sharp(await base.png().toBuffer())
    .composite([...clipped, { input: finish, blend: 'over' }])
    .png().toBuffer()
  const stem = `${OUT}/${name}-${fmt}`
  for (const [file, w] of [[`${stem}.webp`, W], ...widths.map((w) => [`${stem}-${w}w.webp`, w])]) {
    await sharp(master).resize({ width: w, kernel: 'lanczos3' })
      .webp({ quality: 88, effort: 6, smartSubsample: true })
      .toFile(file)
  }
  console.log('✓', stem, [W, ...widths].join(' '))
}

// ── Decor ────────────────────────────────────────────────────────────────────
const arch = (u, w, top, fill, opacity = 1, stroke = '') => (st, W, H, fy) => {
  const x = st.X(u - w / 2), wpx = st.L(w), y = st.Y(top)
  return `<path d="M${x} ${fy} L${x} ${y + wpx / 2} A${wpx / 2} ${wpx / 2} 0 0 1 ${x + wpx} ${y + wpx / 2} L${x + wpx} ${fy} Z" fill="${fill}" opacity="${opacity}" ${stroke}/>`
}
const ring = (u, v, r, color, width, opacity = 1, blurId = '') => (st) =>
  `<circle cx="${st.X(u)}" cy="${st.Y(v)}" r="${st.L(r)}" fill="none" stroke="${color}" stroke-width="${st.L(width)}" opacity="${opacity}" ${blurId ? `filter="url(#${blurId})"` : ''}/>`
const disc = (u, v, r, color, opacity = 1) => (st) =>
  `<circle cx="${st.X(u)}" cy="${st.Y(v)}" r="${st.L(r)}" fill="${color}" opacity="${opacity}"/>`
const lines = (count, color, opacity) => (st, W, H, fy) =>
  Array.from({ length: count }, (_, i) => {
    const y = (fy / count) * i
    return `<rect x="0" y="${y}" width="${W}" height="1" fill="${color}" opacity="${opacity}"/>`
  }).join('')
const all = (...fns) => (...a) => fns.map((f) => f(...a)).join('')

// ── Slides ───────────────────────────────────────────────────────────────────
const SLIDES = {
  gaming: {
    theme: 'night', floor: 0.64,
    decor: all(lines(28, '#ffffff', 0.025), ring(0.5, 0.33, 0.3, '#D4693A', 0.006, 0.9), ring(0.5, 0.33, 0.3, '#D4693A', 0.02, 0.5, 'bl40')),
    glows: [[0.24, 0.42, 0.26, '#7b5cff', 0.55], [0.76, 0.42, 0.26, '#00d0ff', 0.45], [0.5, 0.3, 0.32, '#D4693A', 0.5]],
    podiums: [
      { cx: 0.5, w: 0.36, top: 0.56, color: '#262d3a', light: '#3a4252', dark: '#10141b' },
    ],
    items: [
      { src: P.ctrlCamo, cx: 0.2, base: 0.6, h: 0.3, rot: -14 },
      { src: P.ctrlWhite, cx: 0.5, base: 0.58, h: 0.36 },
      { src: P.ctrlGray, cx: 0.8, base: 0.6, h: 0.3, rot: 14 },
    ],
  },
  cases: {
    theme: 'cream', floor: 0.66,
    decor: all(arch(0.5, 0.42, 0.02, '#D4693A', 0.95), arch(0.5, 0.3, 0.12, '#f4ede4', 1), disc(0.86, 0.12, 0.05, '#2d3444', 0.9)),
    podiums: [
      { cx: 0.16, w: 0.2, top: 0.5, color: '#e8dccd', light: '#f5ece1', dark: '#c9b8a3' },
      { cx: 0.5, w: 0.24, top: 0.58, color: '#2d3444', light: '#424b5e', dark: '#1a1f2a' },
      { cx: 0.84, w: 0.2, top: 0.46, color: '#e2804f', light: '#f09a6c', dark: '#a94a25' },
    ],
    items: [
      { src: P.maze, cx: 0.16, base: 0.505, h: 0.36 },
      { src: P.cyber, cx: 0.43, base: 0.585, h: 0.44, rot: -6 },
      { src: P.silicone, cx: 0.57, base: 0.585, h: 0.44, rot: 6 },
      { src: P.kickstand, cx: 0.84, base: 0.465, h: 0.36 },
    ],
  },
  power: {
    theme: 'ember', floor: 0.66,
    decor: all(disc(0.5, 0.34, 0.3, '#f4ede4', 0.12), ring(0.5, 0.34, 0.38, '#ffffff', 0.003, 0.35), ring(0.5, 0.34, 0.46, '#ffffff', 0.002, 0.2)),
    glows: [[0.5, 0.4, 0.4, '#ffd2b0', 0.5]],
    podiums: [
      { cx: 0.2, w: 0.22, top: 0.54, color: '#f4ede4', light: '#ffffff', dark: '#cdbfae' },
      { cx: 0.5, w: 0.26, top: 0.6, color: '#2d3444', light: '#424b5e', dark: '#1a1f2a' },
      { cx: 0.8, w: 0.22, top: 0.5, color: '#f4ede4', light: '#ffffff', dark: '#cdbfae' },
    ],
    items: [
      { src: P.powerbank, cx: 0.2, base: 0.545, h: 0.3 },
      { src: P.charger, cx: 0.5, base: 0.605, h: 0.34 },
      { src: P.ringSand, cx: 0.8, base: 0.505, h: 0.3 },
    ],
  },
  'smart-home': {
    theme: 'dusk', floor: 0.66,
    decor: all(disc(0.62, 0.18, 0.09, '#ffe3c2', 0.85), arch(0.5, 0.5, 0.0, '#2d3444', 0.92), arch(0.5, 0.38, 0.09, '#f2d8c4', 1)),
    glows: [[0.62, 0.2, 0.25, '#fff1dc', 0.7]],
    podiums: [
      { cx: 0.14, w: 0.18, top: 0.5, color: '#e7d3c2', light: '#f6e9dd', dark: '#c3a993' },
      { cx: 0.38, w: 0.2, top: 0.6, color: '#D4693A', light: '#ea8455', dark: '#9c4521' },
      { cx: 0.62, w: 0.2, top: 0.56, color: '#f6efe8', light: '#ffffff', dark: '#cdbfae' },
      { cx: 0.86, w: 0.18, top: 0.48, color: '#e7d3c2', light: '#f6e9dd', dark: '#c3a993' },
    ],
    items: [
      { src: P.camP200, cx: 0.14, base: 0.505, h: 0.24 },
      { src: P.camG20, cx: 0.38, base: 0.605, h: 0.36 },
      { src: P.camG12, cx: 0.62, base: 0.565, h: 0.24 },
      { src: P.camR02, cx: 0.86, base: 0.485, h: 0.3 },
    ],
  },
  appliances: {
    theme: 'sage', floor: 0.62,
    decor: all(arch(0.36, 0.36, 0.04, '#ffffff', 0.55), disc(0.8, 0.16, 0.06, '#D4693A', 0.9)),
    glows: [[0.4, 0.35, 0.3, '#ffffff', 0.6]],
    podiums: [{ cx: 0.68, w: 0.3, top: 0.54, color: '#2d3444', light: '#424b5e', dark: '#1a1f2a' }],
    items: [
      { src: P.kettleGlass, cx: 0.32, base: 0.63, h: 0.48 },
      { src: P.kettleBlack, cx: 0.68, base: 0.545, h: 0.42 },
    ],
  },
}

// Square feature panels (split banners)
const PANELS = {
  grip: {
    theme: 'night', floor: 0.8,
    decor: all(ring(0.5, 0.4, 0.34, '#D4693A', 0.006, 0.9), ring(0.5, 0.4, 0.34, '#D4693A', 0.025, 0.4, 'bl40')),
    glows: [[0.5, 0.4, 0.4, '#D4693A', 0.35]],
    podiums: [{ cx: 0.5, w: 0.5, top: 0.74, color: '#262d3a', light: '#3a4252', dark: '#10141b' }],
    items: [
      { src: P.ringBlack, cx: 0.36, base: 0.745, h: 0.46, rot: -10 },
      { src: P.ringSand, cx: 0.64, base: 0.745, h: 0.46, rot: 10 },
    ],
  },
  waterproof: {
    theme: 'aqua', floor: 0.78,
    decor: all(ring(0.5, 0.42, 0.28, '#ffffff', 0.003, 0.4), ring(0.5, 0.42, 0.36, '#ffffff', 0.002, 0.25), ring(0.5, 0.42, 0.44, '#ffffff', 0.0015, 0.15)),
    glows: [[0.5, 0.35, 0.4, '#bff4ff', 0.5]],
    items: [{ src: P.waterproof, cx: 0.5, base: 0.77, h: 0.66, rot: -4 }],
  },
  stylus: {
    theme: 'cream', floor: 0.78,
    decor: all(arch(0.5, 0.5, 0.02, '#D4693A', 0.95), arch(0.5, 0.36, 0.12, '#f4ede4', 1)),
    podiums: [{ cx: 0.5, w: 0.36, top: 0.7, color: '#2d3444', light: '#424b5e', dark: '#1a1f2a' }],
    items: [
      { src: P.pencil, cx: 0.44, base: 0.705, h: 0.62, rot: -8 },
      { src: P.pencilBlk, cx: 0.56, base: 0.705, h: 0.62, rot: 8 },
    ],
  },
}

const only = process.argv.slice(2)
for (const [name, def] of Object.entries(SLIDES)) {
  if (only.length && !only.includes(name)) continue
  await render(`hero-${name}`, 'wide', def)
  await render(`hero-${name}`, 'mobile', def)
}
for (const [name, def] of Object.entries(PANELS)) {
  if (only.length && !only.includes(name)) continue
  await render(`feature-${name}`, 'square', def)
}
