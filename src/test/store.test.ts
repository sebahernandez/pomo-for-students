import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  useAppStore,
  migrateSettings,
  normalizeTask,
  normalizeSessionRecord,
  restoreTimerState,
  type Task,
} from '../context/AppContext'

// El store es un singleton de módulo inicializado desde localStorage al
// importarse; cada test parte del snapshot inicial capturado aquí. Las rutas
// de carga se prueban directamente sobre las funciones exportadas.
const initialState = useAppStore.getState()

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: crypto.randomUUID(),
  title: 'Estudiar',
  status: 'doing',
  pomodorosCompleted: 0,
  createdAt: 0,
  timeLeft: null,
  focusTime: null,
  ...overrides,
})

beforeEach(() => {
  localStorage.clear()
  useAppStore.setState(initialState, true)
})

describe('timer state machine', () => {
  const T0 = new Date('2026-09-01T12:00:00Z').getTime()

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(T0)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('startTimer is a no-op in work mode without an active task', () => {
    useAppStore.getState().startTimer()
    expect(useAppStore.getState().timerStatus).toBe('idle')
    expect(useAppStore.getState().endAt).toBeNull()
  })

  it('startTimer anchors endAt to the remaining seconds', () => {
    const task = makeTask()
    useAppStore.setState({ tasks: [task], activeTaskId: task.id })
    useAppStore.getState().startTimer()
    const s = useAppStore.getState()
    expect(s.timerStatus).toBe('running')
    expect(s.endAt).toBe(T0 + s.timeLeft * 1000)
  })

  it('break mode runs without an active task', () => {
    useAppStore.getState().setTimerMode('break')
    useAppStore.getState().startTimer()
    const s = useAppStore.getState()
    expect(s.timerStatus).toBe('running')
    expect(s.endAt).toBe(T0 + s.breakTimeLeft * 1000)
  })

  it('tick derives the remaining time from endAt, immune to lost intervals', () => {
    const task = makeTask()
    useAppStore.setState({ tasks: [task], activeTaskId: task.id })
    useAppStore.getState().startTimer()
    const total = useAppStore.getState().timeLeft

    // 90 segundos pasan sin ningún tick intermedio (pestaña estrangulada).
    vi.setSystemTime(T0 + 90_000)
    useAppStore.getState().tick()
    expect(useAppStore.getState().timeLeft).toBe(total - 90)
  })

  it('pause snapshots the anchored remaining time into state and the active task', () => {
    const task = makeTask()
    useAppStore.setState({ tasks: [task], activeTaskId: task.id })
    useAppStore.getState().startTimer()
    const total = useAppStore.getState().timeLeft

    vi.setSystemTime(T0 + 60_000)
    useAppStore.getState().pauseTimer()
    const s = useAppStore.getState()
    expect(s.timerStatus).toBe('paused')
    expect(s.endAt).toBeNull()
    expect(s.timeLeft).toBe(total - 60)
    expect(s.tasks[0].timeLeft).toBe(total - 60)
  })

  it('completeTimer records the session and switches to a fresh break', () => {
    const task = makeTask({ focusTime: 10 })
    useAppStore.setState({ tasks: [task], activeTaskId: task.id, timeLeft: 600 })
    useAppStore.getState().startTimer()

    vi.setSystemTime(T0 + 600_000)
    useAppStore.getState().tick()
    expect(useAppStore.getState().timeLeft).toBe(0)

    useAppStore.getState().completeTimer()
    const s = useAppStore.getState()
    expect(s.timerMode).toBe('break')
    expect(s.timerStatus).toBe('idle')
    expect(s.sessionsCompleted).toBe(1)
    expect(s.sessionHistory).toHaveLength(1)
    expect(s.sessionHistory[0].taskId).toBe(task.id)
    expect(s.sessionHistory[0].taskTitle).toBe(task.title)
    expect(s.tasks[0].pomodorosCompleted).toBe(1)
    // La próxima sesión en la tarea parte fresca; el display vuelve a focusTime.
    expect(s.tasks[0].timeLeft).toBeNull()
    expect(s.timeLeft).toBe(600)
  })

  it('completeTimer is idempotent: a duplicate call after completion is a no-op', () => {
    const task = makeTask({ focusTime: 10 })
    useAppStore.setState({ tasks: [task], activeTaskId: task.id, timeLeft: 600 })
    useAppStore.getState().startTimer()
    vi.setSystemTime(T0 + 600_000)
    useAppStore.getState().tick()
    useAppStore.getState().completeTimer()
    useAppStore.getState().completeTimer()
    expect(useAppStore.getState().sessionsCompleted).toBe(1)
    expect(useAppStore.getState().sessionHistory).toHaveLength(1)
  })

  it('completing a break returns to work mode without recording anything', () => {
    useAppStore.getState().setTimerMode('break')
    useAppStore.getState().startTimer()
    vi.setSystemTime(T0 + useAppStore.getState().breakTimeLeft * 1000)
    useAppStore.getState().tick()
    useAppStore.getState().completeTimer()
    const s = useAppStore.getState()
    expect(s.timerMode).toBe('work')
    expect(s.sessionsCompleted).toBe(0)
    expect(s.sessionHistory).toHaveLength(0)
  })

  it('starting again at 00:00 reloads the full duration instead of insta-completing', () => {
    const task = makeTask({ focusTime: 10 })
    useAppStore.setState({ tasks: [task], activeTaskId: task.id, timeLeft: 0 })
    useAppStore.getState().startTimer()
    const s = useAppStore.getState()
    expect(s.timeLeft).toBe(600)
    expect(s.endAt).toBe(T0 + 600_000)
  })

  it('takeBreak starts an isolated running break without touching focus time', () => {
    const task = makeTask({ timeLeft: 1234 })
    useAppStore.setState({ tasks: [task], activeTaskId: task.id, timeLeft: 1234 })
    useAppStore.getState().takeBreak()
    const s = useAppStore.getState()
    expect(s.timerMode).toBe('break')
    expect(s.timerStatus).toBe('running')
    expect(s.breakTimeLeft).toBe(s.settings.break * 60)
    expect(s.timeLeft).toBe(1234)
  })
})

