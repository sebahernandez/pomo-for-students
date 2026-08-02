import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { TimerCard } from '../components/TimerCard'
import { useAppStore } from '../context/AppContext'

describe('TimerCard mode tabs', () => {
  beforeEach(() => {
    useAppStore.setState({
      settings: { work: 25, break: 5 },
      timerMode: 'work',
      timerStatus: 'idle',
      timeLeft: 25 * 60,
      breakTimeLeft: 5 * 60,
    })
  })

  it('renders the two modes as tabs with the current mode selected', () => {
    render(<TimerCard />)

    const tablist = screen.getByRole('tablist')
    const tabs = within(tablist).getAllByRole('tab')
    expect(tabs).toHaveLength(2)

    const focusTab = within(tablist).getByRole('tab', { name: 'Enfoque' })
    expect(focusTab).toHaveAttribute('aria-selected', 'true')
    expect(within(tablist).getByRole('tab', { name: 'Descanso' })).toHaveAttribute('aria-selected', 'false')
  })

  it('switching to the break tab loads its duration and leaves the timer idle', async () => {
    const user = userEvent.setup()
    render(<TimerCard />)

    await user.click(screen.getByRole('tab', { name: 'Descanso' }))

    const state = useAppStore.getState()
    expect(state.timerMode).toBe('break')
    expect(state.timerStatus).toBe('idle')
    expect(state.breakTimeLeft).toBe(5 * 60)

    expect(screen.getByRole('tab', { name: 'Descanso' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('05:00')).toBeInTheDocument()
  })
})
