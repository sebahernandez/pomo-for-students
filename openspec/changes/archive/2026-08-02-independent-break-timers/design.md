## Context

Ver `proposal.md` (Why). Estado actual en `AppContext` y `TimerCard`:

- Hay un único `timeLeft` global que sirve tanto a Enfoque como a los descansos. `setTimerMode(mode)` lo sobrescribe con `d[mode]`.
- El tick (en `TimerCard`) hace `timeLeft -= 1` y llama `saveTaskTime()` cada segundo, **sin importar el modo**. `saveTaskTime` escribe `timeLeft` en `task.timeLeft` de la tarea activa.
- Resultado: correr un descanso decrementa el `timeLeft` compartido y lo persiste en la tarea activa → el descanso "roba" tiempo a la tarjeta (bug reportado).

La fuente de verdad del enfoque por tarea ya es `task.timeLeft` (persistido) y se restaura vía `switchActiveTask`.

## Goals / Non-Goals

**Goals:**
- Descansos con cuenta regresiva propia que jamás modifica el `timeLeft` de Enfoque ni el `task.timeLeft` de ninguna tarea.
- Atajo "Tomar descanso" en la tarjeta de la tarea en curso que inicia un Descanso Corto aislado.

**Non-Goals:**
- No cambiar la regla de que Enfoque requiere tarea activa, ni el historial, ni el flujo de completar sesiones.
- No preservar el valor de un descanso a medias al navegar entre pestañas (al (re)entrar a un descanso, su cuenta parte llena). Lo que se preserva es el tiempo del enfoque.
- No añadir Descanso Largo a la tarjeta (sigue en las pestañas del temporizador).

## Decisions

### 1. Cuenta de descanso separada: `breakTimeLeft`

Añadir `breakTimeLeft` al estado, independiente de `timeLeft`. `timeLeft` pasa a representar solo el Enfoque (ligado a la tarea activa); `breakTimeLeft` representa el descanso vigente.

- **Alternativa descartada**: seguir con un único `timeLeft` y solo guardar/restaurar la tarea en cada cambio de modo. Se descartó porque mantiene enfoque y descanso acoplados en una variable (fuente del bug) y complica cada transición; separar los estados hace la independencia estructural, no defensiva.

### 2. Selección por modo en render, tick, reset y edición

- **Render/progreso (`TimerCard`)**: `isBreak = timerMode !== 'work'`; el tiempo mostrado y el progreso usan `breakTimeLeft`/duración del descanso cuando `isBreak`, y `timeLeft`/duración de la tarea cuando Enfoque.
- **Tick**: en `work` decrementa `timeLeft` y llama `saveTaskTime()`; en descanso decrementa `breakTimeLeft` y **no** persiste tareas. La detección de fin (0s) usa la cuenta del modo actual. El efecto añade `breakTimeLeft` a sus dependencias.
- **`setTimerMode`**: a un descanso → `breakTimeLeft = d[mode]`, `idle`, sin tocar `timeLeft`. A `work` → `idle`, sin tocar `timeLeft` (conserva el tiempo de la tarea activa; ya no lo resetea a `d.work`).
- **`resetTimer`**: en descanso → `breakTimeLeft = d[mode]`, `idle`, sin tocar tareas; en `work` se conserva la lógica actual (tarea activa / default).
- **Edición en vivo**: en descanso edita `breakTimeLeft` (los descansos son libres); en Enfoque, la lógica actual (requiere tarea activa, persiste en la tarea).

### 3. `saveTaskTime` solo en Enfoque

Guardar `if (state.timerMode !== 'work') return {}` en `saveTaskTime`, como red de seguridad además de que el tick ya no lo invoca en descanso.

### 4. Atajo "Tomar descanso" en la tarjeta

Nueva acción de store `takeShortBreak()`: aplica las clases de fondo del modo, fija `timerMode = 'shortBreak'`, `breakTimeLeft = d.shortBreak`, `timerStatus = 'running'`; no toca `timeLeft` ni tareas. En `Card` (columna En Progreso) se añade un botón "Tomar descanso" que la invoca. Funciona igual con la sesión pausada o en marcha (arranca el descanso aislado); el enfoque de la tarea queda tal cual, disponible al volver a Enfoque.

## Risks / Trade-offs

- [Al completar una sesión de Enfoque, `timeLeft` queda en 0 y al volver de un descanso el Enfoque muestra 0:00] → Comportamiento preexistente del ciclo de completado; se resuelve con Reiniciar (que ya restaura el `focusTime` de la tarea). Fuera de alcance.
- [Un descanso a medias se reinicia al re-entrar por pestañas] → Decisión explícita (Non-Goal); lo relevante es que el enfoque no se altera.
- [Nuevo estado `breakTimeLeft` debe inicializarse] → Se inicializa a `d.shortBreak` al crear el store; el modo por defecto es Enfoque, así que su valor inicial no afecta el arranque.

## Migration Plan

Cambio de estado en cliente sin datos nuevos persistidos (breakTimeLeft es efímero, no se guarda en `localStorage`). Sin migración de datos. Rollback = revertir el commit.
