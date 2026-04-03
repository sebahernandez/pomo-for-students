import { useState } from 'react'
import { IconMoon, IconSun, IconChartBar, IconSettings, IconLanguage, IconBook } from '@tabler/icons-react'
import { useAppStore } from '../context/AppContext'
import { SettingsPanel } from './SettingsPanel'
import { SessionHistory } from './SessionHistory'
import { GuideModal } from './GuideModal'
import { Logo } from './Logo'

export function Header() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [guideOpen, setGuideOpen] = useState(false)
  const { darkMode, toggleDarkMode, language, setLanguage } = useAppStore()

  const toggleLang = () => {
    setLanguage(language === 'en' ? 'es' : 'en')
  }

  return (
    <>
      <header className="w-full py-4 px-8 animate-slide-down">
        <div className="container mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setGuideOpen(true)}
              className="btn-secondary"
              title={language === 'es' ? 'Guía de Uso' : 'User Guide'}
            >
              <IconBook size={18} />
            </button>
            <button
              onClick={toggleLang}
              className="btn-secondary"
              title="Change Language"
            >
              <IconLanguage size={18} />
              <span className="ml-1 text-xs font-mono">{language.toUpperCase()}</span>
            </button>
            <button
              onClick={toggleDarkMode}
              className="btn-secondary"
              title={darkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {darkMode ? <IconSun size={18} /> : <IconMoon size={18} />}
            </button>
            <button
              onClick={() => setHistoryOpen(true)}
              className="btn-secondary"
              title="Session History"
            >
              <IconChartBar size={18} />
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className="btn-secondary"
              title="Settings"
            >
              <IconSettings size={18} />
            </button>
          </div>
        </div>
      </header>
      {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
      {historyOpen && <SessionHistory onClose={() => setHistoryOpen(false)} />}
      {guideOpen && <GuideModal onClose={() => setGuideOpen(false)} />}
    </>
  )
}
