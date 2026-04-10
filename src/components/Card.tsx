import { useState, useEffect } from 'react'
import { IconX, IconFlame, IconTarget, IconCircleDashed, IconCircleCheck, IconPlayerPlay, IconPlayerPause, IconClock } from '@tabler/icons-react'
import { useAppStore, type Task, type TaskStatus } from '../context/AppContext'
import { useTranslations } from '../i18n/translations'
import { useThemeColors } from '../hooks/useThemeColors'

const NEXT_STATUS: Record<TaskStatus, TaskStatus> = {
  todo: 'doing',
  doing: 'done',
  done: 'todo',
}

const STATUS_ICONS: Record<TaskStatus, React.ReactNode> = {
  todo: <IconCircleDashed size={12} />,
  doing: <IconFlame size={12} />,
  done: <IconCircleCheck size={12} />,
}

interface CardProps {
  task: Task
}

export function Card({ task }: CardProps) {
  const activeTaskId = useAppStore((s) => s.activeTaskId)
  const timerStatus = useAppStore((s) => s.timerStatus)
  const switchActiveTask = useAppStore((s) => s.switchActiveTask)
  const startTimer = useAppStore((s) => s.startTimer)
  const pauseTimer = useAppStore((s) => s.pauseTimer)
  const moveTask = useAppStore((s) => s.moveTask)
  const removeTask = useAppStore((s) => s.removeTask)
  const setTaskFocusTime = useAppStore((s) => s.setTaskFocusTime)
  const language = useAppStore((s) => s.language)
  const darkMode = useAppStore((s) => s.darkMode)

  const themeColors = useThemeColors()
  const t = useTranslations(language)
  const isActive = task.id === activeTaskId
  const isRunning = isActive && timerStatus === 'running'
  const textPrimary = darkMode ? 'text-neutral-200' : 'text-neutral-800'
  const textSecondary = darkMode ? 'text-neutral-300' : 'text-neutral-600'
  const textMuted = darkMode ? 'text-neutral-500' : 'text-neutral-400'
  const bgLight = darkMode ? 'bg-white/[0.05]' : 'bg-black/[0.04]'
  const bgLightHover = darkMode ? 'hover:bg-white/[0.1]' : 'hover:bg-black/[0.08]'
  const borderLight = darkMode ? 'border-white/[0.08]' : 'border-black/[0.08]'
  const [showFocusInput, setShowFocusInput] = useState(false)
  const [focusInput, setFocusInput] = useState(task.focusTime?.toString() ?? '')

  useEffect(() => {
    setFocusInput(task.focusTime?.toString() ?? '')
  }, [task.focusTime])

  const handleToggleFocus = () => {
    if (isActive) {
      if (isRunning) {
        pauseTimer()
      } else {
        startTimer()
      }
    } else {
      switchActiveTask(task.id)
      startTimer()
    }
  }

  const handleSaveFocusTime = () => {
    const val = parseInt(focusInput, 10)
    if (val > 0 && val <= 120) {
      setTaskFocusTime(task.id, val)
      if (isActive) {
        useAppStore.setState({ timeLeft: val * 60 })
      }
    }
    setShowFocusInput(false)
  }

  const statusLabels: Record<TaskStatus, string> = {
    todo: t.startAction,
    doing: t.doneAction,
    done: t.resetAction,
  }

  const formatTime = (seconds: number | null) => {
    if (seconds === null || seconds === undefined) return null
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${String(s).padStart(2, '0')}`
  }

  const remainingTime = isActive && task.timeLeft !== null ? formatTime(task.timeLeft) : null

  return (
      <div className={`group rounded-lg transition-all duration-200 cursor-pointer ${
        isActive
          ? 'bg-neutral-900/[0.12] dark:bg-white/[0.14] border-2 border-neutral-900/30 dark:border-white/30 shadow-lg shadow-neutral-900/10 dark:shadow-white/10'
          : 'bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06] hover:bg-black/[0.05] dark:hover:bg-white/[0.05]'
      }`}
      onClick={() => { if (task.status === 'doing') switchActiveTask(task.id); }}>
      <div className="p-2.5">
        {/* Header: icon + title + delete */}
        <div className="flex items-start gap-2">
          <span className={`${isActive ? textSecondary : textMuted} flex-shrink-0 mt-0.5`}>{STATUS_ICONS[task.status]}</span>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${textPrimary} leading-snug break-words`} style={{overflowWrap: 'anywhere'}}>{task.title}</p>
            <div className="flex items-center gap-3 mt-1">
              {task.pomodorosCompleted > 0 && (
                <span className={`inline-flex items-center gap-0.5 text-xs ${textMuted}`}>
                  <IconFlame size={10} /> {task.pomodorosCompleted}
                </span>
              )}
              {isActive && remainingTime && (
                <span className={`inline-flex items-center gap-0.5 text-xs font-mono ${textSecondary}`}>
                  <IconClock size={10} /> {remainingTime}
                </span>
              )}
            </div>
          </div>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => removeTask(task.id)}
            className={`text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ${darkMode ? 'text-neutral-600 hover:text-neutral-400' : 'text-neutral-400 hover:text-neutral-600'}`}
            title="Remove task"
          >
            <IconX size={14} />
          </button>
        </div>

        {/* Actions row */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2 border-t border-black/[0.04] dark:border-white/[0.04]" onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
          {/* Status button */}
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); moveTask(task.id, nextStatus); }}
            className={`text-xs px-2 py-1 rounded-md transition-colors inline-flex items-center gap-1 shrink-0 ${bgLight} ${textMuted} ${bgLightHover}`}
          >
            {STATUS_ICONS[task.status]} {statusLabels[task.status]}
          </button>

          {/* Focus/Play/Pause button */}
          {task.status === 'doing' && (
            <button
              onClick={handleToggleFocus}
              onPointerDown={(e) => e.stopPropagation()}
              className={`text-xs px-2 py-1 rounded-md transition-colors inline-flex items-center gap-1 shrink-0 ${
                isActive
                  ? 'text-white dark:text-neutral-900'
                  : 'bg-black/[0.04] dark:bg-white/[0.05] text-neutral-700 dark:text-neutral-200 hover:bg-black/[0.08] dark:hover:bg-white/[0.1]'
              }`}
              style={isActive ? { backgroundColor: themeColors.primary } : {}}
            >
              {isActive ? (
                isRunning ? (
                  <><IconPlayerPause size={11} /> {t.pause}</>
                ) : (
                  <><IconPlayerPlay size={11} /> {t.resume}</>
                )
              ) : (
                <><IconTarget size={11} /> {t.focusAction}</>
              )}
            </button>
          )}

          {/* Focus time config */}
          {task.status === 'doing' && (
            <div className="w-full mt-1.5" onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
              {showFocusInput ? (
                <div className="flex items-center gap-1 w-full">
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={focusInput}
                    onChange={(e) => setFocusInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSaveFocusTime(); if (e.key === 'Escape') setShowFocusInput(false); }}
                    className={`flex-1 text-xs px-1 py-1.5 rounded-md border ${borderLight} focus:outline-none focus:border-neutral-400 text-center ${textPrimary}`}
                    autoFocus
                    placeholder="min"
                  />
                  <button
                    onClick={handleSaveFocusTime}
                    className="text-xs px-2 py-1.5 rounded-md"
                    style={{ backgroundColor: themeColors.primary, color: themeColors.gradientEnd }}
                  >
                    ✓
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setShowFocusInput(true); setFocusInput(task.focusTime?.toString() ?? ''); }}
                  className={`text-xs px-2 py-1.5 rounded-md transition-colors inline-flex items-center justify-center gap-1 w-full ${bgLight} ${textMuted} ${bgLightHover}`}
                  title="Set focus time"
                >
                  <IconClock size={11} /> {task.focusTime ?? '—'} min
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
