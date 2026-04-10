import { useAppStore } from '../context/AppContext'
import { themes, darkThemes, type ThemeName } from '../themes'
import { IconPalette, IconCheck } from '@tabler/icons-react'

export function ThemeSelector() {
  const { theme, setTheme, darkMode, language } = useAppStore()

  const currentThemes = darkMode ? darkThemes : themes

  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider inline-flex items-center gap-1.5">
        <IconPalette size={12} /> {language === 'es' ? 'Tema' : 'Theme'}
      </label>
      <div className="grid grid-cols-3 gap-2">
        {(Object.keys(themes) as ThemeName[]).map((themeName) => {
          const colors = currentThemes[themeName]
          const isSelected = theme === themeName
          return (
            <button
              key={themeName}
              onClick={() => setTheme(themeName)}
              className={`relative p-2.5 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-[var(--theme-primary)] shadow-lg'
                  : 'border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 hover:scale-[1.02]'
              }`}
              style={{
                background: `linear-gradient(135deg, ${colors.gradientStart} 0%, ${colors.gradientMid} 100%)`,
              }}
            >
              <div className="flex items-center justify-center gap-1">
                <div
                  className="w-6 h-6 rounded-md"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                  }}
                />
                <div
                  className="w-6 h-6 rounded-md"
                  style={{
                    background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent} 100%)`,
                  }}
                />
              </div>
              <span className="text-[9px] font-medium mt-1 block text-center" style={{ color: colors.primary }}>
                {colors.name}
              </span>
              {isSelected && (
                <div 
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: colors.primary, color: colors.gradientStart }}
                >
                  <IconCheck size={10} />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}