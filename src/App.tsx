import { TimerCard } from './components/TimerCard'
import { KanbanBoard } from './components/KanbanBoard'
import { useAppStore } from './context/AppContext'
import { useTranslations } from './i18n/translations'

function App() {
  const { timerMode, setTimerMode, language } = useAppStore()
  const t = useTranslations(language)

  const modes = [
    { key: 'work' as const, label: t.focus },
    { key: 'shortBreak' as const, label: t.shortBreak },
    { key: 'longBreak' as const, label: t.longBreak },
  ]

  return (
    <div className="container mx-auto max-w-7xl py-6 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] space-y-6">
      <div className="flex justify-center gap-2 animate-slide-down w-full">
        {modes.map((mode) => {
          const isActive = timerMode === mode.key
          return (
            <button
              key={mode.key}
              onClick={() => setTimerMode(mode.key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-lg'
                  : 'bg-black/[0.04] dark:bg-white/[0.05] text-neutral-500 dark:text-neutral-400 hover:bg-black/[0.08] dark:hover:bg-white/[0.1] border border-black/[0.06] dark:border-white/[0.08]'
              }`}
            >
              {mode.label}
            </button>
          )
        })}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-stretch w-full">
        <div className="order-2 lg:order-1 lg:flex-1">
          <div className="h-full">
            <KanbanBoard />
          </div>
        </div>
        <div className="order-1 lg:order-2 lg:w-[420px] lg:flex-[0_0_420px]">
          <TimerCard />
        </div>
      </div>
    </div>
  )
}

export default App
