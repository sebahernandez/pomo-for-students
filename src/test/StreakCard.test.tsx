import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StreakCard } from '../components/StreakCard'
import { useAppStore } from '../context/AppContext'
import { DAILY_GOAL, todayKey } from '../lib/streak'

const initialState = useAppStore.getState()

beforeEach(() => {
  useAppStore.setState(initialState, true)
})

describe('StreakCard', () => {
  it('muestra la racha, la fila de 7 días y el progreso del día hacia la meta', () => {
    const today = todayKey(Date.now())
    useAppStore.setState({
      language: 'es',
      streak: {
        currentStreak: 4,
        longestStreak: 9,
        lastActiveDate: '2026-08-31',
        dailyCounts: { [today]: 3 },
      },
    })

    const { container } = render(<StreakCard />)

    // Racha actual visible con su etiqueta.
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText(/racha/i)).toBeInTheDocument()

    // Progreso del día: 3 de la meta.
    expect(screen.getByText(/hoy/i)).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText(new RegExp(`/${DAILY_GOAL}`))).toBeInTheDocument()

    // Siete casillas de día (una por columna de la semana).
    const dayCells = container.querySelectorAll('.rounded-full')
    // 7 círculos de día + 1 barra de progreso (contenedor) + su relleno.
    expect(dayCells.length).toBeGreaterThanOrEqual(7)
  })

  it('renderiza etiquetas y textos en inglés según el idioma activo', () => {
    useAppStore.setState({
      language: 'en',
      streak: { currentStreak: 0, longestStreak: 0, lastActiveDate: null, dailyCounts: {} },
    })

    render(<StreakCard />)
    expect(screen.getByText(/streak/i)).toBeInTheDocument()
    expect(screen.getByText(/today/i)).toBeInTheDocument()
    // El lunes en inglés abrevia como "Mon".
    expect(screen.getByText('Mon')).toBeInTheDocument()
  })
})
