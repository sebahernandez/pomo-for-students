import { IconX, IconBook, IconClock, IconCircleHalf, IconCheck, IconTarget, IconPlayerPlay, IconArrowsMove, IconSettings, IconChartBar } from '@tabler/icons-react'
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
    { icon: <IconArrowsMove size={20} />, title: 'Agrega y organiza tareas', desc: 'Escribe una tarea y presiona Agregar. Arrastra las tarjetas entre columnas para cambiar su estado.' },
    { icon: <IconCircleHalf size={20} />, title: 'Mueve a "En Progreso"', desc: 'Arrastra una tarea a la columna "En Progreso" o usa el botón Iniciar en la tarjeta.' },
    { icon: <IconTarget size={20} />, title: 'Enfócate en una tarea', desc: 'En una tarea "En Progreso", presiona ◎ Enfoque para activarla e iniciar el pomodoro.' },
    { icon: <IconPlayerPlay size={20} />, title: 'Controla el temporizador', desc: 'El botón cambia a Pausar/Iniciar según el estado. Presiona Reiniciar para volver a empezar.' },
    { icon: <IconCheck size={20} />, title: 'Completa tus tareas', desc: 'Arrastra a "Hecho" o usa el botón Hecho. La tarea activa se desactiva automáticamente.' },
    { icon: <IconChartBar size={20} />, title: 'Revisa tu historial', desc: 'Haz clic en el ícono de gráfico para ver todas tus sesiones completadas con estadísticas.' },
    { icon: <IconSettings size={20} />, title: 'Personaliza la app', desc: 'Ajusta las duraciones, cambia el idioma (EN/ES) y alterna entre modo claro y oscuro.' },
  ] : [
    { icon: <IconClock size={20} />, title: 'Choose your mode', desc: 'Select Focus, Short Break, or Long Break depending on what you need.' },
    { icon: <IconArrowsMove size={20} />, title: 'Add and organize tasks', desc: 'Type a task and click Add. Drag cards between columns to change their status.' },
    { icon: <IconCircleHalf size={20} />, title: 'Move to "In Progress"', desc: 'Drag a task to the "In Progress" column or use the Start button on the card.' },
    { icon: <IconTarget size={20} />, title: 'Focus on a task', desc: 'On an "In Progress" task, click ◎ Focus to activate it and start the pomodoro.' },
    { icon: <IconPlayerPlay size={20} />, title: 'Control the timer', desc: 'The button toggles between Pause/Start based on state. Press Reset to start over.' },
    { icon: <IconCheck size={20} />, title: 'Complete your tasks', desc: 'Drag to "Done" or use the Done button. The active task is automatically deactivated.' },
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
              <span>{language === 'es' ? 'Tip: Arrastra tareas entre columnas para organizar tu flujo de trabajo.' : 'Tip: Drag tasks between columns to organize your workflow.'}</span>
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
