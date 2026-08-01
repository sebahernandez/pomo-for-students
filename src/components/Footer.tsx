import { IconHeart } from '@tabler/icons-react'
import { useAppStore } from '../context/AppContext'
import { useThemeColors } from '../hooks/useThemeColors'

const VERSION = '1.0.0'

export function Footer() {
  const themeColors = useThemeColors()
  const darkMode = useAppStore((s) => s.darkMode)

  const textPrimary = darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'
  const textMuted = darkMode ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.4)'

  return (
    <footer
      className="w-full border-t"
      style={{
        background: themeColors.glassBg,
        borderColor: `${themeColors.secondary}33`,
      }}
    >
      <div className="max-w-7xl mx-auto px-2 lg:px-0 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: textPrimary }}>
              pomoforstudy.com, by Kreadium.cl
            </span>
            <span className="text-xs" style={{ color: textMuted }}>© 2026</span>
          </div>

          <div className="flex items-center gap-4">
            <span
              className="text-[0.65rem] px-2 py-0.5 rounded-full font-mono"
              style={{ backgroundColor: `${themeColors.secondary}1a`, color: themeColors.secondary }}
            >
              v{VERSION}
            </span>
            <span className="text-[0.6rem] inline-flex items-center gap-0.5" style={{ color: textMuted }}>
              Made with <IconHeart size={10} style={{ color: themeColors.accent }} />
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
