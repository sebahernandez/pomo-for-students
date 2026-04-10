import { useAppStore } from '../context/AppContext'
import { themes, darkThemes } from '../themes'
import type { ThemeColors } from '../themes'

export function useThemeColors(): ThemeColors {
  const theme = useAppStore((s) => s.theme)
  const darkMode = useAppStore((s) => s.darkMode)
  return darkMode ? darkThemes[theme] : themes[theme]
}