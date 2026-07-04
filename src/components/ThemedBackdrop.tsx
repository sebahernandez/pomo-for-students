import { useAppStore } from '../context/AppContext'

/**
 * Decorative SVG scene layered BEHIND all content (fixed, z-index -1, pointer-events none).
 * Each theme renders a subtle motif related to its name:
 *   neutral → soft floating orbs   ocean → waves        forest → pine trees
 *   sunset  → sun over the sea      rose  → blooms       midnight → moon & stars
 * It sits on top of the gradient (body::before) but never touches the timer,
 * buttons or kanban board, which live in a higher layer.
 *
 * Colors are mode-aware: deeper/saturated tones in light mode (so they read against
 * the pale pastel gradients) and lighter tones in dark mode.
 */

type Palette = { main: string; alt: string }

const PALETTES: Record<string, { light: Palette; dark: Palette }> = {
  neutral: { light: { main: '#64748b', alt: '#64748b' }, dark: { main: '#94a3b8', alt: '#94a3b8' } },
  ocean: { light: { main: '#0284c7', alt: '#0284c7' }, dark: { main: '#38bdf8', alt: '#38bdf8' } },
  forest: { light: { main: '#15803d', alt: '#15803d' }, dark: { main: '#22c55e', alt: '#22c55e' } },
  sunset: { light: { main: '#ea580c', alt: '#e11d48' }, dark: { main: '#fbbf24', alt: '#fb7185' } },
  rose: { light: { main: '#e11d48', alt: '#e11d48' }, dark: { main: '#fb7185', alt: '#fb7185' } },
  midnight: { light: { main: '#4f46e5', alt: '#4f46e5' }, dark: { main: '#c7d2fe', alt: '#c7d2fe' } },
}

export function ThemedBackdrop() {
  const theme = useAppStore((s) => s.theme)
  const darkMode = useAppStore((s) => s.darkMode)

  const palette = (PALETTES[theme] ?? PALETTES.neutral)[darkMode ? 'dark' : 'light']

  // Kept deliberately faint so the motif reads as texture, not decoration.
  const opacity = darkMode ? 0.22 : 0.18

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-[1] overflow-hidden">
      <svg
        className="h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMax slice"
        style={{ opacity }}
      >
        <Scene theme={theme} palette={palette} />
      </svg>
    </div>
  )
}

function Scene({ theme, palette }: { theme: string; palette: Palette }) {
  switch (theme) {
    case 'ocean':
      return <Ocean color={palette.main} />
    case 'forest':
      return <Forest color={palette.main} />
    case 'sunset':
      return <Sunset sun={palette.main} sea={palette.alt} />
    case 'rose':
      return <Rose color={palette.main} />
    case 'midnight':
      return <Midnight color={palette.main} />
    default:
      return <Neutral color={palette.main} />
  }
}

/* ---------- Ocean: layered waves ---------- */
function Ocean({ color }: { color: string }) {
  return (
    <g fill={color}>
      <path d="M0 640 Q 240 590 480 640 T 960 640 T 1440 640 V900 H0 Z" opacity="0.35" />
      <path d="M0 720 Q 240 670 480 720 T 960 720 T 1440 720 V900 H0 Z" opacity="0.5" />
      <path d="M0 800 Q 240 750 480 800 T 960 800 T 1440 800 V900 H0 Z" opacity="0.7" />
      <circle cx="1180" cy="230" r="70" fill="none" stroke={color} strokeWidth="6" opacity="0.4" />
    </g>
  )
}

/* ---------- Forest: rolling hill + pine trees ---------- */
function Forest({ color }: { color: string }) {
  const tree = (x: number, s: number, key: number) => (
    <g key={key} transform={`translate(${x} 760) scale(${s})`} fill={color}>
      <polygon points="0,-150 48,-50 -48,-50" />
      <polygon points="0,-105 58,25 -58,25" />
      <polygon points="0,-55 68,85 -68,85" />
      <rect x="-11" y="85" width="22" height="45" opacity="0.9" />
    </g>
  )
  return (
    <g>
      <path d="M0 760 Q 360 700 720 745 T 1440 735 V900 H0 Z" fill={color} opacity="0.35" />
      <g opacity="0.55">
        {tree(150, 1.05, 1)}
        {tree(430, 0.75, 2)}
        {tree(700, 1.15, 3)}
        {tree(980, 0.7, 4)}
        {tree(1250, 1.0, 5)}
      </g>
    </g>
  )
}

