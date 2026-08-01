import { useState } from 'react'
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

// Mezcla un color de acento del tema sobre una base opaca del modo (blanco/oscuro)
// a baja proporción → superficie sólida, teñida por el tema y con contraste determinista.
const tint = (hex: string, base: [number, number, number], ratio: number): string => {
  const n = hex.replace('#', '')
  const c = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16))
  const mix = (fg: number, bg: number) => Math.round(fg * ratio + bg * (1 - ratio))
  return `rgb(${mix(c[0], base[0])}, ${mix(c[1], base[1])}, ${mix(c[2], base[2])})`
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
  const nextStatus = NEXT_STATUS[task.status]

  // Superficie sólida teñida por el tema; el texto se ata al modo para garantizar contraste.
  const modeBase: [number, number, number] = darkMode ? [28, 28, 30] : [255, 255, 255]
  const cardSurface = isActive
    ? tint(themeColors.primary, modeBase, darkMode ? 0.16 : 0.1)
    : tint(themeColors.secondary, modeBase, darkMode ? 0.07 : 0.05)
  const cardBorder = isActive ? themeColors.primary : `${themeColors.secondary}40`
  const cardShadow = isActive
    ? `0 0 0 1.5px ${themeColors.primary}, 0 6px 16px ${themeColors.primary}22`
    : 'none'

  const colorTitle = darkMode ? '#f1f5f9' : '#1f2937'
  const colorSecondary = darkMode ? '#cbd5e1' : '#475569'
  const colorMuted = darkMode ? '#adb7c6' : '#556070'
  const subtleBg = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'

  const [showFocusInput, setShowFocusInput] = useState(false)
  const [focusInput, setFocusInput] = useState(task.focusTime?.toString() ?? '')

  // Re-sincroniza el input cuando cambia task.focusTime, ajustando el estado
  // durante el render en lugar de un efecto (evita renders en cascada).
  const [prevFocusTime, setPrevFocusTime] = useState(task.focusTime)
  if (task.focusTime !== prevFocusTime) {
    setPrevFocusTime(task.focusTime)
    setFocusInput(task.focusTime?.toString() ?? '')
  }

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
      <div
        className="group rounded-lg transition-all duration-200 cursor-pointer"
        style={{
          background: cardSurface,
          border: `1px solid ${cardBorder}`,
          boxShadow: cardShadow,
        }}
      onClick={() => { if (task.status === 'doing') switchActiveTask(task.id); }}>
      <div className="p-2.5">
        {/* Header: icon + title + delete */}
        <div className="flex items-start gap-2">
          <span className="shrink-0 mt-0.5" style={{ color: isActive ? themeColors.secondary : colorMuted }}>{STATUS_ICONS[task.status]}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-snug wrap-break-word" style={{ color: colorTitle, overflowWrap: 'anywhere' }}>{task.title}</p>
            <div className="flex items-center gap-3 mt-1">
              {task.pomodorosCompleted > 0 && (
                <span className="inline-flex items-center gap-0.5 text-xs" style={{ color: colorMuted }}>
                  <IconFlame size={10} /> {task.pomodorosCompleted}
                </span>
              )}
              {isActive && remainingTime && (
                <span className="inline-flex items-center gap-0.5 text-xs font-mono" style={{ color: colorSecondary }}>
                  <IconClock size={10} /> {remainingTime}
                </span>
              )}
            </div>
          </div>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => removeTask(task.id)}
            className="text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            style={{ color: colorMuted }}
            title="Remove task"
          >
            <IconX size={14} />
          </button>
        </div>

        {/* Actions row */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2 border-t" style={{ borderColor: `${themeColors.secondary}22` }} onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
          {/* Status button */}
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); moveTask(task.id, nextStatus); }}
            className="text-xs px-2 py-1 rounded-md transition-colors inline-flex items-center gap-1 shrink-0"
            style={{ backgroundColor: subtleBg, color: colorMuted }}
          >
            {STATUS_ICONS[task.status]} {statusLabels[task.status]}
          </button>

          {/* Focus/Play/Pause button */}
          {task.status === 'doing' && (
            <button
              onClick={handleToggleFocus}
              onPointerDown={(e) => e.stopPropagation()}
              className="text-xs px-2 py-1 rounded-md transition-colors inline-flex items-center gap-1 shrink-0"
              style={isActive
                ? { backgroundColor: themeColors.primary, color: themeColors.gradientEnd }
                : { backgroundColor: subtleBg, color: colorSecondary }}
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
                    className="flex-1 text-xs px-1 py-1.5 rounded-md border focus:outline-none text-center"
                    style={{ borderColor: `${themeColors.secondary}40`, color: colorTitle }}
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
                  className="text-xs px-2 py-1.5 rounded-md transition-colors inline-flex items-center justify-center gap-1 w-full"
                  style={{ backgroundColor: subtleBg, color: colorMuted }}
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
