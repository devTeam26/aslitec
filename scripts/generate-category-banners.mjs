// Builds the Gaming, Accessories and Appliances category banners: hero + one
// banner per group, in the Smart Home style (left side kept clear for text).
// Reuses the Smart Home scene renderer and adds a gaming room and a kitchen.
// Run: node scripts/generate-category-banners.mjs [gaming | accessories | appliances ...]
import { mkdirSync } from 'node:fs'
import { SCENES, render, svg, lin, rad, tex, plaster, plant, gobo, bokeh, S, C } from './generate-smart-home-scenes.mjs'

const A = 'src/assets'
const P = {
  ctrlBlack: `${A}/gaming/WhatsApp Image 2026-07-30 at 10.59.39 (4)-02.webp`,
  ctrlWhite: `${A}/gaming/WhatsApp Image 2026-07-30 at 10.59.39 (4)-05.webp`,
  ctrlBlue:  `${A}/gaming/WhatsApp Image 2026-07-30 at 10.59.39 (4)-01.webp`,
  ctrlGray:  `${A}/gaming/WhatsApp Image 2026-07-30 at 10.59.39 (4)-03.webp`,
  ctrlGreen: `${A}/gaming/WhatsApp Image 2026-07-30 at 10.59.39 (4)-04.webp`,
  kettleBlack: `${A}/home appliance/app-a2.webp`,
  kettleGray:  `${A}/home appliance/app-a3.webp`,
  kettleGlass: `${A}/home appliance/1781163413031-019eb59b-9d11-7dab-a991-a37062e43c17.webp`,
  kettleMint:  `${A}/home appliance/app-a4.webp`,
  kettleSteel: `${A}/home appliance/Image_20260614110630_265_2.webp`,
  earphones: `${A}/smart home/Earphones SoundPod Elite - aslitec/front/double C.webp`,
  maze:      `${A}/accessories/Cases/No.10 asltitec PC Maze Case/C-RED 3.webp`,
  cyber:     `${A}/accessories/Cases/No.12 aslitec Cyber Mech case/purple.webp`,
  silicone:  `${A}/accessories/Cases/No.20 aslitec Silicone Coordinate case (updated)/orange.webp`,
  kickstand: `${A}/accessories/Cases/No.5 aslitec Leather Kickstand case B/pink.webp`,
  ringBlack: `${A}/accessories/R001/组 1.webp`,
  ringSand:  `${A}/accessories/R002/组 1.webp`,
  charger:   `${A}/accessories/Home Charger Adapter/charger-u.webp`,
  pbPurple:  `${A}/accessories/Powerbank/HW121-purple.webp`,
  pbSilver:  `${A}/accessories/Powerbank/HW121-silver.webp`,
  pbBlue:    `${A}/accessories/Powerbank/HW121-blue.webp`,
  band:      `${A}/accessories/Smart Band/F橙尼龙.webp`,
  pencil:    `${A}/accessories/pencil aslitec/29.webp`,
  pencilBlk: `${A}/accessories/pencil aslitec/30.webp`,
}

