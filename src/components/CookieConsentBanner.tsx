import { useState, useEffect } from 'react'
import { IconCookie } from '@tabler/icons-react'
import { useAppStore } from '../context/AppContext'

function setCookie(name: string, value: string, days: number = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  return document.cookie.split(';').reduce((r, v) => {
    const parts = v.split('=')
    return parts[0] === name ? decodeURIComponent(parts[1]) : r
  }, null as string | null)
}

const COOKIE_CONSENT_KEY = 'pomo-cookie-consent'

export function CookieConsentBanner() {
  const { language } = useAppStore()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const hasConsented = getCookie(COOKIE_CONSENT_KEY)
    if (!hasConsented) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    setCookie(COOKIE_CONSENT_KEY, 'accepted')
    setIsVisible(false)
  }

  const handleReject = () => {
    setCookie(COOKIE_CONSENT_KEY, 'rejected')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-slide-up">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center flex-shrink-0">
            <IconCookie size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {language === 'es' ? 'Utilizamos cookies' : 'We use cookies'}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {language === 'es'
                ? 'Este sitio usa cookies para mejorar tu experiencia.'
                : 'This site uses cookies to improve your experience.'}
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={handleReject}
            className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            {language === 'es' ? 'Rechazar' : 'Reject'}
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm font-medium text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors"
          >
            {language === 'es' ? 'Aceptar' : 'Accept'}
          </button>
        </div>
      </div>
    </div>
  )
}
