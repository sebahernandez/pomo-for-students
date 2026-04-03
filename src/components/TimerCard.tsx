import { useEffect } from 'react'
import { IconPlayerPlay, IconPlayerPause, IconRotate, IconTarget, IconClock } from '@tabler/icons-react'
import { useAppStore } from '../context/AppContext'
import { useTranslations } from '../i18n/translations'

export function TimerCard() {
  const {
    timerMode,
    timerStatus,
    timeLeft,
    sessionsCompleted,
    activeTaskId,
    tasks,
    startTimer,
    pauseTimer,
    resetTimer,
    setTimerMode,
    language,
  } = useAppStore()

  const t = useTranslations(language)

  useEffect(() => {
    if (timerStatus !== 'running') return

    if (timeLeft === 0) {
      const ctx = new AudioContext()
      const playBeep = (delay: number) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.value = 800
        osc.type = 'sine'
        gain.gain.setValueAtTime(0.3, ctx.currentTime + delay)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.5)
        osc.start(ctx.currentTime + delay)
        osc.stop(ctx.currentTime + delay + 0.5)
      }
      playBeep(0)
      playBeep(0.3)
      playBeep(0.6)

      if (timerMode === 'work') {
        useAppStore.getState().incrementSessions()
        setTimerMode('shortBreak')
      } else {
        setTimerMode('work')
      }
      return
    }

    const id = setInterval(() => {
      useAppStore.setState((state) => ({ timeLeft: state.timeLeft - 1 }))
    }, 1000)

    return () => clearInterval(id)
  }, [timerStatus, timeLeft, timerMode, setTimerMode])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  const modeLabel = timerMode === 'work' ? t.focusTime : timerMode === 'shortBreak' ? t.shortBreakLabel : t.longBreakLabel

  const activeTask = tasks.find((t) => t.id === activeTaskId)
  const settings = useAppStore.getState().settings
  const totalSeconds = settings[timerMode] * 60
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100

  const circumference = 2 * Math.PI * 120
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="glass glow animate-fade-in">
      <div className="p-8">
        <div className="text-center mb-6">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900">
            {modeLabel}
          </span>
        </div>

        <div className="text-center mb-4 h-6 flex items-center justify-center">
          {activeTask && (
            <span className="tag-accent animate-fade-in">
              <IconTarget size={12} /> {activeTask.title}
            </span>
          )}
        </div>

        <div className="relative w-72 h-72 mx-auto mb-8">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 260 260">
            <circle
              cx="130" cy="130" r="120"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-neutral-200 dark:text-neutral-800"
            />
            <circle
              cx="130" cy="130" r="120"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-linear"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#111827" />
                <stop offset="100%" stopColor="#4b5563" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              {display}
            </span>
          </div>
        </div>

        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 text-sm text-neutral-400 dark:text-neutral-500">
            <IconClock size={14} />
            {t.sessionsCompleted(sessionsCompleted)}
          </span>
        </div>

        <div className="flex items-center justify-center gap-3">
          {timerStatus !== 'running' && (
            <button onClick={startTimer} className="btn-success inline-flex items-center gap-1.5">
              <IconPlayerPlay size={16} /> {t.start}
            </button>
          )}
          {timerStatus === 'running' && (
            <button onClick={pauseTimer} className="btn-warning inline-flex items-center gap-1.5">
              <IconPlayerPause size={16} /> {t.pause}
            </button>
          )}
          <button onClick={resetTimer} className="btn-danger inline-flex items-center gap-1.5">
            <IconRotate size={16} /> {t.reset}
          </button>
        </div>
      </div>
    </div>
  )
}
