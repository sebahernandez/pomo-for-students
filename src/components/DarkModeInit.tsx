import { useEffect } from 'react'
import { useAppStore } from '../context/AppContext'

// Sincroniza el estado del store con atributos del <html> que viven fuera del
// árbol de React: clase dark, tema activo e idioma del documento.
export function DarkModeInit() {
  const darkMode = useAppStore((s) => s.darkMode)
  const theme = useAppStore((s) => s.theme)
  const language = useAppStore((s) => s.language)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])
  useEffect(() => {
    document.documentElement.lang = language
  }, [language])
  return null
}
