import { useState } from 'react'
import { IconMoon, IconSun, IconChartBar, IconSettings, IconLanguage, IconBook, IconMenu2 } from '@tabler/icons-react'
import { useAppStore } from '../context/AppContext'
import { useTranslations } from '../i18n/translations'
import { SettingsPanel } from './SettingsPanel'
import { SessionHistory } from './SessionHistory'
import { GuideModal } from './GuideModal'
import { ToolsMenu, type ToolItem } from './ToolsMenu'
import { Logo } from './Logo'

export function Header() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [guideOpen, setGuideOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const darkMode = useAppStore((s) => s.darkMode)
  const toggleDarkMode = useAppStore((s) => s.toggleDarkMode)
  const language = useAppStore((s) => s.language)
  const setLanguage = useAppStore((s) => s.setLanguage)
  const t = useTranslations(language)

  const toggleLang = () => {
    setLanguage(language === 'en' ? 'es' : 'en')
  }

  // Single source of truth for the tools shown both in the desktop bar and the
  // tablet/mobile tools menu. onOpen only opens the panel; the menu closes itself.
  const tools: ToolItem[] = [
    { key: 'guide', icon: <IconBook size={18} />, label: t.guide, onOpen: () => setGuideOpen(true) },
    { key: 'history', icon: <IconChartBar size={18} />, label: t.sessionHistory, onOpen: () => setHistoryOpen(true) },
    { key: 'settings', icon: <IconSettings size={18} />, label: t.settings, onOpen: () => setSettingsOpen(true) },
  ]

  // Always-visible controls, rendered in both the desktop and compact bars.
  const languageButton = (
    <button onClick={toggleLang} className="btn-secondary" title={t.language} aria-label={t.language}>
      <IconLanguage size={18} />
      <span className="ml-1 text-xs font-mono">{language === 'en' ? 'ES' : 'EN'}</span>
    </button>
  )

  const darkModeButton = (
    <button
      onClick={toggleDarkMode}
      className="btn-secondary"
      title={darkMode ? t.lightMode : t.darkMode}
      aria-label={darkMode ? t.lightMode : t.darkMode}
    >
      {darkMode ? <IconSun size={18} /> : <IconMoon size={18} />}
    </button>
  )

  return (
    <>
      <header className="w-full py-4 animate-slide-down">
        <div className="max-w-7xl mx-auto px-2 lg:px-0 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Logo />
          </div>

          {/* Desktop: full toolbar */}
          <div className="hidden lg:flex gap-2">
            {tools.map((tool) => (
              <button
                key={tool.key}
                onClick={tool.onOpen}
                className="btn-secondary"
                title={tool.label}
                aria-label={tool.label}
              >
                {tool.icon}
              </button>
            ))}
            {languageButton}
            {darkModeButton}
          </div>

          {/* Tablet & mobile: only language + dark/light, tools go in a menu */}
          <div className="flex lg:hidden gap-2 flex-shrink-0">
            {languageButton}
            {darkModeButton}
            <button
              onClick={() => setMenuOpen(true)}
              className="btn-secondary"
              title={t.menu}
              aria-label={t.menu}
            >
              <IconMenu2 size={18} />
            </button>
          </div>
        </div>
      </header>
      {menuOpen && <ToolsMenu items={tools} onClose={() => setMenuOpen(false)} />}
      {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
      {historyOpen && <SessionHistory onClose={() => setHistoryOpen(false)} />}
      {guideOpen && <GuideModal onClose={() => setGuideOpen(false)} />}
    </>
  )
}
