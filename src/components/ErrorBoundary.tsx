import { Component, type ReactNode } from 'react'
import { safeRemoveItem } from '../lib/storage'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

const POMO_KEYS = [
  'pomo-settings',
  'pomo-tasks',
  'pomo-history',
  'pomo-timer',
  'pomo-dark',
  'pomo-lang',
  'pomo-theme',
]

// Textos estáticos bilingües: no se puede depender del store aquí, porque el
// store (o sus datos persistidos) puede ser justamente lo que falló.
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  handleReload = () => {
    window.location.reload()
  }

  handleReset = () => {
    POMO_KEYS.forEach(safeRemoveItem)
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-950 text-neutral-100">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-xl font-bold">Algo salió mal / Something went wrong</h1>
          <p className="text-sm text-neutral-400">
            Recarga la página para continuar. Si el problema persiste, restablece los datos
            guardados. / Reload the page to continue. If the problem persists, reset the saved
            data.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={this.handleReload}
              className="px-4 py-2 rounded-xl bg-white text-black text-sm font-medium"
            >
              Recargar / Reload
            </button>
            <button
              onClick={this.handleReset}
              className="px-4 py-2 rounded-xl border border-neutral-600 text-sm font-medium"
            >
              Restablecer datos / Reset data
            </button>
          </div>
        </div>
      </div>
    )
  }
}
