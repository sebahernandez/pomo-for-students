import { IconBrandInstagram, IconBrandTiktok } from '@tabler/icons-react'
import { useAppStore } from '../context/AppContext'
import { useThemeColors } from '../hooks/useThemeColors'

// Only two social profiles are shown in the footer. Update the URLs here if the
// real handles differ.
const SOCIALS = [
  { key: 'instagram', label: 'Instagram', href: 'https://instagram.com/pomoforstudy', Icon: IconBrandInstagram },
  { key: 'tiktok', label: 'TikTok', href: 'https://tiktok.com/@pomoforstudy', Icon: IconBrandTiktok },
]

export function Footer() {
  const themeColors = useThemeColors()
  const darkMode = useAppStore((s) => s.darkMode)

  const textPrimary = darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'

  return (
    <footer
      className="w-full border-t"
      style={{
        background: themeColors.glassBg,
        borderColor: `${themeColors.secondary}33`,
      }}
    >
      <div className="max-w-7xl mx-auto px-2 lg:px-0 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs" style={{ color: textPrimary }}>
            pomoforstudy.com © 2026
          </span>

          <nav className="flex items-center gap-2" aria-label="Redes sociales">
            {SOCIALS.map(({ key, label, href, Icon }) => (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="footer-social"
                style={{ color: themeColors.secondary }}
              >
                <Icon size={18} stroke={1.75} />
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
