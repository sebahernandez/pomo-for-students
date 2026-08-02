## Context

Ver `proposal.md` (Why). Estado actual en `AppContext`:

```
resetTimer: () =>
  set((state) => {
    const d = getDurations(state.settings)
    return { timeLeft: d[state.timerMode], timerStatus: 'idle' }
  }),
```

`resetTimer` solo toca `timeLeft` global; nunca escribe `task.timeLeft`. La tarjeta Kanban muestra `task.timeLeft` (persistido en `localStorage` vía `saveTasks`), por lo que tras Reiniciar la tarjeta queda desincronizada y `switchActiveTask` restaura el valor viejo. La duración por tarea vive en `task.focusTime` (minutos); ya se usa así en `switchActiveTask` (`newTimeLeft = focusTime * 60`).

## Goals / Non-Goals

**Goals:**
- Reiniciar en Enfoque con tarea activa reinicia también `task.timeLeft` y lo persiste, dejando tarjeta y temporizador iguales.
- El destino del reinicio en Enfoque es la duración de la tarea activa (`focusTime`), no el default global.

**Non-Goals:**
- No cambiar el reinicio de descansos ni el caso sin tarea activa.
- No tocar historial, creación/movimiento de tareas ni el marcado de `TimerCard`/`Card`.

## Decisions

### 1. `resetTimer` bifurca por modo y tarea activa

En modo `work` con `activeTaskId`: calcular `mins = activeTask.focusTime ?? settings.work`, `newTimeLeft = mins * 60`, escribir `timeLeft: newTimeLeft`, `timerStatus: 'idle'`, y persistir `task.timeLeft = newTimeLeft` en la tarea activa vía `saveTasks` (mismo patrón que `saveTaskTime`/`switchActiveTask`). En descansos o sin tarea activa: comportamiento actual (`timeLeft = d[mode]`, idle), sin tocar tareas.

- **Alternativa descartada**: reiniciar al default global `settings.work` también en Enfoque. Se descartó porque el temporizador depende de la tarjeta activa: reiniciar debe volver a la duración de esa tarea, no a 25 min genéricos.

### 2. Reutilizar el helper de persistencia existente

Escribir la tarea con el mismo `saveTasks(tasks)` que ya usan `switchActiveTask` y `saveTaskTime`, para mantener una sola vía de persistencia y que el cambio sobreviva a recargas.

## Risks / Trade-offs

- [Si una tarea tenía tiempo parcial guardado, Reiniciar lo descarta] → Es justo el comportamiento esperado de "reiniciar"; el usuario lo invoca deliberadamente.
- [Divergencia con el tope de 120 min de la edición en vivo del `MM:SS`] → No aplica: el reinicio parte de `focusTime`, ya validado por su propio selector; `resetTimer` no reintroduce edición.
