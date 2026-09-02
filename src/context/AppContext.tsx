import { create } from 'zustand'
import type { Language } from '../i18n/translations'
import { themes, type ThemeName } from '../themes'
import { safeGetItem, safeSetItem } from '../lib/storage'
import { normalizeStreak, recomputeOnLoad, recordActivity, type StreakState } from '../lib/streak'

type TimerMode = 'work' | 'break'
type TimerStatus = 'idle' | 'running' | 'paused'
export type TaskStatus = 'todo' | 'doing' | 'done'

export interface Task {
  id: string
  title: string
  status: TaskStatus
  pomodorosCompleted: number
  createdAt: number
  timeLeft: number | null
  focusTime: number | null
}

export interface SessionRecord {
  id: string
  taskId: string | null
  taskTitle: string | null
  completedAt: number
  duration: number
}

export interface Settings {
  work: number
  break: number
}

interface TimerSnapshot {
  timerMode: TimerMode
  timerStatus: TimerStatus
  endAt: number | null
  timeLeft: number
  breakTimeLeft: number
  sessionsCompleted: number
  activeTaskId: string | null
}

interface AppState extends TimerSnapshot {
  finishPromptOpen: boolean
  settings: Settings
  sessionHistory: SessionRecord[]
  darkMode: boolean
  language: Language
  theme: ThemeName
  streak: StreakState

  tasks: Task[]

  setTimerMode: (mode: TimerMode) => void
  setTimerStatus: (status: TimerStatus) => void
  setTimeLeft: (time: number) => void
  setBreakTimeLeft: (time: number) => void
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  toggleFocus: () => void
  takeBreak: () => void
  closeFinishPrompt: () => void
  tick: () => void
  completeTimer: () => void
  incrementSessions: () => void
  setActiveTask: (id: string | null) => void
  switchActiveTask: (id: string) => void
  saveTaskTime: () => void
  updateSettings: (settings: Settings) => void
  clearHistory: () => void
  toggleDarkMode: () => void
  setLanguage: (lang: Language) => void
  setTheme: (theme: ThemeName) => void
  setTaskFocusTime: (id: string, focusTime: number | null) => void

  addTask: (title: string) => void
  removeTask: (id: string) => void
  moveTask: (id: string, status: TaskStatus) => void
  incrementTaskPomodoro: (id: string) => void
}

const DEFAULT_SETTINGS: Settings = {
  work: 25,
  break: 5,
}

const num = (v: unknown, fallback: number) =>
  typeof v === 'number' && Number.isFinite(v) ? v : fallback

const numOrNull = (v: unknown): number | null =>
  typeof v === 'number' && Number.isFinite(v) ? v : null

// Normaliza a la forma nueva { work, break }, migrando configuraciones antiguas
// que guardaban shortBreak/longBreak (se conserva shortBreak como break).
export const migrateSettings = (raw: unknown): Settings => {
  const s = (raw ?? {}) as Record<string, unknown>
  return {
    work: num(s.work, DEFAULT_SETTINGS.work),
    break: num(s.break ?? s.shortBreak, DEFAULT_SETTINGS.break),
  }
}

// Los datos persistidos pueden venir de versiones anteriores de la app o estar
// corruptos; cada registro se normaliza con valores por defecto y se descartan
// los irrecuperables, siguiendo el mismo patrón que migrateSettings.
export const normalizeTask = (raw: unknown): Task | null => {
  if (typeof raw !== 'object' || raw === null) return null
  const r = raw as Record<string, unknown>
  if (typeof r.id !== 'string' || typeof r.title !== 'string') return null
  return {
    id: r.id,
    title: r.title,
    status: r.status === 'doing' || r.status === 'done' ? r.status : 'todo',
    pomodorosCompleted: num(r.pomodorosCompleted, 0),
    createdAt: num(r.createdAt, Date.now()),
    timeLeft: numOrNull(r.timeLeft),
    focusTime: numOrNull(r.focusTime),
  }
}

export const normalizeSessionRecord = (raw: unknown): SessionRecord | null => {
  if (typeof raw !== 'object' || raw === null) return null
  const r = raw as Record<string, unknown>
  if (typeof r.id !== 'string') return null
  return {
    id: r.id,
    taskId: typeof r.taskId === 'string' ? r.taskId : null,
    taskTitle: typeof r.taskTitle === 'string' ? r.taskTitle : null,
    completedAt: num(r.completedAt, 0),
    duration: num(r.duration, 0),
  }
}