describe('switchActiveTask', () => {
  it('hands off remaining time between tasks', () => {
    const a = makeTask({ title: 'A', timeLeft: 900 })
    const b = makeTask({ title: 'B', focusTime: 15 })
    useAppStore.setState({ tasks: [a, b], activeTaskId: a.id, timeLeft: 750 })

    useAppStore.getState().switchActiveTask(b.id)
    const s = useAppStore.getState()
    // La saliente conserva el tiempo mostrado; la entrante usa su focusTime.
    expect(s.tasks.find((t) => t.id === a.id)?.timeLeft).toBe(750)
    expect(s.timeLeft).toBe(15 * 60)
    expect(s.activeTaskId).toBe(b.id)
    expect(s.timerStatus).toBe('idle')
  })

  it('resumes a task with stored timeLeft', () => {
    const a = makeTask({ title: 'A', timeLeft: 321 })
    useAppStore.setState({ tasks: [a], activeTaskId: null })
    useAppStore.getState().switchActiveTask(a.id)
    expect(useAppStore.getState().timeLeft).toBe(321)
  })
})

describe('moveTask', () => {
  it('opens the finish prompt when the active task moves to done', () => {
    const a = makeTask()
    useAppStore.setState({ tasks: [a], activeTaskId: a.id })
    useAppStore.getState().moveTask(a.id, 'done')
    const s = useAppStore.getState()
    expect(s.finishPromptOpen).toBe(true)
    expect(s.tasks[0].timeLeft).toBeNull()
  })

  it('does not open the prompt for a non-active task', () => {
    const a = makeTask()
    const b = makeTask({ title: 'B' })
    useAppStore.setState({ tasks: [a, b], activeTaskId: a.id })
    useAppStore.getState().moveTask(b.id, 'done')
    expect(useAppStore.getState().finishPromptOpen).toBe(false)
  })
})

