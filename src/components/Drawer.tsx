import { useEffect, type ReactNode } from 'react'
import { IconX } from '@tabler/icons-react'

interface DrawerProps {
  onClose: () => void
  title: string
  icon?: ReactNode
  /** Tailwind max-width class controlling the desktop width (mobile stays near full). */
  maxWidthClass?: string
  children: ReactNode
}

export function Drawer({ onClose, title, icon, maxWidthClass = 'max-w-md', children }: DrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="modal-overlay fixed inset-0 flex justify-end z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`drawer-panel w-full ${maxWidthClass} h-full flex flex-col animate-slide-in-right`}
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
              aria-label="Close"
              className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
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
