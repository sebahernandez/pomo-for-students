import { useAppStore } from '../context/AppContext'
import { themes, darkThemes, type ThemeName } from '../themes'
import { IconPalette } from '@tabler/icons-react'

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
          return (
            <button
              key={themeName}
              onClick={() => setTheme(themeName)}
              className={`relative p-2 rounded-lg border-2 transition-all ${
                theme === themeName
                  ? 'border-neutral-900 dark:border-neutral-100'
                  : 'border-transparent hover:border-neutral-200 dark:hover:border-neutral-700'
              }`}
            >
              <div
                className="h-8 rounded-md mb-1"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                }}
              />
              <span className="text-[10px] font-medium text-neutral-600 dark:text-neutral-400 block text-center">
                {colors.name}
              </span>
              {theme === themeName && (
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-neutral-900 dark:bg-neutral-100" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}