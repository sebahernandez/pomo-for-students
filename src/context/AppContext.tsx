import { create } from 'zustand'
import type { Language } from '../i18n/translations'
import type { ThemeName } from '../themes'

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

interface AppState {
  timerMode: TimerMode
  timerStatus: TimerStatus
  timeLeft: number
  breakTimeLeft: number
  sessionsCompleted: number
  finishPromptOpen: boolean
  activeTaskId: string | null
  settings: Settings
  sessionHistory: SessionRecord[]
  darkMode: boolean
  language: Language
  theme: ThemeName

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

// Normaliza a la forma nueva { work, break }, migrando configuraciones antiguas
// que guardaban shortBreak/longBreak (se conserva shortBreak como break).
const migrateSettings = (raw: unknown): Settings => {
  const s = (raw ?? {}) as Record<string, unknown>
  const num = (v: unknown, fallback: number) =>
    typeof v === 'number' && Number.isFinite(v) ? v : fallback
  return {
    work: num(s.work, DEFAULT_SETTINGS.work),
    break: num(s.break ?? s.shortBreak, DEFAULT_SETTINGS.break),
  }
}

const loadSettings = (): Settings => {
  try {
    const stored = localStorage.getItem('pomo-settings')
    return stored ? migrateSettings(JSON.parse(stored)) : DEFAULT_SETTINGS
  } catch {
    return DEFAULT_SETTINGS
  }
}

const saveSettings = (settings: Settings) => {
  localStorage.setItem('pomo-settings', JSON.stringify(settings))
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
    const stored = localStorage.getItem('pomo-tasks')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

const saveTasks = (tasks: Task[]) => {
  localStorage.setItem('pomo-tasks', JSON.stringify(tasks))
}

const loadHistory = (): SessionRecord[] => {
  try {
    const stored = localStorage.getItem('pomo-history')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

const saveHistory = (history: SessionRecord[]) => {
  localStorage.setItem('pomo-history', JSON.stringify(history))
}

export const useAppStore = create<AppState>((set) => {
  const settings = loadSettings()
  const durations = getDurations(settings)
  return {
  timerMode: 'work',
  timerStatus: 'idle',
  timeLeft: durations.work,
  breakTimeLeft: durations.break,
  sessionsCompleted: 0,
  finishPromptOpen: false,
  activeTaskId: null,
  settings,

  tasks: loadTasks(),
  sessionHistory: loadHistory(),
  darkMode: typeof window !== 'undefined' ? localStorage.getItem('pomo-dark') !== 'false' : true,
  language: (typeof window !== 'undefined' && (localStorage.getItem('pomo-lang') as Language)) || 'es',
  theme: (typeof window !== 'undefined' && (localStorage.getItem('pomo-theme') as ThemeName)) || 'neutral',

  setTimerMode: (mode) =>
    set((state) => {
      const d = getDurations(state.settings)
      applyModeClasses(mode)
      // Enfoque conserva su cuenta (el tiempo de la tarea activa); los descansos
      // usan su propia cuenta y parten llenos al (re)entrar. Nunca se cruzan.
      if (mode === 'work') {
        return { timerMode: mode, timerStatus: 'idle' }
      }
      return { timerMode: mode, breakTimeLeft: d[mode], timerStatus: 'idle' }
    }),

  setTimerStatus: (status) => set({ timerStatus: status }),

  setTimeLeft: (time) => set({ timeLeft: time }),

  setBreakTimeLeft: (time) => set({ breakTimeLeft: time }),

  // El modo Enfoque solo puede correr con una tarea activa; los descansos son libres.
  startTimer: () =>
    set((state) => {
      if (state.timerMode === 'work' && state.activeTaskId === null) return {}
      return { timerStatus: 'running' }
    }),

  pauseTimer: () => set({ timerStatus: 'paused' }),

  // Intención compartida por el temporizador y la tarjeta activa: enfocar/reanudar o pausar
  // la misma sesión. Respeta la guarda de startTimer (no-op en Enfoque sin tarea activa).
  toggleFocus: () =>
    set((state) => {
      if (state.timerStatus === 'running') return { timerStatus: 'paused' }
      if (state.timerMode === 'work' && state.activeTaskId === null) return {}
      return { timerStatus: 'running' }
    }),

  // Atajo desde la tarjeta / aviso de fin de tarea: inicia el Descanso general
  // aislado, sin tocar el tiempo de Enfoque ni el de ninguna tarea.
  takeBreak: () =>
    set((state) => {
      const d = getDurations(state.settings)
      applyModeClasses('break')
      return { timerMode: 'break', breakTimeLeft: d.break, timerStatus: 'running' }
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
        return { timeLeft: newTimeLeft, timerStatus: 'idle', tasks }
      }
      // Descanso: reinicia solo su cuenta propia, sin tocar Enfoque ni tareas.
      const d = getDurations(state.settings)
      if (state.timerMode !== 'work') {
        return { breakTimeLeft: d[state.timerMode], timerStatus: 'idle' }
      }
      // Enfoque sin tarea activa: comportamiento previo.
      return { timeLeft: d.work, timerStatus: 'idle' }
    }),

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
      return { sessionsCompleted: newCount, tasks, sessionHistory: history }
    }),

  clearHistory: () =>
    set(() => {
      saveHistory([])
      return { sessionHistory: [] }
    }),

  setActiveTask: (id) => set({ activeTaskId: id }),

  switchActiveTask: (id) =>
    set((state) => {
      let tasks = state.tasks
      if (state.activeTaskId) {
        tasks = tasks.map((t) =>
          t.id === state.activeTaskId ? { ...t, timeLeft: state.timeLeft } : t
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
      return { activeTaskId: id, timeLeft: newTimeLeft, timerStatus: 'idle', tasks }
    }),

  saveTaskTime: () =>
    set((state) => {
      // Solo el Enfoque persiste tiempo en la tarea; los descansos no tocan tareas.
      if (state.timerMode !== 'work') return {}
      if (!state.activeTaskId) return {}
      const tasks = state.tasks.map((t) =>
        t.id === state.activeTaskId ? { ...t, timeLeft: state.timeLeft } : t
      )
      saveTasks(tasks)
      return { tasks }
    }),

  updateSettings: (newSettings) =>
    set((state) => {
      saveSettings(newSettings)
      const d = getDurations(newSettings)
      // Recargar la cuenta del modo actual (Enfoque usa timeLeft; Descanso, breakTimeLeft).
      if (state.timerMode === 'work') {
        return { settings: newSettings, timeLeft: d.work, timerStatus: 'idle' }
      }
      return { settings: newSettings, breakTimeLeft: d.break, timerStatus: 'idle' }
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
      localStorage.setItem('pomo-dark', String(next))
      document.documentElement.classList.toggle('dark', next)
      return { darkMode: next }
    }),

  setLanguage: (lang) =>
    set(() => {
      localStorage.setItem('pomo-lang', lang)
      return { language: lang }
    }),

  setTheme: (theme) =>
    set(() => {
      localStorage.setItem('pomo-theme', theme)
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
