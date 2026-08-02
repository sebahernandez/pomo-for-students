import { useEffect, useRef, useState } from 'react'
import { IconPlayerPlay, IconPlayerPause, IconRotate, IconTarget, IconClock } from '@tabler/icons-react'
import { useAppStore } from '../context/AppContext'
import { useTranslations } from '../i18n/translations'
import { playCompletionSound } from '../lib/audio'
import { useThemeColors } from '../hooks/useThemeColors'

export function TimerCard() {
  const {
    timerMode,
    timerStatus,
    timeLeft,
    breakTimeLeft,
    sessionsCompleted,
    activeTaskId,
    tasks,
    pauseTimer,
    resetTimer,
    toggleFocus,
    setTimerMode,
    setTimeLeft,
    setBreakTimeLeft,
    setTaskFocusTime,
    language,
    darkMode,
  } = useAppStore()

  const themeColors = useThemeColors()
  const t = useTranslations(language)
  const textColor = darkMode ? 'white' : 'black'
  const [isEditing, setIsEditing] = useState(false)
  const [editMinutes, setEditMinutes] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)


  // Enfoque y descanso tienen cuentas independientes; se muestra la del modo actual.
  const isBreak = timerMode !== 'work'
  const shownTime = isBreak ? breakTimeLeft : timeLeft
  const minutes = Math.floor(shownTime / 60)
  const seconds = shownTime % 60
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  const modes = [
    { key: 'work' as const, label: t.focus },
    { key: 'break' as const, label: t.break },
  ]

  const activeTask = tasks.find((t) => t.id === activeTaskId)
  // El modo Enfoque queda subordinado a la tarjeta Kanban activa: sin ella no puede correr.
  // Los descansos siguen siendo libres.
  const focusLocked = timerMode === 'work' && !activeTask
  const settings = useAppStore.getState().settings
  // Duración total de la sesión actual según el modo: en descanso, la del descanso;
  // en Enfoque, la de la tarea activa (o la duración de enfoque por defecto).
  const totalSeconds = isBreak
    ? settings[timerMode] * 60
    : activeTask?.focusTime
      ? activeTask.focusTime * 60
      : settings.work * 60
  const progress = timerStatus === 'idle' ? 0 : ((totalSeconds - shownTime) / totalSeconds) * 100

  const circumference = 2 * Math.PI * 120
  const strokeDashoffset = circumference - (progress / 100) * circumference

  const handleTimeClick = () => {
    if (timerStatus !== 'idle') return
    // En Enfoque la edición sigue la duración de la tarea activa; sin ella queda bloqueada.
    if (focusLocked) return
    setIsEditing(true)
    setEditMinutes(String(Math.floor(shownTime / 60)))
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const handleTimeSave = () => {
    const val = parseInt(editMinutes, 10)
    if (val > 0 && val <= 120) {
      // En descanso, editar solo cambia la cuenta del descanso.
      if (isBreak) {
        setBreakTimeLeft(val * 60)
        setIsEditing(false)
        return
      }
      // En Enfoque la duración pertenece a la tarea activa; se persiste en ella.
      if (timerMode === 'work' && activeTask) {
        setTaskFocusTime(activeTask.id, val)
      }
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

    // La cuenta y la detección de fin dependen del modo: Enfoque usa timeLeft
    // (y persiste en la tarea); los descansos usan su cuenta propia sin tocar tareas.
    if (shownTime === 0) {
       playCompletionSound()

      if (timerMode === 'work') {
        useAppStore.getState().incrementSessions()
        setTimerMode('break')
      } else {
        setTimerMode('work')
      }
      return
    }

    const id = setInterval(() => {
      if (timerMode === 'work') {
        useAppStore.setState((state) => ({ timeLeft: state.timeLeft - 1 }))
        useAppStore.getState().saveTaskTime()
      } else {
        useAppStore.setState((state) => ({ breakTimeLeft: state.breakTimeLeft - 1 }))
      }
    }, 1000)

    return () => clearInterval(id)
  }, [timerStatus, shownTime, timerMode, setTimerMode])


  return (
    <div 
      className="glass animate-fade-in"
      style={{ 
        background: themeColors.glassBg,
      }}
    >
      <div className="p-6">
        <div className="flex justify-center gap-2 mb-4" role="tablist">
          {modes.map((mode) => {
            const isActive = timerMode === mode.key
            return (
              <button
                key={mode.key}
                role="tab"
                aria-selected={isActive}
                onClick={() => setTimerMode(mode.key)}
                className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-300"
                style={
                  isActive
                    ? { backgroundColor: themeColors.primary, color: themeColors.gradientEnd }
                    : {
                        backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                        color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                      }
                }
              >
                {mode.label}
              </button>
            )
          })}
        </div>

        <div className="text-center mb-4 h-6 flex items-center justify-center">
          {activeTask && (
            <span className="tag-accent animate-fade-in">
              <IconTarget size={12} /> {activeTask.title}
            </span>
          )}
        </div>

        <div key={timerMode} className="relative w-56 h-56 sm:w-64 sm:h-64 mx-auto mb-6 p-4 animate-mode-switch">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 260 260" style={{overflow: 'visible'}}>
            <circle
              cx="130" cy="130" r="120"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="transition-colors duration-300"
              style={{ opacity: 0.2 }}
            />
            <circle
              cx="130" cy="130" r="120"
              fill="none"
              stroke="url(#themeGradient)"
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
              <linearGradient id="themeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={themeColors.secondary} />
                <stop offset="100%" stopColor={themeColors.accent} />
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
                  className={`w-16 text-3xl font-bold tracking-tight text-center bg-transparent border-b-2 focus:outline-none ${darkMode ? 'border-white/30 focus:border-white text-white placeholder-white/30' : 'border-black/30 focus:border-black text-black placeholder-black/30'}`}
                  placeholder="00"
                />
                <span className={`text-xl ${darkMode ? 'text-white/50' : 'text-black/50'}`}>min</span>
              </div>
            ) : (
              <span
                className={`text-5xl font-bold tracking-tight ${timerStatus === 'idle' && !focusLocked ? 'cursor-pointer transition-colors hover:opacity-80' : ''}`}
                style={{ color: textColor }}
                onClick={handleTimeClick}
              >
                {display}
              </span>
            )}
          </div>
        </div>

        <div className="text-center mb-4">
          <span className={`inline-flex items-center gap-1.5 text-sm ${darkMode ? 'text-white/50' : 'text-black/50'}`}>
            <IconClock size={14} />
            {t.sessionsCompleted(sessionsCompleted)}
          </span>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center justify-center gap-3">
            {timerStatus === 'running' ? (
              <button onClick={pauseTimer} className="btn-warning inline-flex items-center gap-1.5">
                <IconPlayerPause size={16} /> {t.pause}
              </button>
            ) : (
              <button
                onClick={toggleFocus}
                disabled={focusLocked}
                aria-disabled={focusLocked}
                className="btn-success inline-flex items-center gap-1.5"
                style={focusLocked ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
              >
                <IconPlayerPlay size={16} /> {timerStatus === 'paused' ? t.resume : t.start}
              </button>
            )}
            <button onClick={resetTimer} className="btn-danger inline-flex items-center gap-1.5">
              <IconRotate size={16} /> {t.reset}
            </button>
          </div>
          {focusLocked && (
            <span className={`inline-flex items-center gap-1.5 text-xs ${darkMode ? 'text-white/50' : 'text-black/50'}`}>
              <IconTarget size={12} /> {t.selectTaskToStart}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