/* ---------- Sunset: sun setting over the sea ---------- */
function Sunset({ sun, sea }: { sun: string; sea: string }) {
  return (
    <g>
      {/* sun */}
      <circle cx="720" cy="470" r="150" fill={sun} opacity="0.6" />
      <circle cx="720" cy="470" r="210" fill="none" stroke={sun} strokeWidth="4" opacity="0.25" />
      {/* horizon sea */}
      <rect x="0" y="560" width="1440" height="340" fill={sea} opacity="0.28" />
      {/* sun reflection stripes */}
      <g fill={sun} opacity="0.4">
        <rect x="660" y="600" width="120" height="10" rx="5" />
        <rect x="640" y="640" width="160" height="10" rx="5" />
        <rect x="610" y="685" width="220" height="12" rx="6" />
        <rect x="580" y="735" width="280" height="12" rx="6" />
      </g>
      {/* gentle waves */}
      <path d="M0 800 Q 240 775 480 800 T 960 800 T 1440 800 V900 H0 Z" fill={sea} opacity="0.45" />
    </g>
  )
}

/* ---------- Rose: blooms rising from the bottom ---------- */
function Rose({ color }: { color: string }) {
  const bloom = (x: number, y: number, s: number, key: number) => (
    <g key={key} transform={`translate(${x} ${y}) scale(${s})`} fill={color}>
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <ellipse
          key={a}
          cx="0"
          cy="-16"
          rx="12"
          ry="20"
          opacity="0.5"
          transform={`rotate(${a})`}
        />
      ))}
      <circle cx="0" cy="0" r="9" opacity="0.85" />
    </g>
  )
  return (
    <g>
      {/* stems */}
      <g stroke={color} strokeWidth="4" fill="none" opacity="0.35">
        <path d="M220 900 C 220 780 250 720 250 640" />
        <path d="M690 900 C 690 800 660 740 660 660" />
        <path d="M1180 900 C 1180 790 1210 730 1210 620" />
      </g>
      {bloom(250, 640, 1.15, 1)}
      {bloom(660, 660, 0.85, 2)}
      {bloom(1210, 620, 1.25, 3)}
      {/* drifting petals */}
      <g fill={color} opacity="0.4">
        <ellipse cx="430" cy="260" rx="13" ry="22" transform="rotate(25 430 260)" />
        <ellipse cx="940" cy="200" rx="11" ry="19" transform="rotate(-20 940 200)" />
        <ellipse cx="520" cy="440" rx="10" ry="17" transform="rotate(40 520 440)" />
      </g>
    </g>
  )
}

/* ---------- Midnight: crescent moon + stars ---------- */
function Midnight({ color }: { color: string }) {
  const star = (x: number, y: number, r: number, key: number) => (
    <path
      key={key}
      transform={`translate(${x} ${y}) scale(${r})`}
      d="M0 -10 L2.5 -2.5 L10 0 L2.5 2.5 L0 10 L-2.5 2.5 L-10 0 L-2.5 -2.5 Z"
      fill={color}
      opacity="0.7"
    />
  )
  return (
    <g>
      {/* crescent moon — cut with a mask so the bite reveals the gradient, not a fixed color */}
      <defs>
        <mask id="crescent-mask">
          <circle cx="1150" cy="220" r="92" fill="white" />
          <circle cx="1186" cy="200" r="82" fill="black" />
        </mask>
      </defs>
      <circle cx="1150" cy="220" r="92" fill={color} opacity="0.6" mask="url(#crescent-mask)" />
      {/* stars */}
      {star(220, 180, 1.2, 1)}
      {star(430, 320, 0.8, 2)}
      {star(360, 120, 0.6, 3)}
      {star(640, 240, 1, 4)}
      {star(820, 150, 0.7, 5)}
      {star(560, 430, 0.9, 6)}
      {star(940, 380, 0.6, 7)}
      {star(1220, 470, 1.1, 8)}
      {/* dust */}
      <g fill={color} opacity="0.5">
        <circle cx="300" cy="260" r="2.5" />
        <circle cx="700" cy="360" r="2.5" />
        <circle cx="1000" cy="220" r="2.5" />
        <circle cx="500" cy="180" r="2.5" />
      </g>
    </g>
  )
}

/* ---------- Neutral: soft floating orbs ---------- */
function Neutral({ color }: { color: string }) {
  return (
    <g fill={color}>
      <circle cx="240" cy="220" r="120" opacity="0.18" />
      <circle cx="1180" cy="300" r="170" opacity="0.14" />
      <circle cx="900" cy="120" r="70" opacity="0.2" />
      <circle cx="560" cy="520" r="220" opacity="0.1" />
      <circle cx="1280" cy="720" r="140" opacity="0.16" />
      <circle cx="120" cy="700" r="90" opacity="0.18" />
    </g>
  )
}
