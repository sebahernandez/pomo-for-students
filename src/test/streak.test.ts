import { describe, it, expect } from 'vitest'
import {
  emptyStreak,
  todayKey,
  dayDiff,
  normalizeStreak,
  recordActivity,
  recomputeOnLoad,
  weekView,
  todayCount,
  DAILY_GOAL,
  type StreakState,
} from '../lib/streak'

// Fechas locales fijas para tests deterministas. Se construyen con el
// constructor local (año, mes, día, hora) para que todayKey las devuelva sin
// desfase de zona horaria.
const at = (y: number, m: number, d: number, h = 12): number =>
  new Date(y, m - 1, d, h, 0, 0).getTime()

// Completa un día entero (alcanza la meta) aplicando DAILY_GOAL sesiones.
const completeDay = (state: StreakState, now: number): StreakState => {
  let s = state
  for (let i = 0; i < DAILY_GOAL; i++) s = recordActivity(s, now)
  return s
}

describe('todayKey / dayDiff', () => {
  it('formatea la fecha local como YYYY-MM-DD', () => {
    expect(todayKey(at(2026, 9, 1))).toBe('2026-09-01')
    expect(todayKey(at(2026, 12, 25))).toBe('2026-12-25')
  })

  it('cuenta días consecutivos y cruces de mes', () => {
    expect(dayDiff('2026-09-02', '2026-09-01')).toBe(1)
    expect(dayDiff('2026-10-01', '2026-09-30')).toBe(1)
    expect(dayDiff('2026-09-01', '2026-09-01')).toBe(0)
    expect(dayDiff('2026-09-05', '2026-09-01')).toBe(4)
  })
})

describe('recordActivity — meta diaria', () => {
  it('no marca el día ni cambia la racha por debajo de la meta', () => {
    let s = emptyStreak()
    for (let i = 0; i < DAILY_GOAL - 1; i++) s = recordActivity(s, at(2026, 9, 1))
    expect(s.currentStreak).toBe(0)
    expect(s.lastActiveDate).toBeNull()
    expect(todayCount(s, at(2026, 9, 1))).toBe(DAILY_GOAL - 1)
  })

  it('marca el día y arranca la racha en 1 al alcanzar la meta', () => {
    const s = completeDay(emptyStreak(), at(2026, 9, 1))
    expect(s.currentStreak).toBe(1)
    expect(s.longestStreak).toBe(1)
    expect(s.lastActiveDate).toBe('2026-09-01')
    expect(todayCount(s, at(2026, 9, 1))).toBe(DAILY_GOAL)
  })

  it('no cambia la racha con sesiones adicionales tras la meta', () => {
    let s = completeDay(emptyStreak(), at(2026, 9, 1))
    s = recordActivity(s, at(2026, 9, 1)) // sexta
    s = recordActivity(s, at(2026, 9, 1)) // séptima
    expect(s.currentStreak).toBe(1)
    expect(todayCount(s, at(2026, 9, 1))).toBe(DAILY_GOAL + 2)
  })

  it('incrementa en días consecutivos que cumplen la meta', () => {
    let s = completeDay(emptyStreak(), at(2026, 9, 1))
    s = completeDay(s, at(2026, 9, 2))
    s = completeDay(s, at(2026, 9, 3))
    expect(s.currentStreak).toBe(3)
    expect(s.longestStreak).toBe(3)
  })

  it('un día que no llega a la meta rompe la racha', () => {
    let s = completeDay(emptyStreak(), at(2026, 9, 1))
    s = completeDay(s, at(2026, 9, 2)) // racha = 2
    // Día 3: solo algunas sesiones, sin alcanzar la meta.
    s = recordActivity(s, at(2026, 9, 3))
    expect(s.currentStreak).toBe(2)
    expect(s.lastActiveDate).toBe('2026-09-02')
    // Día 4 cumple la meta: no es contiguo al día 2 → reinicia a 1.
    s = completeDay(s, at(2026, 9, 4))
    expect(s.currentStreak).toBe(1)
  })

  it('reinicia a 1 tras un hueco de días', () => {
    let s = completeDay(emptyStreak(), at(2026, 9, 1))
    s = completeDay(s, at(2026, 9, 2))
    s = completeDay(s, at(2026, 9, 5)) // hueco: faltan 3 y 4
    expect(s.currentStreak).toBe(1)
  })

  it('conserva longestStreak tras romperse la racha', () => {
    let s = completeDay(emptyStreak(), at(2026, 9, 1))
    s = completeDay(s, at(2026, 9, 2))
    s = completeDay(s, at(2026, 9, 3)) // longest = 3
    s = completeDay(s, at(2026, 9, 10)) // se rompe → current 1
    expect(s.currentStreak).toBe(1)
    expect(s.longestStreak).toBe(3)
  })

  it('poda dailyCounts a las últimas 14 fechas', () => {
    let s = emptyStreak()
    for (let d = 1; d <= 20; d++) s = completeDay(s, at(2026, 9, d))
    const keys = Object.keys(s.dailyCounts).sort()
    expect(keys).toHaveLength(14)
    expect(keys[0]).toBe('2026-09-07')
    expect(keys[13]).toBe('2026-09-20')
    expect(s.currentStreak).toBe(20)
  })
})