const loadSettings = (): Settings => {
  try {
    const stored = safeGetItem('pomo-settings')
    return stored ? migrateSettings(JSON.parse(stored)) : DEFAULT_SETTINGS
  } catch {
    return DEFAULT_SETTINGS
  }
}

const saveSettings = (settings: Settings) => {
  safeSetItem('pomo-settings', JSON.stringify(settings))
}

const getDurations = (settings: Settings): Record<TimerMode, number> => ({
  work: settings.work * 60,
  break: settings.break * 60,
})

// Variación de fondo del modo Descanso; se aplica al <html>.
const applyModeClasses = (mode: TimerMode) => {
  if (typeof window === 'undefined') return
  document.documentElement.classList.toggle('mode-break', mode === 'break')
}

const loadTasks = (): Task[] => {
  try {
    const stored = safeGetItem('pomo-tasks')
    const parsed: unknown = stored ? JSON.parse(stored) : []
    if (!Array.isArray(parsed)) return []
    return parsed.map(normalizeTask).filter((t): t is Task => t !== null)
  } catch {
    return []
  }
}

const saveTasks = (tasks: Task[]) => {
  safeSetItem('pomo-tasks', JSON.stringify(tasks))
}

const loadHistory = (): SessionRecord[] => {
  try {
    const stored = safeGetItem('pomo-history')
    const parsed: unknown = stored ? JSON.parse(stored) : []
    if (!Array.isArray(parsed)) return []
    return parsed.map(normalizeSessionRecord).filter((r): r is SessionRecord => r !== null)
  } catch {
    return []
  }
}

const saveHistory = (history: SessionRecord[]) => {
  safeSetItem('pomo-history', JSON.stringify(history))
}

// La racha se persiste en su propia clave, independiente del historial: limpiar
// el historial no debe borrar la racha acumulada.
const loadStreak = (): StreakState => {
  try {
    const stored = safeGetItem('pomo-streak')
    return normalizeStreak(stored ? JSON.parse(stored) : null)
  } catch {
    return normalizeStreak(null)
  }
}

const saveStreak = (streak: StreakState) => {
  safeSetItem('pomo-streak', JSON.stringify(streak))
}

const loadLanguage = (): Language => {
  const stored = safeGetItem('pomo-lang')
  return stored === 'en' || stored === 'es' ? stored : 'es'
}

const loadTheme = (): ThemeName => {
  const stored = safeGetItem('pomo-theme')
  return stored !== null && stored in themes ? (stored as ThemeName) : 'neutral'
}

// El estado del temporizador se persiste (clave pomo-timer) para que un refresh
// a mitad de sesión no la pierda. Mientras corre, endAt (epoch ms) es la fuente
// de verdad; timeLeft/breakTimeLeft son solo los segundos mostrados.
export const restoreTimerState = (
  raw: unknown,
  tasks: Task[],
  settings: Settings,
  now: number
): TimerSnapshot => {
  const d = getDurations(settings)
  const defaults: TimerSnapshot = {
    timerMode: 'work',
    timerStatus: 'idle',
    endAt: null,
    timeLeft: d.work,
    breakTimeLeft: d.break,
    sessionsCompleted: 0,
    activeTaskId: null,
  }
  if (typeof raw !== 'object' || raw === null) return defaults
  const r = raw as Record<string, unknown>
  const timerMode: TimerMode = r.timerMode === 'break' ? 'break' : 'work'
  const activeTaskId =
    typeof r.activeTaskId === 'string' && tasks.some((t) => t.id === r.activeTaskId)
      ? r.activeTaskId
      : null
  const snapshot: TimerSnapshot = {
    timerMode,
    timerStatus: r.timerStatus === 'running' || r.timerStatus === 'paused' ? r.timerStatus : 'idle',
    endAt: null,
    timeLeft: Math.max(0, num(r.timeLeft, d.work)),
    breakTimeLeft: Math.max(0, num(r.breakTimeLeft, d.break)),
    sessionsCompleted: Math.max(0, Math.round(num(r.sessionsCompleted, 0))),
    activeTaskId,
  }
  // El Enfoque no puede correr sin tarea activa (misma guarda que startTimer).
  if (snapshot.timerMode === 'work' && snapshot.activeTaskId === null) {
    snapshot.timerStatus = 'idle'
  }
  if (snapshot.timerStatus === 'running') {
    const endAt = numOrNull(r.endAt)
    if (endAt !== null && endAt > now) {
      // La cuenta sigue viva: se reanuda anclada al mismo endAt.
      snapshot.endAt = endAt
      const remaining = Math.max(0, Math.round((endAt - now) / 1000))
      if (snapshot.timerMode === 'work') snapshot.timeLeft = remaining
      else snapshot.breakTimeLeft = remaining
    } else {
      // La sesión expiró mientras la pestaña estaba cerrada: se muestra 00:00
      // sin registrarla (evita dobles conteos con pestañas duplicadas).
      snapshot.timerStatus = 'idle'
      if (snapshot.timerMode === 'work') snapshot.timeLeft = 0
      else snapshot.breakTimeLeft = 0
    }
  }
  return snapshot
}

