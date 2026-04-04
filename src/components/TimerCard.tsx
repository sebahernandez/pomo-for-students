import { useEffect, useRef, useState } from 'react'
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
    setTimeLeft,
    language,
  } = useAppStore()

  const t = useTranslations(language)
  const [isEditing, setIsEditing] = useState(false)
  const [editMinutes, setEditMinutes] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleTimeClick = () => {
    if (timerStatus !== 'idle') return
    setIsEditing(true)
    setEditMinutes(String(Math.floor(timeLeft / 60)))
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const handleTimeSave = () => {
    const val = parseInt(editMinutes, 10)
    if (val > 0 && val <= 120) {
      setTimeLeft(val * 60)
    }
    setIsEditing(false)
  }

  const handleTimeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleTimeSave()
    if (e.key === 'Escape') setIsEditing(false)
  }

  useEffect(() => {
    if (timerStatus !== 'running') return

    if (timeLeft === 0) {
      const ctx = new AudioContext()

      const playTone = (freq: number, startTime: number, duration: number, vol: number) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, startTime)
        gain.gain.setValueAtTime(0, startTime)
        gain.gain.linearRampToValueAtTime(vol, startTime + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
        osc.start(startTime)
        osc.stop(startTime + duration)
      }

      const now = ctx.currentTime
      playTone(523.25, now, 0.4, 0.4)
      playTone(659.25, now + 0.15, 0.4, 0.4)
      playTone(783.99, now + 0.3, 0.4, 0.4)
      playTone(1046.5, now + 0.5, 0.6, 0.35)
      playTone(783.99, now + 1.2, 0.4, 0.3)
      playTone(1046.5, now + 1.4, 0.8, 0.35)

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
      useAppStore.getState().saveTaskTime()
    }, 1000)

    return () => clearInterval(id)
  }, [timerStatus, timeLeft, timerMode, setTimerMode])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  const modeLabel = timerMode === 'work' ? t.focusTime : timerMode === 'shortBreak' ? t.shortBreakLabel : t.longBreakLabel

  const activeTask = tasks.find((t) => t.id === activeTaskId)
  const settings = useAppStore.getState().settings
  const totalSeconds = activeTask?.focusTime
    ? activeTask.focusTime * 60
    : settings[timerMode] * 60
  const progress = timerStatus === 'idle' ? 0 : ((totalSeconds - timeLeft) / totalSeconds) * 100

  const circumference = 2 * Math.PI * 120
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="glass animate-fade-in">
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

        <div className="relative w-80 h-80 sm:w-96 sm:h-96 mx-auto mb-8 p-6">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 260 260" style={{overflow: 'visible'}}>
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
              filter="url(#neonGlow)"
              className="transition-all duration-1000 ease-linear"
            />
            <defs>
              <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur1" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur2" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur3" />
                <feMerge>
                  <feMergeNode in="blur3" />
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#4ade80" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {isEditing ? (
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <input
                  ref={inputRef}
                  type="number"
                  min={1}
                  max={120}
                  value={editMinutes}
                  onChange={(e) => setEditMinutes(e.target.value)}
                  onKeyDown={handleTimeKeyDown}
                  onBlur={handleTimeSave}
                  className="w-20 text-4xl font-bold tracking-tight text-center bg-transparent text-neutral-900 dark:text-neutral-100 border-b-2 border-neutral-900 dark:border-neutral-100 focus:outline-none focus:border-green-500 dark:focus:border-green-400"
                />
                <span className="text-xl text-neutral-400 dark:text-neutral-500">min</span>
              </div>
            ) : (
              <span
                className={`text-6xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 ${timerStatus === 'idle' ? 'cursor-pointer hover:text-green-600 dark:hover:text-green-400 transition-colors' : ''}`}
                onClick={handleTimeClick}
              >
                {display}
              </span>
            )}
          </div>
        </div>

        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 text-sm text-neutral-400 dark:text-neutral-500">
            <IconClock size={14} />
            {t.sessionsCompleted(sessionsCompleted)}
          </span>
        </div>

        <div className="flex items-center justify-center gap-3">
          {timerStatus === 'idle' && (
            <button onClick={startTimer} className="btn-success inline-flex items-center gap-1.5">
              <IconPlayerPlay size={16} /> {t.start}
            </button>
          )}
          {timerStatus === 'running' && (
            <button onClick={pauseTimer} className="btn-warning inline-flex items-center gap-1.5">
              <IconPlayerPause size={16} /> {t.pause}
            </button>
          )}
          {timerStatus === 'paused' && (
            <button onClick={startTimer} className="btn-success inline-flex items-center gap-1.5">
              <IconPlayerPlay size={16} /> {t.resume}
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