describe('recomputeOnLoad', () => {
  it('conserva la racha si el último día cumplido es hoy', () => {
    const base = completeDay(emptyStreak(), at(2026, 9, 1))
    expect(recomputeOnLoad(base, at(2026, 9, 1, 20)).currentStreak).toBe(1)
  })

  it('conserva la racha si el último día cumplido fue ayer', () => {
    const base = completeDay(emptyStreak(), at(2026, 9, 1))
    expect(recomputeOnLoad(base, at(2026, 9, 2)).currentStreak).toBe(1)
  })

  it('cae a 0 tras más de un día inactivo, preservando el récord', () => {
    let base = completeDay(emptyStreak(), at(2026, 9, 1))
    base = completeDay(base, at(2026, 9, 2)) // current/longest = 2
    const loaded = recomputeOnLoad(base, at(2026, 9, 5))
    expect(loaded.currentStreak).toBe(0)
    expect(loaded.longestStreak).toBe(2)
  })

  it('es inocuo con estado vacío', () => {
    expect(recomputeOnLoad(emptyStreak(), at(2026, 9, 1))).toEqual(emptyStreak())
  })
})

describe('weekView', () => {
  it('devuelve Lun→Dom con count/done y marca el día de hoy', () => {
    // 2026-09-01 es martes; su semana va del lunes 2026-08-31 al domingo 2026-09-06.
    const state: StreakState = {
      currentStreak: 2,
      longestStreak: 2,
      lastActiveDate: '2026-09-01',
      dailyCounts: { '2026-08-31': DAILY_GOAL, '2026-09-01': DAILY_GOAL, '2026-09-02': 2 },
    }
    const week = weekView(state, at(2026, 9, 1))
    expect(week).toHaveLength(7)
    expect(week[0].date).toBe('2026-08-31')
    expect(week[6].date).toBe('2026-09-06')
    expect(week[0].done).toBe(true) // lunes, meta cumplida
    expect(week[1].done).toBe(true) // martes, meta cumplida
    expect(week[2].done).toBe(false) // miércoles, 2 < meta
    expect(week[2].count).toBe(2)
    expect(week[1].isToday).toBe(true)
    expect(week.filter((d) => d.isToday)).toHaveLength(1)
  })

  it('trata el domingo como fin de la semana en curso, no inicio', () => {
    // 2026-09-06 es domingo; debe caer en la última casilla.
    const week = weekView(emptyStreak(), at(2026, 9, 6))
    expect(week[0].date).toBe('2026-08-31')
    expect(week[6].date).toBe('2026-09-06')
    expect(week[6].isToday).toBe(true)
  })
})

describe('normalizeStreak', () => {
  it('devuelve estado vacío ante datos nulos o no-objeto', () => {
    expect(normalizeStreak(null)).toEqual(emptyStreak())
    expect(normalizeStreak('corrupto')).toEqual(emptyStreak())
    expect(normalizeStreak(42)).toEqual(emptyStreak())
  })

  it('sanea dailyCounts: descarta fechas y valores inválidos', () => {
    const s = normalizeStreak({
      currentStreak: 3,
      longestStreak: 5,
      lastActiveDate: '2026-09-03',
      dailyCounts: { '2026-09-03': 5, '2026-09-01': 2, 'no-fecha': 4, '2026-09-02': -1, '2026-09-04': 'x' },
    })
    expect(s.currentStreak).toBe(3)
    expect(s.longestStreak).toBe(5)
    expect(s.lastActiveDate).toBe('2026-09-03')
    expect(s.dailyCounts).toEqual({ '2026-09-01': 2, '2026-09-03': 5 })
  })

  it('migra el formato antiguo activeDays[] asumiendo meta cumplida', () => {
    const s = normalizeStreak({
      currentStreak: 2,
      longestStreak: 2,
      lastActiveDate: '2026-09-02',
      activeDays: ['2026-09-01', '2026-09-02'],
    })
    expect(s.dailyCounts).toEqual({ '2026-09-01': DAILY_GOAL, '2026-09-02': DAILY_GOAL })
    expect(s.currentStreak).toBe(2)
  })

  it('sanea números negativos o no finitos y lastActiveDate inválido', () => {
    const s = normalizeStreak({
      currentStreak: -4,
      longestStreak: Number.NaN,
      lastActiveDate: 'ayer',
      dailyCounts: 'no-objeto',
    })
    expect(s.currentStreak).toBe(0)
    expect(s.longestStreak).toBe(0)
    expect(s.lastActiveDate).toBeNull()
    expect(s.dailyCounts).toEqual({})
  })
})