const loadTimerState = (tasks: Task[], settings: Settings): TimerSnapshot => {
  try {
    const stored = safeGetItem('pomo-timer')
    const parsed: unknown = stored ? JSON.parse(stored) : null
    return restoreTimerState(parsed, tasks, settings, Date.now())
  } catch {
    return restoreTimerState(null, tasks, settings, Date.now())
  }
}

const saveTimerState = (s: TimerSnapshot) => {
  safeSetItem(
    'pomo-timer',
    JSON.stringify({
      v: 1,
      timerMode: s.timerMode,
      timerStatus: s.timerStatus,
      endAt: s.endAt,
      timeLeft: s.timeLeft,
      breakTimeLeft: s.breakTimeLeft,
      sessionsCompleted: s.sessionsCompleted,
      activeTaskId: s.activeTaskId,
    })
  )
}

const remainingFrom = (endAt: number): number =>
  Math.max(0, Math.round((endAt - Date.now()) / 1000))

// Congela la cuenta en curso: deriva los segundos restantes de endAt y, en
// Enfoque, los persiste también en la tarea activa. Devuelve los campos a
// mezclar en el próximo set(); si no hay cuenta corriendo, no cambia nada.
const snapshotRun = (state: AppState): Partial<AppState> => {
  if (state.timerStatus !== 'running' || state.endAt === null) return {}
  const remaining = remainingFrom(state.endAt)
  if (state.timerMode === 'work') {
    let tasks = state.tasks
    if (state.activeTaskId) {
      tasks = tasks.map((t) => (t.id === state.activeTaskId ? { ...t, timeLeft: remaining } : t))
      saveTasks(tasks)
    }
    return { timeLeft: remaining, tasks }
  }
  return { breakTimeLeft: remaining }
}

// Arranca la cuenta del modo actual anclada a Date.now(). Si el contador quedó
// en 0 (sesión anterior completada), recarga la duración completa para no
// disparar un fin de sesión inmediato.
const beginRun = (state: AppState): Partial<AppState> => {
  const d = getDurations(state.settings)
  if (state.timerMode === 'work') {
    const activeTask = state.tasks.find((t) => t.id === state.activeTaskId)
    let seconds = state.timeLeft
    let tasks = state.tasks
    if (seconds <= 0) {
      seconds = (activeTask?.focusTime ?? state.settings.work) * 60
      if (state.activeTaskId) {
        tasks = tasks.map((t) => (t.id === state.activeTaskId ? { ...t, timeLeft: seconds } : t))
        saveTasks(tasks)
      }
    }
    return { timerStatus: 'running', endAt: Date.now() + seconds * 1000, timeLeft: seconds, tasks }
  }
  const seconds = state.breakTimeLeft > 0 ? state.breakTimeLeft : d.break
  return { timerStatus: 'running', endAt: Date.now() + seconds * 1000, breakTimeLeft: seconds }
}

