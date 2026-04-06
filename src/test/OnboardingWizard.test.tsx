import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { OnboardingWizard } from '../components/OnboardingWizard'

describe('OnboardingWizard', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.restoreAllMocks()
  })

  it('should show wizard when localStorage has no onboarding flag', async () => {
    render(<OnboardingWizard />)
    
    await waitFor(() => {
      expect(screen.getByText(/Bienvenido a Pomodoro/i)).toBeInTheDocument()
    })
  })

  it('should NOT show wizard when localStorage has onboarding flag', async () => {
    window.localStorage.setItem('pomo-onboarded', 'true')
    
    render(<OnboardingWizard />)
    
    await waitFor(() => {
      expect(screen.queryByText(/Bienvenido a Pomodoro/i)).not.toBeInTheDocument()
    })
  })

  it('should close wizard and save flag to localStorage when clicking close button', async () => {
    const user = userEvent.setup()
    
    render(<OnboardingWizard />)
    
    await waitFor(() => {
      expect(screen.getByText(/Bienvenido a Pomodoro/i)).toBeInTheDocument()
    })
    
    for (let i = 0; i < 4; i++) {
      const nextButton = screen.getByRole('button', { name: /Siguiente|Next/i })
      await user.click(nextButton)
    }
    
    const closeButton = screen.getByRole('button', { name: /Comenzar|Start/i })
    await user.click(closeButton)
    
    await waitFor(() => {
      expect(screen.queryByText(/Bienvenido a Pomodoro/i)).not.toBeInTheDocument()
    })
    
    expect(window.localStorage.getItem('pomo-onboarded')).toBe('true')
  })

  it('should navigate through wizard steps', async () => {
    const user = userEvent.setup()
    
    render(<OnboardingWizard />)
    
    await waitFor(() => {
      expect(screen.getByText(/Bienvenido a Pomodoro/i)).toBeInTheDocument()
    })
    
    const nextButton = screen.getByRole('button', { name: /Siguiente|Next/i })
    await user.click(nextButton)
    
    await waitFor(() => {
      expect(screen.getByText(/El temporizador|The Timer/i)).toBeInTheDocument()
    })
    
    const prevButton = screen.getByRole('button', { name: /Anterior|Back/i })
    await user.click(prevButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Bienvenido a Pomodoro/i)).toBeInTheDocument()
    })
  })

  it('should persist localStorage flag after closing wizard', async () => {
    const user = userEvent.setup()
    
    render(<OnboardingWizard />)
    
    for (let i = 0; i < 4; i++) {
      const nextButton = screen.getByRole('button', { name: /Siguiente|Next/i })
      await user.click(nextButton)
    }
    
    const closeButton = screen.getByRole('button', { name: /Comenzar|Start/i })
    await user.click(closeButton)
    
    expect(window.localStorage.getItem('pomo-onboarded')).toBe('true')
    
    render(<OnboardingWizard />)
    
    await waitFor(() => {
      expect(screen.queryByText(/Bienvenido a Pomodoro/i)).not.toBeInTheDocument()
    })
  })
})
