import { IconX, IconBook, IconClock, IconCircleHalf, IconCheck, IconTarget, IconPlayerPlay, IconSettings, IconChartBar, IconPlayerPause, IconGripVertical, IconArrowBigRight } from '@tabler/icons-react'
import { useAppStore } from '../context/AppContext'
import { useTranslations } from '../i18n/translations'

interface GuideModalProps {
  onClose: () => void
}

export function GuideModal({ onClose }: GuideModalProps) {
  const { language } = useAppStore()
  const t = useTranslations(language)

  const steps = language === 'es' ? [
    { icon: <IconClock size={20} />, title: 'Elige tu modo', desc: 'Selecciona Enfoque, Descanso Corto o Descanso Largo. El fondo cambia de color según el modo.' },
    { icon: <IconGripVertical size={20} />, title: 'Agrega y organiza tareas', desc: 'Escribe una tarea y presiona Agregar. Arrastra las tarjetas entre columnas para cambiar su estado.' },
    { icon: <IconCircleHalf size={20} />, title: 'Mueve a "En Progreso"', desc: 'Arrastra una tarea a "En Progreso" o usa el botón en la tarjeta.' },
    { icon: <IconTarget size={20} />, title: 'Configura tu tiempo', desc: 'En cada tarea "En Progreso", define los minutos de enfoque personalizados con el botón de reloj.' },
    { icon: <IconArrowBigRight size={20} />, title: 'Selecciona una tarea', desc: 'Haz clic en cualquier tarjeta "En Progreso" para seleccionarla como tarea activa. Se iluminará para identificarla.' },
    { icon: <IconPlayerPlay size={20} />, title: 'Inicia el pomodoro', desc: 'Presiona el botón de enfoque en la tarjeta o en el temporizador. Cada tarea conserva su tiempo al pausar.' },
    { icon: <IconPlayerPause size={20} />, title: 'Pausa y continúa', desc: 'El botón cambia a "Continuar" cuando pausas. Al volver a la tarea, retoma desde donde quedaste.' },
    { icon: <IconCheck size={20} />, title: 'Completa tus tareas', desc: 'Arrastra a "Hecho" o usa el botón. La tarea activa se desactiva y el timer se reinicia.' },
    { icon: <IconChartBar size={20} />, title: 'Revisa tu historial', desc: 'Haz clic en el ícono de gráfico para ver todas tus sesiones completadas con estadísticas.' },
    { icon: <IconSettings size={20} />, title: 'Personaliza la app', desc: 'Ajusta duraciones, cambia idioma (EN/ES) y alterna entre modo claro y oscuro.' },
  ] : [
    { icon: <IconClock size={20} />, title: 'Choose your mode', desc: 'Select Focus, Short Break, or Long Break. The background color changes based on the mode.' },
    { icon: <IconGripVertical size={20} />, title: 'Add and organize tasks', desc: 'Type a task and click Add. Drag cards between columns to change their status.' },
    { icon: <IconCircleHalf size={20} />, title: 'Move to "In Progress"', desc: 'Drag a task to "In Progress" or use the button on the card.' },
    { icon: <IconTarget size={20} />, title: 'Set your time', desc: 'On each "In Progress" task, define custom focus minutes with the clock button.' },
    { icon: <IconArrowBigRight size={20} />, title: 'Select a task', desc: 'Click any "In Progress" card to select it as the active task. It will light up for identification.' },
    { icon: <IconPlayerPlay size={20} />, title: 'Start the pomodoro', desc: 'Press the focus button on the card or timer. Each task preserves its time when paused.' },
    { icon: <IconPlayerPause size={20} />, title: 'Pause and resume', desc: 'The button changes to "Resume" when paused. When returning to the task, it continues from where you left off.' },
    { icon: <IconCheck size={20} />, title: 'Complete your tasks', desc: 'Drag to "Done" or use the button. The active task is deactivated and the timer resets.' },
    { icon: <IconChartBar size={20} />, title: 'Review your history', desc: 'Click the chart icon to see all completed sessions with statistics.' },
    { icon: <IconSettings size={20} />, title: 'Customize the app', desc: 'Adjust durations, switch language (EN/ES), and toggle between light and dark mode.' },
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
              <span>{language === 'es' ? 'Tip: Cada tarea tiene su propio temporizador independiente.' : 'Tip: Each task has its own independent timer.'}</span>
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
