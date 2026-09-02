import { useEffect, useRef, type ReactNode } from 'react'
import { IconX } from '@tabler/icons-react'
import { useAppStore } from '../context/AppContext'
import { useTranslations } from '../i18n/translations'

interface DrawerProps {
  onClose: () => void
  title: string
  icon?: ReactNode
  /** Tailwind max-width class controlling the desktop width (mobile stays near full). */
  maxWidthClass?: string
  children: ReactNode
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function Drawer({ onClose, title, icon, maxWidthClass = 'max-w-md', children }: DrawerProps) {
  const language = useAppStore((s) => s.language)
  const t = useTranslations(language)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Trampa de foco del diálogo: al abrir, el foco entra al panel; Tab cicla
  // dentro de él; al cerrar, vuelve al elemento que lo abrió.
  useEffect(() => {
    const previouslyFocused = document.activeElement
    panelRef.current?.focus()

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !panelRef.current) return
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((el) => el.offsetParent !== null)
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement
      if (e.shiftKey) {
        if (active === first || active === panelRef.current) {
          e.preventDefault()
          last.focus()
        }
      } else if (active === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleTab)
    return () => {
      document.removeEventListener('keydown', handleTab)
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [])

  return (
    <div
      className="modal-overlay fixed inset-0 flex justify-end z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={`drawer-panel w-full ${maxWidthClass} h-full flex flex-col animate-slide-in-right focus:outline-none`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 flex flex-col flex-1 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 inline-flex items-center gap-2">
              {icon}
              {title}
            </h2>
            <button
              onClick={onClose}
              aria-label={t.close}
              className="text-theme-muted hover:text-theme-secondary transition-colors"
            >
              <IconX size={20} />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
