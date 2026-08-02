import { useEffect } from 'react'
import { IconCoffee, IconArrowRight } from '@tabler/icons-react'
import { useAppStore } from '../context/AppContext'
import { useTranslations } from '../i18n/translations'

// Aviso que aparece al terminar (mover a Hecho) la tarea activa: ofrece tomar el
// descanso general, continuar con otra tarea (solo cierra) o no hacer nada.
export function FinishTaskPrompt() {
  const finishPromptOpen = useAppStore((s) => s.finishPromptOpen)
  const closeFinishPrompt = useAppStore((s) => s.closeFinishPrompt)
  const takeBreak = useAppStore((s) => s.takeBreak)
  const language = useAppStore((s) => s.language)
  const t = useTranslations(language)

  useEffect(() => {
    if (!finishPromptOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeFinishPrompt()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [finishPromptOpen, closeFinishPrompt])

  if (!finishPromptOpen) return null

  const handleTakeBreak = () => {
    takeBreak()
    closeFinishPrompt()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t.finishPromptTitle}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeFinishPrompt} />
      <div className="relative w-full max-w-sm rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-xl animate-fade-in">
        <h2 className="text-base font-semibold text-theme-secondary text-center">{t.finishPromptTitle}</h2>
        <div className="mt-5 flex flex-col gap-2">
          <button onClick={handleTakeBreak} className="btn-primary inline-flex items-center justify-center gap-2">
            <IconCoffee size={16} /> {t.takeBreak}
          </button>
          <button onClick={closeFinishPrompt} className="btn-secondary inline-flex items-center justify-center gap-2">
            <IconArrowRight size={16} /> {t.continueOtherTask}
          </button>
          <button onClick={closeFinishPrompt} className="btn-secondary inline-flex items-center justify-center">
            {t.doNothing}
          </button>
        </div>
      </div>
    </div>
  )
}
