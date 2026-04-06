import { useState, useEffect } from 'react'
import { IconX, IconChevronRight, IconChevronLeft, IconPlayerPlay, IconTarget, IconCheck, IconMoon, IconSun, IconClock, IconGripVertical } from '@tabler/icons-react'
import { useAppStore } from '../context/AppContext'

const ONBOARDED_KEY = 'pomo-onboarded'

const wizardContent = {
  es: [
    {
      title: 'Bienvenido a Pomodoro For Students',
      subtitle: 'Organiza tu estudio, un pomodoro a la vez',
      icon: <IconPlayerPlay size={48} />,
      description: 'Una herramienta simple y elegante para gestionar tu tiempo de estudio con la técnica Pomodoro y un tablero de tareas integrado.',
    },
    {
      title: 'El temporizador',
      subtitle: 'Controla tu tiempo de enfoque',
      icon: <IconClock size={48} />,
      description: 'Selecciona entre Enfoque, Descanso Corto o Descanso Largo. Haz clic en los números del timer para personalizar la duración. El fondo cambia de color según el modo.',
    },
    {
      title: 'Gestiona tus tareas',
      subtitle: 'Organiza con el tablero Kanban',
      icon: <IconGripVertical size={48} />,
      description: 'Agrega tareas y arrástralas entre columnas: Por Hacer → En Progreso → Hecho. Cada tarea tiene su propio temporizador independiente.',
    },
    {
      title: 'Enfócate en una tarea',
      subtitle: 'Selecciona y comienza',
      icon: <IconTarget size={48} />,
      description: 'Haz clic en cualquier tarjeta "En Progreso" para seleccionarla. Configura sus minutos personalizados y presiona Iniciar. Al pausar, el tiempo se guarda automáticamente.',
    },
    {
      title: '¡Todo listo!',
      subtitle: '¿Listo para empezar?',
      icon: <IconCheck size={48} />,
      description: 'Puedes ajustar la duración, el idioma y el modo oscuro en cualquier momento desde la configuración en la barra superior.',
    },
  ],
  en: [
    {
      title: 'Welcome to Pomodoro For Students',
      subtitle: 'Organize your study, one pomodoro at a time',
      icon: <IconPlayerPlay size={48} />,
      description: 'A simple and elegant tool to manage your study time with the Pomodoro technique and an integrated task board.',
    },
    {
      title: 'The Timer',
      subtitle: 'Control your focus time',
      icon: <IconClock size={48} />,
      description: 'Choose between Focus, Short Break, or Long Break. Click the timer numbers to customize the duration. The background color changes based on the mode.',
    },
    {
      title: 'Manage Your Tasks',
      subtitle: 'Organize with the Kanban board',
      icon: <IconGripVertical size={48} />,
      description: 'Add tasks and drag them between columns: To Do → In Progress → Done. Each task has its own independent timer.',
    },
    {
      title: 'Focus on a Task',
      subtitle: 'Select and start',
      icon: <IconTarget size={48} />,
      description: 'Click any "In Progress" card to select it. Set custom minutes and press Start. When paused, time is saved automatically.',
    },
    {
      title: 'All Set!',
      subtitle: 'Ready to get started?',
      icon: <IconCheck size={48} />,
      description: 'You can adjust duration, language, and dark mode anytime from the settings in the top bar.',
    },
  ],
}

export function OnboardingWizard() {
  const { language, darkMode, toggleDarkMode, setLanguage } = useAppStore()
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const hasSeen = localStorage.getItem(ONBOARDED_KEY)
    if (!hasSeen) {
      setIsOpen(true)
    }
  }, [])

  const handleClose = () => {
    localStorage.setItem(ONBOARDED_KEY, 'true')
    setIsOpen(false)
  }

  const content = wizardContent[language]
  const current = content[step]
  const isLast = step === content.length - 1

  return isOpen ? (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-md animate-slide-down overflow-hidden">
        {/* Close button */}
        <div className="flex justify-end p-4 pb-0">
          <button
            onClick={handleClose}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
          >
            <IconX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 pb-8">
          <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <div className="w-20 h-20 rounded-2xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center mb-6">
              {current.icon}
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
              {current.title}
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
              {current.subtitle}
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {current.description}
            </p>
          </div>

          {/* Quick settings on last step */}
          {isLast && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800">
                <div className="flex items-center gap-2">
                  {darkMode ? <IconMoon size={16} /> : <IconSun size={16} />}
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">
                    {language === 'es' ? 'Modo oscuro' : 'Dark mode'}
                  </span>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`w-11 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-neutral-900 dark:bg-neutral-100' : 'bg-neutral-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white dark:bg-neutral-900 absolute top-1 transition-all ${darkMode ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-neutral-700 dark:text-neutral-300">
                    {language.toUpperCase()}
                  </span>
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">
                    {language === 'es' ? 'Idioma' : 'Language'}
                  </span>
                </div>
                <button
                  onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
                  className="text-xs px-3 py-1.5 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-medium"
                >
                  {language === 'es' ? 'Switch to EN' : 'Cambiar a ES'}
                </button>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400 disabled:opacity-30 disabled:cursor-not-allowed hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
            >
              <IconChevronLeft size={16} />
              {language === 'es' ? 'Anterior' : 'Back'}
            </button>

            {/* Dots */}
            <div className="flex gap-1.5">
              {content.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === step
                      ? 'bg-neutral-900 dark:bg-neutral-100 w-6'
                      : 'bg-neutral-300 dark:bg-neutral-600'
                  }`}
                />
              ))}
            </div>

            {isLast ? (
              <button
                onClick={handleClose}
                className="flex items-center gap-1 text-sm font-medium text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 px-4 py-2 rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors"
              >
                {language === 'es' ? 'Comenzar' : 'Start'}
                <IconCheck size={16} />
              </button>
            ) : (
              <button
                onClick={() => setStep((s) => Math.min(content.length - 1, s + 1))}
                className="flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
              >
                {language === 'es' ? 'Siguiente' : 'Next'}
                <IconChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : null
}