describe('persistence normalization', () => {
  it('migrateSettings maps legacy shortBreak and rejects bad values', () => {
    expect(migrateSettings({ work: 30, shortBreak: 7 })).toEqual({ work: 30, break: 7 })
    expect(migrateSettings({ work: 'x', break: NaN })).toEqual({ work: 25, break: 5 })
    expect(migrateSettings(null)).toEqual({ work: 25, break: 5 })
  })

  it('normalizeTask fills defaults and drops irrecoverable records', () => {
    expect(normalizeTask({ id: '1', title: 'T', status: 'bogus', timeLeft: 'x' })).toMatchObject({
      id: '1',
      title: 'T',
      status: 'todo',
      pomodorosCompleted: 0,
      timeLeft: null,
      focusTime: null,
    })
    expect(normalizeTask({ title: 'sin id' })).toBeNull()
    expect(normalizeTask('garbage')).toBeNull()
    expect(normalizeTask(null)).toBeNull()
  })

  it('normalizeSessionRecord fills defaults and drops records without id', () => {
    expect(normalizeSessionRecord({ id: 'r1' })).toEqual({
      id: 'r1',
      taskId: null,
      taskTitle: null,
      completedAt: 0,
      duration: 0,
    })
    expect(normalizeSessionRecord({ taskId: 'x' })).toBeNull()
  })
})

describe('restoreTimerState', () => {
  const settings = { work: 25, break: 5 }
  const now = 1_000_000_000

  it('returns defaults for garbage input', () => {
    const s = restoreTimerState('garbage', [], settings, now)
    expect(s).toMatchObject({
      timerMode: 'work',
      timerStatus: 'idle',
      endAt: null,
      timeLeft: 1500,
      breakTimeLeft: 300,
      sessionsCompleted: 0,
      activeTaskId: null,
    })
  })

  it('resumes a running session whose endAt is still in the future', () => {
    const task = makeTask()
    const s = restoreTimerState(
      { timerMode: 'work', timerStatus: 'running', endAt: now + 90_000, activeTaskId: task.id },
      [task],
      settings,
      now
    )
    expect(s.timerStatus).toBe('running')
    expect(s.endAt).toBe(now + 90_000)
    expect(s.timeLeft).toBe(90)
    expect(s.activeTaskId).toBe(task.id)
  })

  it('clamps an expired session to 00:00 idle without recording it', () => {
    const task = makeTask()
    const s = restoreTimerState(
      { timerMode: 'work', timerStatus: 'running', endAt: now - 1, activeTaskId: task.id },
      [task],
      settings,
      now
    )
    expect(s.timerStatus).toBe('idle')
    expect(s.endAt).toBeNull()
    expect(s.timeLeft).toBe(0)
  })

  it('forces idle when the persisted active task no longer exists', () => {
    const s = restoreTimerState(
      { timerMode: 'work', timerStatus: 'running', endAt: now + 90_000, activeTaskId: 'gone' },
      [],
      settings,
      now
    )
    expect(s.timerStatus).toBe('idle')
    expect(s.activeTaskId).toBeNull()
  })

  it('restores a paused break with its stored counter', () => {
    const s = restoreTimerState(
      { timerMode: 'break', timerStatus: 'paused', breakTimeLeft: 42 },
      [],
      settings,
      now
    )
    expect(s.timerMode).toBe('break')
    expect(s.timerStatus).toBe('paused')
    expect(s.breakTimeLeft).toBe(42)
    expect(s.endAt).toBeNull()
  })
})

describe('storage resilience', () => {
  it('actions do not throw when localStorage.setItem fails', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    try {
      expect(() => useAppStore.getState().addTask('sin espacio')).not.toThrow()
      expect(useAppStore.getState().tasks.some((t) => t.title === 'sin espacio')).toBe(true)
    } finally {
      spy.mockRestore()
    }
  })
})