export const useAppStore = create<AppState>((set, get) => {
  const settings = loadSettings()
  let tasks = loadTasks()
  const timer = loadTimerState(tasks, settings)
  // La tarea activa restaurada debe reflejar el tiempo derivado del timer
  // persistido (task.timeLeft puede haber quedado desactualizado).
  if (timer.activeTaskId && timer.timerMode === 'work' && timer.timerStatus !== 'idle') {
    tasks = tasks.map((t) => (t.id === timer.activeTaskId ? { ...t, timeLeft: timer.timeLeft } : t))
  }
  applyModeClasses(timer.timerMode)
  return {
  ...timer,
  finishPromptOpen: false,
  settings,

  tasks,
  sessionHistory: loadHistory(),
  darkMode: typeof window !== 'undefined' ? safeGetItem('pomo-dark') !== 'false' : true,
  language: loadLanguage(),
  theme: loadTheme(),
  // Al cargar, la racha se reevalúa contra hoy: si el último día activo quedó a
  // más de un día, la racha actual visible cae a 0 (el récord se conserva).
  streak: recomputeOnLoad(loadStreak(), Date.now()),

  setTimerMode: (mode) =>
    set((state) => {
      const snap = snapshotRun(state)
      const d = getDurations(state.settings)
      applyModeClasses(mode)
      // Enfoque conserva su cuenta (el tiempo de la tarea activa); los descansos
      // usan su propia cuenta y parten llenos al (re)entrar. Nunca se cruzan.
      if (mode === 'work') {
        return { ...snap, timerMode: mode, timerStatus: 'idle', endAt: null }
      }
      return { ...snap, timerMode: mode, breakTimeLeft: d[mode], timerStatus: 'idle', endAt: null }
    }),

  setTimerStatus: (status) => set({ timerStatus: status }),

  setTimeLeft: (time) => set({ timeLeft: time }),

  setBreakTimeLeft: (time) => set({ breakTimeLeft: time }),

  // El modo Enfoque solo puede correr con una tarea activa; los descansos son libres.
  startTimer: () =>
    set((state) => {
      if (state.timerStatus === 'running') return {}
      if (state.timerMode === 'work' && state.activeTaskId === null) return {}
      return beginRun(state)
    }),

  pauseTimer: () =>
    set((state) => {
      if (state.timerStatus !== 'running') return { timerStatus: 'paused' }
      return { ...snapshotRun(state), timerStatus: 'paused', endAt: null }
    }),

  // Intención compartida por el temporizador y la tarjeta activa: enfocar/reanudar o pausar
  // la misma sesión. Respeta la guarda de startTimer (no-op en Enfoque sin tarea activa).
  toggleFocus: () =>
    set((state) => {
      if (state.timerStatus === 'running') {
        return { ...snapshotRun(state), timerStatus: 'paused', endAt: null }
      }
      if (state.timerMode === 'work' && state.activeTaskId === null) return {}
      return beginRun(state)
    }),

  // Atajo desde la tarjeta / aviso de fin de tarea: inicia el Descanso general
  // aislado, sin tocar el tiempo de Enfoque ni el de ninguna tarea.
  takeBreak: () =>
    set((state) => {
      const snap = snapshotRun(state)
      const d = getDurations(state.settings)
      applyModeClasses('break')
      return {
        ...snap,
        timerMode: 'break',
        breakTimeLeft: d.break,
        timerStatus: 'running',
        endAt: Date.now() + d.break * 1000,
      }
    }),

  closeFinishPrompt: () => set({ finishPromptOpen: false }),

  resetTimer: () =>
    set((state) => {
      // En Enfoque con tarea activa, reiniciar vuelve a la duración de esa tarea y
      // reinicia también su tiempo persistido, para que la tarjeta quede sincronizada.
      if (state.timerMode === 'work' && state.activeTaskId) {
        const activeTask = state.tasks.find((t) => t.id === state.activeTaskId)
        const mins = activeTask?.focusTime ?? state.settings.work
        const newTimeLeft = mins * 60
        const tasks = state.tasks.map((t) =>
          t.id === state.activeTaskId ? { ...t, timeLeft: newTimeLeft } : t
        )
        saveTasks(tasks)
        return { timeLeft: newTimeLeft, timerStatus: 'idle', endAt: null, tasks }
      }
      // Descanso: reinicia solo su cuenta propia, sin tocar Enfoque ni tareas.
      const d = getDurations(state.settings)
      if (state.timerMode !== 'work') {
        return { breakTimeLeft: d[state.timerMode], timerStatus: 'idle', endAt: null }
      }
      // Enfoque sin tarea activa: comportamiento previo.
      return { timeLeft: d.work, timerStatus: 'idle', endAt: null }
    }),

  // Recalcula los segundos restantes desde endAt. Es una recomputación pura e
  // idempotente: ticks duplicados (StrictMode, doble intervalo) son inocuos.
  tick: () =>
    set((state) => {
      if (state.timerStatus !== 'running' || state.endAt === null) return {}
      const remaining = remainingFrom(state.endAt)
      if (state.timerMode === 'work') {
        return remaining === state.timeLeft ? {} : { timeLeft: remaining }
      }
      return remaining === state.breakTimeLeft ? {} : { breakTimeLeft: remaining }
    }),

  // Fin de sesión: en Enfoque registra el pomodoro y pasa a Descanso; en
  // Descanso vuelve a Enfoque. No-op si el timer no está corriendo, lo que lo
  // hace seguro ante disparos duplicados.
  completeTimer: () => {
    const state = get()
    if (state.timerStatus !== 'running') return
    if (state.timerMode === 'work') {
      get().incrementSessions()
      set((s) => {
        const activeTask = s.tasks.find((t) => t.id === s.activeTaskId)
        let tasks = s.tasks
        if (s.activeTaskId) {
          // La sesión terminó: la próxima en esta tarea parte fresca en focusTime.
          tasks = tasks.map((t) => (t.id === s.activeTaskId ? { ...t, timeLeft: null } : t))
          saveTasks(tasks)
        }
        const d = getDurations(s.settings)
        applyModeClasses('break')
        return {
          tasks,
          timerMode: 'break',
          timerStatus: 'idle',
          endAt: null,
          breakTimeLeft: d.break,
          timeLeft: (activeTask?.focusTime ?? s.settings.work) * 60,
        }
      })
      return
    }
    set((s) => {
      const d = getDurations(s.settings)
      applyModeClasses('work')
      return { timerMode: 'work', timerStatus: 'idle', endAt: null, breakTimeLeft: d.break }
    })
  },

  incrementSessions: () =>
    set((state) => {
      const newCount = state.sessionsCompleted + 1
      let tasks = state.tasks
      if (state.activeTaskId) {
        tasks = tasks.map((t) =>
          t.id === state.activeTaskId ? { ...t, pomodorosCompleted: t.pomodorosCompleted + 1 } : t
        )
        saveTasks(tasks)
      }
      const activeTask = state.tasks.find((t) => t.id === state.activeTaskId)
      const record: SessionRecord = {
        id: crypto.randomUUID(),
        taskId: state.activeTaskId,
        taskTitle: activeTask?.title ?? null,
        completedAt: Date.now(),
        duration: state.settings.work,
      }
      const history = [...state.sessionHistory, record]
      saveHistory(history)
      // Único punto donde se registra un pomodoro de Enfoque completado: aquí se
      // marca el día activo y se actualiza la racha, imposible de desincronizar.
      const streak = recordActivity(state.streak, Date.now())
      saveStreak(streak)
      return { sessionsCompleted: newCount, tasks, sessionHistory: history, streak }
    }),

  clearHistory: () =>
    set(() => {
      saveHistory([])
      return { sessionHistory: [] }
    }),

  setActiveTask: (id) => set({ activeTaskId: id }),

  switchActiveTask: (id) =>
    set((state) => {
      // El tiempo saliente se deriva de endAt si la cuenta está corriendo.
      const currentLeft =
        state.timerMode === 'work' && state.timerStatus === 'running' && state.endAt !== null
          ? remainingFrom(state.endAt)
          : state.timeLeft
      const breakLeft =
        state.timerMode === 'break' && state.timerStatus === 'running' && state.endAt !== null
          ? remainingFrom(state.endAt)
          : state.breakTimeLeft
      let tasks = state.tasks
      if (state.activeTaskId) {
        tasks = tasks.map((t) =>
          t.id === state.activeTaskId ? { ...t, timeLeft: currentLeft } : t
        )
        saveTasks(tasks)
      }
      const targetTask = tasks.find((t) => t.id === id)
      const d = getDurations(state.settings)
      let newTimeLeft: number
      if (targetTask?.timeLeft !== null && targetTask?.timeLeft !== undefined) {
        newTimeLeft = targetTask.timeLeft
      } else if (targetTask?.focusTime) {
        newTimeLeft = targetTask.focusTime * 60
      } else {
        newTimeLeft = d.work
      }
      return {
        activeTaskId: id,
        timeLeft: newTimeLeft,
        breakTimeLeft: breakLeft,
        timerStatus: 'idle',
        endAt: null,
        tasks,
      }
    }),

  saveTaskTime: () =>
    set((state) => {
      // Solo el Enfoque persiste tiempo en la tarea; los descansos no tocan tareas.
      if (state.timerMode !== 'work') return {}
      if (!state.activeTaskId) return {}
      const remaining =
        state.timerStatus === 'running' && state.endAt !== null
          ? remainingFrom(state.endAt)
          : state.timeLeft
      const tasks = state.tasks.map((t) =>
        t.id === state.activeTaskId ? { ...t, timeLeft: remaining } : t
      )
      saveTasks(tasks)
      return { tasks, timeLeft: remaining }
    }),

  updateSettings: (newSettings) =>
    set((state) => {
      saveSettings(newSettings)
      const d = getDurations(newSettings)
      // Recargar la cuenta del modo actual (Enfoque usa timeLeft; Descanso, breakTimeLeft).
      if (state.timerMode === 'work') {
        return { settings: newSettings, timeLeft: d.work, timerStatus: 'idle', endAt: null }
      }
      return { settings: newSettings, breakTimeLeft: d.break, timerStatus: 'idle', endAt: null }
    }),

  addTask: (title) =>
    set((state) => {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title,
        status: 'todo',
        pomodorosCompleted: 0,
        createdAt: Date.now(),
        timeLeft: null,
        focusTime: null,
      }
      const tasks = [...state.tasks, newTask]
      saveTasks(tasks)
      return { tasks }
    }),

  removeTask: (id) =>
    set((state) => {
      const tasks = state.tasks.filter((t) => t.id !== id)
      saveTasks(tasks)
      return { tasks }
    }),

  moveTask: (id, status) =>
    set((state) => {
      const tasks = state.tasks.map((t) =>
        t.id === id ? { ...t, status, timeLeft: (status === 'done' || status === 'todo') ? null : t.timeLeft } : t
      )
      saveTasks(tasks)
      // Al terminar (mover a Hecho) la tarea activa, ofrecer el aviso de fin de tarea.
      const finishPromptOpen = id === state.activeTaskId && status === 'done' ? true : state.finishPromptOpen
      return { tasks, finishPromptOpen }
    }),

  incrementTaskPomodoro: (id) =>
    set((state) => {
      const tasks = state.tasks.map((t) =>
        t.id === id ? { ...t, pomodorosCompleted: t.pomodorosCompleted + 1 } : t
      )
      saveTasks(tasks)
      return { tasks }
    }),

  toggleDarkMode: () =>
    set((state) => {
      const next = !state.darkMode
      safeSetItem('pomo-dark', String(next))
      document.documentElement.classList.toggle('dark', next)
      return { darkMode: next }
    }),

  setLanguage: (lang) =>
    set(() => {
      safeSetItem('pomo-lang', lang)
      return { language: lang }
    }),

  setTheme: (theme) =>
    set(() => {
      safeSetItem('pomo-theme', theme)
      document.documentElement.setAttribute('data-theme', theme)
      return { theme }
    }),

  setTaskFocusTime: (id, focusTime) =>
    set((state) => {
      const tasks = state.tasks.map((t) =>
        t.id === id ? { ...t, focusTime } : t
      )
      saveTasks(tasks)
      return { tasks }
    }),
  }
})

// Persistir el estado del timer cuando cambian sus anclas (modo, estado, endAt,
// sesiones, tarea activa) o sus contadores estando detenido. Mientras corre,
// endAt ya persistido es la fuente de verdad, así que los ticks por segundo no
// generan escrituras a localStorage.
if (typeof window !== 'undefined') {
  useAppStore.subscribe((state, prev) => {
    const anchorsChanged =
      state.timerMode !== prev.timerMode ||
      state.timerStatus !== prev.timerStatus ||
      state.endAt !== prev.endAt ||
      state.sessionsCompleted !== prev.sessionsCompleted ||
      state.activeTaskId !== prev.activeTaskId
    const countersChangedWhileStopped =
      state.timerStatus !== 'running' &&
      (state.timeLeft !== prev.timeLeft || state.breakTimeLeft !== prev.breakTimeLeft)
    if (anchorsChanged || countersChangedWhileStopped) saveTimerState(state)
  })
}
