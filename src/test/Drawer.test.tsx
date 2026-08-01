import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { Drawer } from '../components/Drawer'
import { SettingsPanel } from '../components/SettingsPanel'
import { SessionHistory } from '../components/SessionHistory'
import { GuideModal } from '../components/GuideModal'

describe('Drawer', () => {
  it('renders its children inside a labelled dialog', () => {
    render(<Drawer onClose={() => {}} title="My Panel"><p>Hello content</p></Drawer>)

    const dialog = screen.getByRole('dialog', { name: 'My Panel' })
    expect(dialog).toBeInTheDocument()
    expect(screen.getByText('Hello content')).toBeInTheDocument()
  })

  it('closes when the close button is activated', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Drawer onClose={onClose} title="P"><p>x</p></Drawer>)

    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes when the scrim is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Drawer onClose={onClose} title="P"><p>x</p></Drawer>)

    const scrim = screen.getByRole('dialog').parentElement as HTMLElement
    await user.click(scrim)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not close when clicking inside the panel', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Drawer onClose={onClose} title="P"><p>inside the panel</p></Drawer>)

    await user.click(screen.getByText('inside the panel'))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('closes when the Escape key is pressed', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Drawer onClose={onClose} title="P"><p>x</p></Drawer>)

    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})

describe('Panels presented as drawers', () => {
  it('SettingsPanel opens as a drawer and closes on Escape', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<SettingsPanel onClose={onClose} />)

    expect(screen.getByRole('dialog', { name: 'Configuración' })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('SettingsPanel stays open after saving (apply does not close)', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<SettingsPanel onClose={onClose} />)

    await user.click(screen.getByRole('button', { name: 'Guardar' }))

    // Applying the change must NOT close the drawer.
    expect(onClose).not.toHaveBeenCalled()
    expect(screen.getByRole('dialog', { name: 'Configuración' })).toBeInTheDocument()
  })

  it('SettingsPanel closes when Cancel is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<SettingsPanel onClose={onClose} />)

    await user.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('SessionHistory opens as a drawer and closes via the close button', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<SessionHistory onClose={onClose} />)

    expect(screen.getByRole('dialog', { name: 'Historial de Sesiones' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('GuideModal opens as a drawer and shows guide content', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<GuideModal onClose={onClose} />)

    expect(screen.getByRole('dialog', { name: 'Guía de Uso' })).toBeInTheDocument()
    expect(screen.getByText('Elige tu modo')).toBeInTheDocument()

    const scrim = screen.getByRole('dialog').parentElement as HTMLElement
    await user.click(scrim)
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
