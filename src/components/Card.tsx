import { useState } from 'react'
import { IconX, IconFlame, IconTarget, IconCircleDashed, IconCircleCheck, IconPlayerPlay, IconPlayerPause, IconClock, IconChevronDown, IconCheck } from '@tabler/icons-react'
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

// Duraciones sugeridas (en minutos) al estilo del selector de Google Calendar.
const FOCUS_PRESETS = [10, 15, 20, 25, 30, 45, 60, 90, 120]
const MAX_FOCUS_MINUTES = 8 * 60

// Formato legible completo para el disparador: "1 h 30 min", "2 h", "45 min".
const formatDuration = (mins: number): string => {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h && m) return `${h} h ${m} min`
  if (h) return `${h} h`
  return `${m} min`
}

// Formato compacto para las fichas del selector: "1 h 30", "2 h", "45 min".
const formatChip = (mins: number): string => {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h && m) return `${h} h ${m}`
  if (h) return `${h} h`
  return `${m} min`
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
  const toggleFocus = useAppStore((s) => s.toggleFocus)
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
  // La tarjeta activa recibe un tinte algo más presente para destacar sin perder legibilidad.
  const modeBase: [number, number, number] = darkMode ? [28, 28, 30] : [255, 255, 255]
  const cardSurface = isActive
    ? tint(themeColors.primary, modeBase, darkMode ? 0.13 : 0.08)
    : tint(themeColors.secondary, modeBase, darkMode ? 0.07 : 0.05)
  const cardBorder = isActive ? `${themeColors.primary}b3` : `${themeColors.secondary}40`
  // Realce estático de la tarjeta activa: anillo de acento fino + halo suave.
  // Se usa box-shadow (no border-width) para no alterar el tamaño ni el alineamiento.
  const cardShadow = isActive
    ? `0 0 0 1px ${themeColors.primary}80, 0 4px 14px ${themeColors.primary}1f`
    : 'none'
  // Variables para el pulso animado (clase .active-card-pulse) cuando la sesión corre.
  const activeGlowVars = isActive
    ? {
        '--active-ring': `${themeColors.primary}80`,
        '--active-glow-weak': `${themeColors.primary}1a`,
        '--active-glow-strong': `${themeColors.primary}33`,
      } as React.CSSProperties
    : undefined

  const colorTitle = darkMode ? '#f1f5f9' : '#1f2937'
  const colorSecondary = darkMode ? '#cbd5e1' : '#475569'
  const colorMuted = darkMode ? '#adb7c6' : '#556070'
  const subtleBg = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'

  const [showTimePicker, setShowTimePicker] = useState(false)
  const [customH, setCustomH] = useState('')
  const [customM, setCustomM] = useState('')

  const handleToggleFocus = () => {
    if (isActive) {
      // Misma sesión que controla el temporizador: enfocar/reanudar o pausar.
      toggleFocus()
    } else {
      switchActiveTask(task.id)
      startTimer()
    }
  }

  // Aplica una duración (en minutos) a la tarea y, si está activa, ajusta el temporizador.
  const applyFocusTime = (mins: number) => {
    if (mins > 0 && mins <= MAX_FOCUS_MINUTES) {
      setTaskFocusTime(task.id, mins)
      if (isActive) {
        useAppStore.setState({ timeLeft: mins * 60 })
      }
      setShowTimePicker(false)
      setCustomH('')
      setCustomM('')
    }
  }

  const handleCustomSave = () => {
    const h = parseInt(customH, 10) || 0
    const m = parseInt(customM, 10) || 0
    applyFocusTime(h * 60 + m)
  }

  const toggleTimePicker = () => {
    setShowTimePicker((open) => {
      const next = !open
      // Al abrir, precarga los campos personalizados con la duración actual.
      if (next && task.focusTime) {
        setCustomH(String(Math.floor(task.focusTime / 60)))
        setCustomM(String(task.focusTime % 60))
      }
      return next
    })
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
        className={`group rounded-lg transition-all duration-200 cursor-pointer${isRunning ? ' active-card-pulse' : ''}`}
        style={{
          background: cardSurface,
          border: `1px solid ${cardBorder}`,
          boxShadow: cardShadow,
          ...activeGlowVars,
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

          {/* Selector de duración de la tarea (estilo Google Calendar) */}
          {task.status === 'doing' && (
            <div className="w-full mt-1.5" onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
              <button
                onClick={toggleTimePicker}
                className="text-xs px-2 py-1.5 rounded-md transition-colors inline-flex items-center gap-1.5 w-full"
                style={{ backgroundColor: subtleBg, color: task.focusTime ? colorSecondary : colorMuted }}
                aria-expanded={showTimePicker}
                title={t.setTaskTime}
              >
                <IconClock size={12} className="shrink-0" />
                <span className="flex-1 text-left truncate">
                  {task.focusTime ? formatDuration(task.focusTime) : t.setTaskTime}
                </span>
                <IconChevronDown
                  size={12}
                  className="shrink-0"
                  style={{ transform: showTimePicker ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }}
                />
              </button>

              {showTimePicker && (
                <div
                  className="mt-1.5 rounded-md p-2 border animate-fade-in"
                  style={{ backgroundColor: subtleBg, borderColor: `${themeColors.secondary}33` }}
                >
                  <div className="grid grid-cols-3 gap-1">
                    {FOCUS_PRESETS.map((m) => {
                      const selected = task.focusTime === m
                      return (
                        <button
                          key={m}
                          onClick={() => applyFocusTime(m)}
                          className="text-xs px-1.5 py-1.5 rounded-md transition-colors text-center"
                          style={selected
                            ? { backgroundColor: themeColors.primary, color: themeColors.gradientEnd }
                            : { backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', color: colorSecondary }}
                        >
                          {formatChip(m)}
                        </button>
                      )
                    })}
                  </div>

                  {/* Personalizado: horas y minutos */}
                  <div className="mt-2 pt-2 border-t" style={{ borderColor: `${themeColors.secondary}22` }}>
                    <span className="text-[10px] uppercase tracking-wider" style={{ color: colorMuted }}>
                      {t.customDuration}
                    </span>
                    <div className="flex items-center gap-1 mt-1">
                      <input
                        type="number"
                        min={0}
                        max={8}
                        value={customH}
                        onChange={(e) => setCustomH(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleCustomSave(); if (e.key === 'Escape') setShowTimePicker(false); }}
                        className="w-10 text-xs px-1 py-1.5 rounded-md border focus:outline-none text-center"
                        style={{ borderColor: `${themeColors.secondary}40`, color: colorTitle }}
                        placeholder="0"
                        aria-label="horas"
                      />
                      <span className="text-xs" style={{ color: colorMuted }}>h</span>
                      <input
                        type="number"
                        min={0}
                        max={59}
                        value={customM}
                        onChange={(e) => setCustomM(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleCustomSave(); if (e.key === 'Escape') setShowTimePicker(false); }}
                        className="w-11 text-xs px-1 py-1.5 rounded-md border focus:outline-none text-center"
                        style={{ borderColor: `${themeColors.secondary}40`, color: colorTitle }}
                        placeholder="0"
                        aria-label="minutos"
                      />
                      <span className="text-xs" style={{ color: colorMuted }}>min</span>
                      <button
                        onClick={handleCustomSave}
                        className="ml-auto text-xs px-2.5 py-1.5 rounded-md inline-flex items-center gap-1"
                        style={{ backgroundColor: themeColors.primary, color: themeColors.gradientEnd }}
                      >
                        <IconCheck size={12} /> {t.save}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
