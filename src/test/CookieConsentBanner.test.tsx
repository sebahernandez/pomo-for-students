import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { CookieConsentBanner } from '../components/CookieConsentBanner'

const getAllCookies = () => {
  return document.cookie.split(';').filter(c => c.trim())
}

const clearCookies = () => {
  document.cookie.split(';').forEach(c => {
    const [name] = c.split('=')
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
  })
}

describe('CookieConsentBanner', () => {
  beforeEach(() => {
    clearCookies()
    vi.restoreAllMocks()
  })

  it('should show banner when cookie consent flag is not set', async () => {
    render(<CookieConsentBanner />)
    
    await waitFor(() => {
      expect(screen.getByText(/utilizamos cookies|we use cookies/i)).toBeInTheDocument()
    })
  })

  it('should NOT show banner when cookie consent is accepted', async () => {
    document.cookie = 'pomo-cookie-consent=accepted'
    
    render(<CookieConsentBanner />)
    
    await waitFor(() => {
      expect(screen.queryByText(/utilizamos cookies/i)).not.toBeInTheDocument()
    })
  })

  it('should NOT show banner when cookie consent is rejected', async () => {
    document.cookie = 'pomo-cookie-consent=rejected'
    
    render(<CookieConsentBanner />)
    
    await waitFor(() => {
      expect(screen.queryByText(/utilizamos cookies/i)).not.toBeInTheDocument()
    })
  })

  it('should hide banner and set cookie when Accept button is clicked', async () => {
    const user = userEvent.setup()
    
    render(<CookieConsentBanner />)
    
    const acceptButton = screen.getByRole('button', { name: /Aceptar|Accept/i })
    await user.click(acceptButton)
    
    await waitFor(() => {
      expect(screen.queryByText(/utilizamos cookies/i)).not.toBeInTheDocument()
    })
    
    const cookies = getAllCookies()
    expect(cookies.some(c => c.includes('pomo-cookie-consent=accepted'))).toBe(true)
  })

  it('should hide banner and set cookie when Reject button is clicked', async () => {
    const user = userEvent.setup()
    
    render(<CookieConsentBanner />)
    
    const rejectButton = screen.getByRole('button', { name: /Rechazar|Reject/i })
    await user.click(rejectButton)
    
    await waitFor(() => {
      expect(screen.queryByText(/utilizamos cookies/i)).not.toBeInTheDocument()
    })
    
    const cookies = getAllCookies()
    expect(cookies.some(c => c.includes('pomo-cookie-consent=rejected'))).toBe(true)
  })

  it('should persist cookie flag after accepting', async () => {
    const user = userEvent.setup()
    
    render(<CookieConsentBanner />)
    
    const acceptButton = screen.getByRole('button', { name: /Aceptar|Accept/i })
    await user.click(acceptButton)
    
    const cookies = getAllCookies()
    expect(cookies.some(c => c.includes('pomo-cookie-consent=accepted'))).toBe(true)
    
    render(<CookieConsentBanner />)
    
    await waitFor(() => {
      expect(screen.queryByText(/utilizamos cookies/i)).not.toBeInTheDocument()
    })
  })

  it('should persist cookie flag after rejecting', async () => {
    const user = userEvent.setup()
    
    render(<CookieConsentBanner />)
    
    const rejectButton = screen.getByRole('button', { name: /Rechazar|Reject/i })
    await user.click(rejectButton)
    
    const cookies = getAllCookies()
    expect(cookies.some(c => c.includes('pomo-cookie-consent=rejected'))).toBe(true)
    
    render(<CookieConsentBanner />)
    
    await waitFor(() => {
      expect(screen.queryByText(/utilizamos cookies/i)).not.toBeInTheDocument()
    })
  })
})
