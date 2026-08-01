import { useEffect } from 'react'
import { useAppStore } from '../context/AppContext'

export function DarkModeInit() {
  const darkMode = useAppStore((s) => s.darkMode)
  const theme = useAppStore((s) => s.theme)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])
  return null
}
