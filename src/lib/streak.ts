// Racha de días que alcanzan la meta diaria de sesiones de Enfoque. La lógica
// es pura: `now` (epoch ms) se inyecta siempre para que los tests sean
// deterministas y para no acoplar el cálculo a Date.now(). Las fechas se
// modelan como claves locales 'YYYY-MM-DD' para que "consecutivo" y "hoy/ayer"
// sean comparaciones simples, sin líos de zona horaria ni de medianoche.

// Un día cuenta para la racha solo cuando su conteo de pomodoros de Enfoque
// alcanza esta meta. Punto único de verdad: la UI la reutiliza para mostrar
// el progreso 'n/GOAL'.
export const DAILY_GOAL = 5

export interface StreakState {
  currentStreak: number
  longestStreak: number
  // Último día que ALCANZÓ la meta (no simplemente con actividad).
  lastActiveDate: string | null
  // Conteo de pomodoros de Enfoque por día ('YYYY-MM-DD' → nº de sesiones).
  dailyCounts: Record<string, number>
}

// Cuántas fechas se conservan en dailyCounts: la vista semanal solo necesita la
// semana actual y el cálculo solo mira lastActiveDate, así que se poda para no
// crecer sin límite en localStorage.
const ACTIVE_DAYS_LIMIT = 14

export const emptyStreak = (): StreakState => ({
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  dailyCounts: {},
})

// Clave de fecha local 'YYYY-MM-DD' (no UTC), para que el día coincida con el
// del reloj del usuario.
export const todayKey = (now: number): string => {
  const d = new Date(now)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// Diferencia en días calendario entre dos claves 'YYYY-MM-DD' (a - b). Se
// anclan a mediodía local para evitar que el horario de verano desplace el
// resultado en ±1.
export const dayDiff = (a: string, b: string): number => {
  const [ay, am, ad] = a.split('-').map(Number)
  const [by, bm, bd] = b.split('-').map(Number)
  const da = new Date(ay, am - 1, ad, 12, 0, 0).getTime()
  const db = new Date(by, bm - 1, bd, 12, 0, 0).getTime()
  return Math.round((da - db) / 86_400_000)
}

const isValidKey = (v: unknown): v is string =>
  typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)

const numOrZero = (v: unknown): number =>
  typeof v === 'number' && Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0

// Poda dailyCounts a las últimas ACTIVE_DAYS_LIMIT fechas (por orden de fecha).
const pruneCounts = (counts: Record<string, number>): Record<string, number> => {
  const keys = Object.keys(counts).sort()
  if (keys.length <= ACTIVE_DAYS_LIMIT) return counts
  const kept = keys.slice(-ACTIVE_DAYS_LIMIT)
  const out: Record<string, number> = {}
  for (const k of kept) out[k] = counts[k]
  return out
}

// Los datos persistidos pueden venir de versiones anteriores o estar corruptos;
// se normalizan con valores por defecto y se descartan los irrecuperables,
// mismo patrón que normalizeTask/normalizeSessionRecord del store.
export const normalizeStreak = (raw: unknown): StreakState => {
  if (typeof raw !== 'object' || raw === null) return emptyStreak()
  const r = raw as Record<string, unknown>

  let dailyCounts: Record<string, number> = {}
  if (typeof r.dailyCounts === 'object' && r.dailyCounts !== null) {
    for (const [k, v] of Object.entries(r.dailyCounts as Record<string, unknown>)) {
      if (isValidKey(k)) {
        const n = numOrZero(v)
        if (n > 0) dailyCounts[k] = n
      }
    }
  } else if (Array.isArray(r.activeDays)) {
    // Migración del formato antiguo (regla de ≥1 sesión): cada día previamente
    // activo se asume cumplido para no perder rachas ya conseguidas.
    for (const day of r.activeDays) {
      if (isValidKey(day)) dailyCounts[day] = DAILY_GOAL
    }
  }
  dailyCounts = pruneCounts(dailyCounts)

  return {
    currentStreak: numOrZero(r.currentStreak),
    longestStreak: numOrZero(r.longestStreak),
    lastActiveDate: isValidKey(r.lastActiveDate) ? r.lastActiveDate : null,
    dailyCounts,
  }
}

// Registra una sesión de Enfoque del día de `now`: incrementa el conteo del día
// y, SOLO cuando ese conteo cruza exactamente la meta (de GOAL-1 a GOAL),
// actualiza la racha (día contiguo al último cumplido → +1; hueco → reinicio a
// 1). Por debajo o por encima de la meta, solo cambia el conteo. Así la racha
// se actualiza como máximo una vez por día. longestStreak nunca decrece.
export const recordActivity = (state: StreakState, now: number): StreakState => {
  const today = todayKey(now)
  const prevCount = state.dailyCounts[today] ?? 0
  const newCount = prevCount + 1
  const dailyCounts = pruneCounts({ ...state.dailyCounts, [today]: newCount })

  // Solo el momento en que se ALCANZA la meta dispara el cálculo de racha.
  if (newCount !== DAILY_GOAL) {
    return { ...state, dailyCounts }
  }

  const consecutive = state.lastActiveDate !== null && dayDiff(today, state.lastActiveDate) === 1
  const currentStreak = consecutive ? state.currentStreak + 1 : 1
  return {
    currentStreak,
    longestStreak: Math.max(state.longestStreak, currentStreak),
    lastActiveDate: today,
    dailyCounts,
  }
}

// Al cargar la app: si el último día cumplido no es hoy ni ayer, la racha se
// rompió mientras la app estaba cerrada; la racha actual cae a 0 pero el récord
// se conserva.
export const recomputeOnLoad = (state: StreakState, now: number): StreakState => {
  if (state.lastActiveDate === null) return state
  const gap = dayDiff(todayKey(now), state.lastActiveDate)
  if (gap <= 1) return state
  return { ...state, currentStreak: 0 }
}

// Conteo de pomodoros de Enfoque del día de `now`.
export const todayCount = (state: StreakState, now: number): number =>
  state.dailyCounts[todayKey(now)] ?? 0

export interface WeekDay {
  date: string
  count: number
  done: boolean
  isToday: boolean
}

// Los 7 días de la semana en curso, de lunes a domingo, con su conteo y si
// alcanzaron la meta.
export const weekView = (state: StreakState, now: number): WeekDay[] => {
  const today = todayKey(now)
  const d = new Date(now)
  // getDay(): 0=domingo..6=sábado. Retrocedemos hasta el lunes de esta semana.
  const dow = d.getDay()
  const backToMonday = dow === 0 ? 6 : dow - 1
  const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() - backToMonday, 12, 0, 0)
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i, 12, 0, 0)
    const date = todayKey(day.getTime())
    const count = state.dailyCounts[date] ?? 0
    return { date, count, done: count >= DAILY_GOAL, isToday: date === today }
  })
}
