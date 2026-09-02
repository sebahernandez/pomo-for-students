## Context

Ver `proposal.md` (Why). La racha (`weekly-streak`) suma actividad en `recordActivity` (src/lib/streak.ts), invocado hasta ahora solo desde `incrementSessions` (fin de un pomodoro de Enfoque). Mover una tarea a "Hecho" ocurre en `moveTask` (src/context/AppContext.tsx), que no tocaba la racha.

## Goals / Non-Goals

**Goals:**
- Que completar una tarea sume al conteo diario igual que un pomodoro, reutilizando `recordActivity` sin cambiar su firma.
- Evitar doble conteo al re-marcar una tarea ya "Hecha".

**Non-Goals:**
- Retroactividad sobre tareas ya "Hechas" antes del cambio.
- Cambiar la meta diaria (sigue en 5) ni el modelo de datos (`dailyCounts`).

## Decisions

### Contar solo la transición entrante a "Hecho"
En `moveTask` se calcula `wasDone = tarea.status === 'done'` antes de aplicar el cambio. Solo si `status === 'done' && !wasDone` se llama a `recordActivity(state.streak, Date.now())` y `saveStreak`. Alternativa descartada: contar cualquier `moveTask(id, 'done')`, que inflaría el conteo al re-arrastrar una tarjeta ya hecha.

### Reutilizar la lógica pura existente
No se toca `streak.ts`: la fuente (pomodoro o tarea) es indiferente para `recordActivity`, que solo incrementa el conteo del día y evalúa la meta. Un único punto de verdad para la regla de racha.

## Risks / Trade-offs

- **Inflado por mover tareas triviales a Hecho** → El usuario podría crear tareas vacías y arrastrarlas para subir la racha. Aceptado: es una app de estudio personal, sin antifraude; la transición-entrante evita el caso más obvio (re-arrastrar la misma).
- **No retroactivo** → Las tareas ya "Hechas" no cuentan; puede sorprender, pero recalcularlas requeriría historial de transiciones que no se guarda. Documentado en la propuesta.
