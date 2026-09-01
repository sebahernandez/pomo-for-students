import { useEffect, useState } from 'react'
import { useAppStore } from '../context/AppContext'
import { grainientThemes } from '../themes/grainient'
import Grainient from './Grainient'

/**
 * Full-screen animated Grainient background wired to the current theme + dark mode.
 * Sits behind all content (fixed, z-index -2) and is opaque, so it covers the CSS
 * `--bg-gradient` painted by `body::before` — that gradient stays as a graceful fallback
 * for browsers without WebGL, and while the canvas mounts.
 *
 * Respects `prefers-reduced-motion`: when the user requests reduced motion we skip the
 * animated canvas entirely and leave the static CSS gradient visible.
 */
export function GrainientBackground() {
  const theme = useAppStore((s) => s.theme)
  const darkMode = useAppStore((s) => s.darkMode)

  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  if (reducedMotion) return null

  const config = (grainientThemes[theme] ?? grainientThemes.neutral)[darkMode ? 'dark' : 'light']

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0" style={{ zIndex: -2 }}>
      {/* Prop changes sync straight to shader uniforms — the WebGL context is never rebuilt. */}
      <Grainient {...config} />
    </div>
  )
}