const hex = (cx, cy, r) => Array.from({ length: 6 }, (_, i) => {
  const a = Math.PI / 3 * i + Math.PI / 6
  return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`
}).join(' ')

// LED palettes for the gaming room
const LED = {
  rgb:  [[0, C.orange], [0.35, '#ff4fa3'], [0.7, '#7b5cff'], [1, '#2ec5ff']],
  camo: [[0, '#9bd36a'], [0.4, '#2fd3b0'], [0.75, '#2ec5ff'], [1, C.orange]],
}

// Dark gaming room: hex acoustic panels, blurred monitor, RGB strip and a glossy desk
SCENES.gamingRoom = (W, H, led = 'rgb') => {
  const f = H * 0.7
  const stops = LED[led]
  const cells = []
  const r = H * 0.075
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 14; col++) {
      const cx = W * 0.42 + col * r * 1.74 + (row % 2) * r * 0.87, cy = H * 0.05 + row * r * 1.5
      if (cy > f - r * 0.5 || cx > W + r) continue
      const lit = (col * 7 + row * 3) % 11 === 0
      cells.push(`<polygon points="${hex(cx, cy, r * 0.92)}" fill="${lit ? stops[(col + row) % stops.length][1] : '#1b2030'}" opacity="${lit ? 0.55 : 0.9}"/>`)
    }
  }
  return {
    floor: f + H * 0.06, light: [0.55, 0.0], reflect: 0.25,
    grade: { tint: [140, 110, 255, 0.06], bloom: [0.7, 0.55, 0.45, stops[1][1], 0.3], vig: 0.5 },
    bg: svg(W, H, `<defs>${lin('wl', [[0, '#0b0e15'], [1, '#171c28']], [0, 0, 1, 0])}${lin('led', stops, [0, 0, 1, 0])}${lin('dk', [[0, '#1a1e28'], [1, '#06070a']])}
        ${lin('sc', [[0, stops[3][1]], [0.5, '#262b52'], [1, stops[0][1]]], [0, 0, 1, 1])}${rad('gl', stops[2][1], 0.5, 0.4)}</defs>
      <rect width="${W}" height="${H}" fill="url(#wl)"/>
      ${plaster(0, 0, W, f, 0.25)}
      <g filter="url(#b3)">${cells.join('')}</g>
      <g filter="url(#b14)">
        <rect x="${W * 0.03}" y="${H * 0.14}" width="${W * 0.34}" height="${H * 0.42}" rx="8" fill="#05060a"/>
        <rect x="${W * 0.04}" y="${H * 0.16}" width="${W * 0.32}" height="${H * 0.37}" fill="url(#sc)" opacity=".75"/>
        <rect x="${W * 0.18}" y="${H * 0.56}" width="${W * 0.04}" height="${f - H * 0.56}" fill="#0b0d12"/>
      </g>
      <ellipse cx="${W * 0.2}" cy="${H * 0.35}" rx="${W * 0.28}" ry="${H * 0.4}" fill="url(#gl)" opacity=".5"/>
      <rect x="0" y="${f - H * 0.32}" width="${W}" height="${H * 0.32}" fill="url(#led)" opacity=".16" filter="url(#b40)"/>
      <rect x="0" y="${f - 5}" width="${W}" height="5" fill="url(#led)"/>
      <rect x="0" y="${f - 12}" width="${W}" height="18" fill="url(#led)" opacity=".7" filter="url(#b8)"/>
      <rect y="${f}" width="${W}" height="${H - f}" fill="url(#dk)"/>
      ${tex(0, f, W, H - f, { fx: 0.002, fy: 0.03, oct: 3, seed: 13, rgb: [80, 90, 120], a: 0.6, b: -0.35 })}
      <rect x="0" y="${f}" width="${W}" height="${H * 0.12}" fill="url(#led)" opacity=".12" filter="url(#b14)"/>
      <rect x="0" y="${f}" width="${W}" height="2" fill="#fff" opacity=".12"/>
      ${bokeh(Array.from({ length: 16 }, (_, i) => [W * (0.05 + ((i * 0.173) % 0.9)), H * (0.08 + ((i * 0.31) % 0.5)), 2 + (i % 3)]), stops.map((s) => s[1]), 0.5)}`),
  }
}
SCENES.gamingCamo = (W, H) => SCENES.gamingRoom(W, H, 'camo')

// Bright kitchen: subway tiles, window light, blurred open shelf, marble counter
SCENES.kitchen = (W, H, warm = false) => {
  const f = H * 0.72
  const tw = W * 0.055, th = tw * 0.42
  const tiles = []
  for (let y = H * 0.18, row = 0; y < f; y += th, row++) {
    for (let x = -(row % 2) * tw / 2; x < W; x += tw) tiles.push(`<rect x="${x + 1}" y="${y + 1}" width="${tw - 2}" height="${th - 2}" rx="3" fill="#fff" opacity=".35" stroke="#cdbfae" stroke-width="1.5"/>`)
  }
  const jars = [[0.56, '#e8d3b5'], [0.6, C.orange], [0.635, '#a7b89a'], [0.68, '#f4efe8'], [0.86, '#d9c3a3'], [0.9, C.navy]]
  return {
    floor: f + H * 0.06, light: [0.12, 0.0], reflect: 0.12,
    grade: warm ? { tint: [255, 180, 120, 0.16], bloom: [0.12, 0.05, 0.55, '#ffd9a8', 0.55], vig: 0.3 }
                : { tint: [255, 222, 185, 0.08], bloom: [0.12, 0.05, 0.55, '#fff7ea', 0.55], vig: 0.22 },
    bg: svg(W, H, `<defs>${lin('wl', warm ? [[0, '#f1e2cf'], [1, '#dcc4a6']] : [[0, '#f8f3ec'], [1, '#e8ddcf']], [0, 0, 1, 0])}${lin('ct', [[0, '#f7f4ef'], [1, '#d8d1c7']])}${lin('bd', [[0, '#d7ad7c'], [1, '#a77a4d']], [0, 0, 1, 0])}</defs>
      <rect width="${W}" height="${H}" fill="url(#wl)"/>
      ${plaster(0, 0, W, H * 0.18, 0.5)}
      ${tiles.join('')}
      ${gobo(-W * 0.02, H * 0.0, W * 0.09, H * 0.28, 3, 2, -20, '#fffaf0', 0.4, 16)}
      <g filter="url(#b10)">
        <rect x="${W * 0.52}" y="${H * 0.2}" width="${W * 0.46}" height="${H * 0.025}" fill="#c9a37b"/>
        ${jars.map(([x, c], i) => `<rect x="${W * x}" y="${H * (0.2 - 0.09 - (i % 2) * 0.03)}" width="${W * 0.026}" height="${H * (0.09 + (i % 2) * 0.03)}" rx="6" fill="${c}"/>`).join('')}
        <rect x="${W * 0.73}" y="${H * 0.06}" width="${W * 0.08}" height="${H * 0.14}" rx="10" fill="#fbf7f1" stroke="#cdbfae" stroke-width="3"/>
        <rect x="${W * 0.47}" y="${f - H * 0.36}" width="${W * 0.07}" height="${H * 0.36}" rx="${W * 0.02}" fill="url(#bd)"/>
        ${plant(W * 0.985, f, H / 520, '#7d9a62', '#5f7a4b', '#e9e1d6')}
      </g>
      <rect y="${f}" width="${W}" height="${H - f}" fill="url(#ct)"/>
      ${tex(0, f, W, H - f, { fx: 0.0025, fy: 0.02, oct: 4, seed: 17, rgb: [120, 110, 100], a: 1.3, b: -0.72 })}
      <rect y="${f}" width="${W}" height="3" fill="#fff" opacity=".9"/>
      <rect y="${f + 3}" width="${W}" height="${H * 0.04}" fill="#000" opacity=".06" filter="url(#b6)"/>
      <polygon points="${W * 0.0},${f} ${W * 0.4},${f} ${W * 0.3},${H} ${W * 0.0},${H}" fill="#fff8ec" opacity=".3" filter="url(#b20)"/>`),
  }
}
SCENES.kitchenWarm = (W, H) => SCENES.kitchen(W, H, true)

// Light study: window light on a cream wall, books and plant on the right, oak desk
SCENES.study = (W, H) => {
  const f = H * 0.68
  return {
    floor: f + H * 0.05, light: [0.1, 0.0], reflect: 0.08,
    grade: { tint: [255, 215, 175, 0.1], bloom: [0.1, 0.05, 0.5, '#fff6e6', 0.5], vig: 0.25 },
    bg: svg(W, H, `<defs>${lin('wl', [[0, '#f5f0e9'], [1, '#e2d8cb']], [0, 0, 1, 0])}${lin('dk', [[0, '#e2c5a2'], [1, '#c09a73']])}</defs>
      <rect width="${W}" height="${H}" fill="url(#wl)"/>
      ${plaster(0, 0, W, f, 0.6)}
      ${gobo(-W * 0.02, H * 0.0, W * 0.1, H * 0.3, 3, 2, -22, '#fff8ec', 0.35, 16)}
      <g filter="url(#b14)">
        <rect x="${W * 0.58}" y="${H * 0.3}" width="${W * 0.4}" height="${H * 0.025}" fill="#c8a681"/>
        ${['#c96b40', C.navy, '#d9c7ad', '#7f8f75', '#b8846b', '#384055', '#e3cdb4'].map((c, i) => `<rect x="${W * (0.6 + i * 0.03)}" y="${H * (0.13 + (i % 3) * 0.025)}" width="${W * 0.026}" height="${H * (0.17 - (i % 3) * 0.025)}" fill="${c}"/>`).join('')}
        ${plant(W * 0.93, H * 0.3, H / 900)}
      </g>
      <rect y="${f}" width="${W}" height="${H - f}" fill="url(#dk)"/>
      ${tex(0, f, W, H - f, { fx: 0.0025, fy: 0.08, oct: 4, seed: 7, rgb: [110, 70, 35], a: 1.5, b: -0.55 })}
      <rect y="${f}" width="${W}" height="3" fill="#f0dcc2"/>`),
  }
}

// Podium positions in SCENES.podium (centre x, podium top)
const POD = [[0.47, 0.62], [0.575, 0.42], [0.68, 0.7], [0.8, 0.54], [0.9, 0.66]]
const on = (i, h, dx = 0) => S(h, POD[i][0] + dx, { base: POD[i][1] + 0.005 })

// [file, W, H, scene, [[photo, placement], ...]]
const SETS = {
  gaming: [
    ['hero', 1920, 620, 'gamingRoom', [[P.ctrlBlack, S(0.42, 0.6)], [P.ctrlWhite, S(0.42, 0.86)], [P.ctrlBlue, S(0.36, 0.73, { base: 0.82 })]]],
    ['rgb', 1920, 440, 'gamingRoom', [[P.ctrlBlack, S(0.5, 0.66)], [P.ctrlWhite, S(0.5, 0.86)]]],
    ['camo', 1920, 440, 'gamingCamo', [[P.ctrlGreen, S(0.46, 0.6)], [P.ctrlGray, S(0.46, 0.92)], [P.ctrlBlue, S(0.5, 0.76, { base: 0.84 })]]],
  ],
  accessories: [
    ['hero', 1920, 620, 'podium', [
      [P.band, on(0, 0.2)], [P.pbPurple, on(1, 0.26)], [P.cyber, on(2, 0.44, -0.025)], [P.ringSand, on(2, 0.26, 0.045)],
      [P.silicone, on(3, 0.38)], [P.charger, on(4, 0.2)],
    ]],
    ['audio', 1920, 440, 'study', [[P.earphones, S(0.62, 0.74)]]],
    ['protection', 1920, 440, 'shelf', [[P.ringBlack, S(0.34, 0.55)], [P.maze, S(0.56, 0.64)], [P.cyber, S(0.56, 0.73)], [P.silicone, S(0.56, 0.82)], [P.kickstand, S(0.56, 0.91)]]],
    ['power', 1920, 440, 'desk', [[P.pbPurple, S(0.44, 0.58)], [P.pbSilver, S(0.44, 0.68)], [P.pbBlue, S(0.44, 0.78)], [P.charger, S(0.4, 0.9)]]],
    ['wearables', 1920, 440, 'bedroom', [[P.band, S(0.42, 0.68)], [P.pencil, S(0.56, 0.82)], [P.pencilBlk, S(0.56, 0.86)]]],
  ],
  appliances: [
    ['hero', 1920, 620, 'kitchen', [[P.kettleBlack, S(0.48, 0.6)], [P.kettleGlass, S(0.5, 0.75)], [P.kettleMint, S(0.44, 0.9)]]],
    ['modern', 1920, 440, 'kitchen', [[P.kettleBlack, S(0.6, 0.64)], [P.kettleGlass, S(0.58, 0.78)], [P.kettleGray, S(0.56, 0.91)]]],
    ['classic', 1920, 440, 'kitchenWarm', [[P.kettleMint, S(0.58, 0.7)], [P.kettleSteel, S(0.56, 0.87)]]],
  ],
}

const only = process.argv.slice(2)
for (const [cat, shots] of Object.entries(SETS)) {
  if (only.length && !only.includes(cat)) continue
  const dir = `${A}/banners/${cat}`
  mkdirSync(dir, { recursive: true })
  for (const [name, W, H, scene, items] of shots) {
    await render(`${dir}/${name}-wide.webp`, W, H, scene, items)
    console.log('wrote', cat, name)
  }
}
