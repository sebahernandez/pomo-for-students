import { IconX, IconBook, IconClock, IconCircleHalf, IconCheck, IconTarget, IconPlayerPlay, IconRotate } from '@tabler/icons-react'
import { useAppStore } from '../context/AppContext'
import { useTranslations } from '../i18n/translations'

interface GuideModalProps {
  onClose: () => void
}

export function GuideModal({ onClose }: GuideModalProps) {
  const { language } = useAppStore()
  const t = useTranslations(language)

  const steps = language === 'es' ? [
    { icon: <IconClock size={20} />, title: 'Elige tu modo', desc: 'Selecciona Enfoque, Descanso Corto o Descanso Largo según lo que necesites.' },
    { icon: <IconTarget size={20} />, title: 'Selecciona una tarea', desc: 'En el tablero de tareas, haz clic en ◎ Focus en la tarea que quieres trabajar.' },
    { icon: <IconPlayerPlay size={20} />, title: 'Inicia el temporizador', desc: 'Presiona Iniciar y concéntrate. Cuando termine, escucharás un sonido.' },
    { icon: <IconCircleHalf size={20} />, title: 'Toma un descanso', desc: 'Al completar un pomodoro, el temporizador cambia automáticamente a descanso corto.' },
    { icon: <IconRotate size={20} />, title: 'Reinicia si es necesario', desc: 'Puedes reiniciar el temporizador en cualquier momento con el botón Reiniciar.' },
    { icon: <IconCheck size={20} />, title: 'Mueve tus tareas', desc: 'Avanza tus tareas por las columnas: Por Hacer → En Progreso → Hecho.' },
  ] : [
    { icon: <IconClock size={20} />, title: 'Choose your mode', desc: 'Select Focus, Short Break, or Long Break depending on what you need.' },
    { icon: <IconTarget size={20} />, title: 'Select a task', desc: 'On the task board, click ◎ Focus on the task you want to work on.' },
    { icon: <IconPlayerPlay size={20} />, title: 'Start the timer', desc: 'Press Start and focus. When it ends, you\'ll hear a chime sound.' },
    { icon: <IconCircleHalf size={20} />, title: 'Take a break', desc: 'After completing a pomodoro, the timer automatically switches to a short break.' },
    { icon: <IconRotate size={20} />, title: 'Reset if needed', desc: 'You can reset the timer at any time with the Reset button.' },
    { icon: <IconCheck size={20} />, title: 'Move your tasks', desc: 'Progress your tasks through columns: To Do → In Progress → Done.' },
  ]

  return (
    <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div className="modal-glass w-full max-w-lg animate-slide-down max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 flex flex-col flex-1 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 inline-flex items-center gap-2">
              <IconBook size={20} className="text-neutral-500 dark:text-neutral-400" />
              {language === 'es' ? 'Guía de Uso' : 'User Guide'}
            </h2>
            <button onClick={onClose} className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
              <IconX size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-4">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center">
                  {step.icon}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{step.title}</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between text-xs text-neutral-400 dark:text-neutral-500">
              <span>{language === 'es' ? 'Tip: Presiona Iniciar y concéntrate en una tarea a la vez.' : 'Tip: Press Start and focus on one task at a time.'}</span>
              <button onClick={onClose} className="btn-primary">
                {t.close}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
