import { create } from 'zustand'
import type { Language } from '../i18n/translations'
import type { ThemeName } from '../themes'

type TimerMode = 'work' | 'shortBreak' | 'longBreak'
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
  shortBreak: number
  longBreak: number
}

interface AppState {
  timerMode: TimerMode
  timerStatus: TimerStatus
  timeLeft: number
  sessionsCompleted: number
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
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
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
  shortBreak: 5,
  longBreak: 15,
}

const loadSettings = (): Settings => {
  try {
    const stored = localStorage.getItem('pomo-settings')
    return stored ? JSON.parse(stored) : DEFAULT_SETTINGS
  } catch {
    return DEFAULT_SETTINGS
  }
}

const saveSettings = (settings: Settings) => {
  localStorage.setItem('pomo-settings', JSON.stringify(settings))
}

const getDurations = (settings: Settings): Record<TimerMode, number> => ({
  work: settings.work * 60,
  shortBreak: settings.shortBreak * 60,
  longBreak: settings.longBreak * 60,
})

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
  sessionsCompleted: 0,
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
      if (typeof window !== 'undefined') {
        document.documentElement.classList.remove('mode-shortBreak', 'mode-longBreak')
        if (mode === 'shortBreak') document.documentElement.classList.add('mode-shortBreak')
        if (mode === 'longBreak') document.documentElement.classList.add('mode-longBreak')
      }
      return { timerMode: mode, timeLeft: d[mode], timerStatus: 'idle' }
    }),

  setTimerStatus: (status) => set({ timerStatus: status }),

  setTimeLeft: (time) => set({ timeLeft: time }),

  startTimer: () => set({ timerStatus: 'running' }),

  pauseTimer: () => set({ timerStatus: 'paused' }),

  resetTimer: () =>
    set((state) => {
      const d = getDurations(state.settings)
      return { timeLeft: d[state.timerMode], timerStatus: 'idle' }
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
      return {
        settings: newSettings,
        timeLeft: d[state.timerMode],
        timerStatus: 'idle',
      }
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
      return { tasks }
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
