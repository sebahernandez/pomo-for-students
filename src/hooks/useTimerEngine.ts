import { useEffect } from 'react'
import { useAppStore } from '../context/AppContext'
import { playCompletionSound } from '../lib/audio'

// Motor único del temporizador, montado una sola vez desde App. La cuenta se
// recomputa desde endAt en cada tick (no se decrementa), así que el intervalo
// solo afecta la fluidez del display: el estrangulamiento del navegador en
// pestañas en segundo plano no atrasa el timer, y los intervalos duplicados de
// StrictMode son inofensivos (completeTimer es no-op si no está corriendo).
export function useTimerEngine() {
  const timerStatus = useAppStore((s) => s.timerStatus)

  useEffect(() => {
    if (timerStatus !== 'running') return

    const tick = () => {
      const store = useAppStore.getState()
      store.tick()
      const s = useAppStore.getState()
      const shown = s.timerMode === 'work' ? s.timeLeft : s.breakTimeLeft
      if (s.timerStatus === 'running' && shown === 0) {
        playCompletionSound()
        s.completeTimer()
      }
    }

    const id = setInterval(tick, 500)
    // Al volver de segundo plano se reconcilia de inmediato; al ocultarse o
    // descargarse la página se persiste el tiempo de la tarea activa.
    const onVisibilityChange = () => {
      if (document.hidden) useAppStore.getState().saveTaskTime()
      else tick()
    }
    const onPageHide = () => useAppStore.getState().saveTaskTime()
    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('focus', tick)
    window.addEventListener('pagehide', onPageHide)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('focus', tick)
      window.removeEventListener('pagehide', onPageHide)
    }
  }, [timerStatus])
}
