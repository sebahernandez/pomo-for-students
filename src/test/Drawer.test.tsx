import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { Drawer } from '../components/Drawer'
import { SettingsPanel } from '../components/SettingsPanel'
import { SessionHistory } from '../components/SessionHistory'
import { GuideModal } from '../components/GuideModal'
import { useAppStore } from '../context/AppContext'

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

    await user.click(screen.getByRole('button', { name: /close|cerrar/i }))
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

  it('SettingsPanel closes after saving', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<SettingsPanel onClose={onClose} />)

    await user.click(screen.getByRole('button', { name: 'Guardar' }))

    // Saving applies the change and closes the drawer.
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('SettingsPanel closes when Cancel is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<SettingsPanel onClose={onClose} />)

    await user.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('SettingsPanel keeps the previous value when a field is saved empty', async () => {
    const user = userEvent.setup()
    useAppStore.setState({ settings: { work: 25, break: 5 } })
    render(<SettingsPanel onClose={vi.fn()} />)

    const workInput = screen.getByLabelText('Enfoque (min)') as HTMLInputElement
    await user.clear(workInput)
    await user.click(screen.getByRole('button', { name: 'Guardar' }))

    // Empty input must not persist 0/NaN; the previous value is retained.
    expect(useAppStore.getState().settings.work).toBe(25)
    expect(workInput.value).toBe('25')
  })

  it('SettingsPanel clamps an out-of-range value to the field limit on save', async () => {
    const user = userEvent.setup()
    useAppStore.setState({ settings: { work: 25, break: 5 } })
    render(<SettingsPanel onClose={vi.fn()} />)

    const workInput = screen.getByLabelText('Enfoque (min)') as HTMLInputElement
    await user.clear(workInput)
    await user.type(workInput, '999')
    await user.click(screen.getByRole('button', { name: 'Guardar' }))

    // Focus max is 60; the value is clamped and reflected back into the input.
    expect(useAppStore.getState().settings.work).toBe(60)
    expect(workInput.value).toBe('60')
  })

  it('SettingsPanel persists valid values and closes the drawer on save', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    useAppStore.setState({ settings: { work: 25, break: 5 } })
    render(<SettingsPanel onClose={onClose} />)

    const workInput = screen.getByLabelText('Enfoque (min)') as HTMLInputElement
    await user.clear(workInput)
    await user.type(workInput, '30')
    await user.click(screen.getByRole('button', { name: 'Guardar' }))

    const state = useAppStore.getState()
    expect(state.settings.work).toBe(30)
    // Saving reloads the current mode timer (work) to the new duration in seconds.
    expect(state.timeLeft).toBe(30 * 60)
    // Saving closes the drawer.
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('SettingsPanel blocks passive close and warns when there are unsaved changes', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    useAppStore.setState({ settings: { work: 25, break: 5 } })
    render(<SettingsPanel onClose={onClose} />)

    const workInput = screen.getByLabelText('Enfoque (min)') as HTMLInputElement
    await user.clear(workInput)
    await user.type(workInput, '40')

    // Escape must not close the drawer while there are unsaved changes.
    await user.keyboard('{Escape}')
    expect(onClose).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toHaveTextContent(/cambios sin guardar/i)

    // The X close button is likewise guarded.
    await user.click(screen.getByRole('button', { name: /close|cerrar/i }))
    expect(onClose).not.toHaveBeenCalled()

    // The scrim is likewise guarded.
    const scrim = screen.getByRole('dialog').parentElement as HTMLElement
    await user.click(scrim)
    expect(onClose).not.toHaveBeenCalled()
  })

  it('SettingsPanel closes via scrim when there are no unsaved changes', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    useAppStore.setState({ settings: { work: 25, break: 5 } })
    render(<SettingsPanel onClose={onClose} />)

    const scrim = screen.getByRole('dialog').parentElement as HTMLElement
    await user.click(scrim)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('SettingsPanel cancels and discards when there are unsaved changes', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    useAppStore.setState({ settings: { work: 25, break: 5 } })
    render(<SettingsPanel onClose={onClose} />)

    const workInput = screen.getByLabelText('Enfoque (min)') as HTMLInputElement
    await user.clear(workInput)
    await user.type(workInput, '40')

    // Cancel bypasses the guard and exits without persisting the edit.
    await user.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(useAppStore.getState().settings.work).toBe(25)
  })

  it('SettingsPanel treats a theme change as unsaved and blocks passive close', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    useAppStore.setState({ theme: 'neutral' })
    render(<SettingsPanel onClose={onClose} />)

    await user.click(screen.getByRole('button', { name: /ocean/i }))
    expect(useAppStore.getState().theme).toBe('ocean')

    // Escape must not close the drawer after a live theme change.
    await user.keyboard('{Escape}')
    expect(onClose).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toHaveTextContent(/cambios sin guardar/i)
  })

  it('SettingsPanel reverts the previewed theme when Cancel is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    useAppStore.setState({ theme: 'neutral' })
    render(<SettingsPanel onClose={onClose} />)

    await user.click(screen.getByRole('button', { name: /ocean/i }))
    expect(useAppStore.getState().theme).toBe('ocean')

    await user.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(onClose).toHaveBeenCalledTimes(1)
    // Cancel discards the preview, restoring the theme active when the panel opened.
    expect(useAppStore.getState().theme).toBe('neutral')
  })

  it('SettingsPanel keeps the selected theme when saving', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    useAppStore.setState({ theme: 'neutral' })
    render(<SettingsPanel onClose={onClose} />)

    await user.click(screen.getByRole('button', { name: /ocean/i }))
    await user.click(screen.getByRole('button', { name: 'Guardar' }))

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(useAppStore.getState().theme).toBe('ocean')
  })

  it('SessionHistory opens as a drawer and closes via the close button', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<SessionHistory onClose={onClose} />)

    expect(screen.getByRole('dialog', { name: 'Historial de Sesiones' })).toBeInTheDocument()
    // Con el aria-label traducido, la X y el botón del pie comparten nombre
    // accesible ("Cerrar"); ambos cierran el panel.
    await user.click(screen.getAllByRole('button', { name: /close|cerrar/i })[0])
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
