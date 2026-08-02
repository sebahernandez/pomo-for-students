## Context

Ver `proposal.md` (sección Why) para la motivación. Estado actual relevante:

- `TimerCard` lee del store `startTimer`/`pauseTimer`/`resetTimer` y opera el temporizador sin considerar `activeTaskId`. Su botón principal se elige por `timerStatus` (`idle` → Iniciar, `running` → Pausar, `paused` → Reanudar).
- `Card` (Kanban) tiene su propia lógica `handleToggleFocus`: si la tarjeta no es la activa → `switchActiveTask(id)` + `startTimer()`; si es la activa → `pauseTimer()`/`startTimer()` según `isRunning`.
- El store (`AppContext`) ya persiste el tiempo por tarea (`saveTaskTime`, `switchActiveTask`) y expone `activeTaskId` y `timerStatus`. `startTimer` hoy solo hace `set({ timerStatus: 'running' })` sin ninguna guarda.

La lógica de "qué significa enfocar" ya existe en `Card.handleToggleFocus`; el trabajo es (a) impedir enfoque sin tarea activa y (b) replicar ese control en el temporizador de forma sincronizada.

## Goals / Non-Goals

**Goals:**
- El modo Enfoque no puede correr sin tarea activa; el control del temporizador lo refleja (deshabilitado + aviso).
- El botón principal del temporizador y el control de enfoque de la tarjeta activa operan la misma sesión y muestran el mismo estado.
- Los descansos siguen siendo libres, sin tarea activa.

**Non-Goals:**
- No se auto-selecciona ninguna tarea al pulsar Iniciar (decisión de producto confirmada).
- No cambia el flujo de descansos, ni la creación/borrado/movimiento de tareas, ni el historial.
- No se rediseña visualmente la tarjeta ni el temporizador más allá del estado deshabilitado y el aviso.

## Decisions

### 1. La guarda del enfoque vive en el store, no solo en la UI

`startTimer` SHALL rechazar el arranque cuando `timerMode === 'work'` y `activeTaskId === null` (no-op). Así la regla es única y no depende de que cada componente recuerde deshabilitar su botón. La UI además refleja el estado (botón deshabilitado + aviso) para dar retroalimentación, pero la fuente de verdad es el store.

- **Alternativa descartada**: gating solo en la UI de `TimerCard`. Se descartó porque `Card` también llama `startTimer` y podría iniciarse enfoque por otra vía; duplicaría la condición.

### 2. `timerStatus` sigue siendo el estado sincronizado compartido

Ambos componentes ya derivan su render de `timerStatus` + `activeTaskId` del mismo store Zustand. La sincronización es automática: no se introduce estado local nuevo para el control de sesión. El botón del temporizador se calcula igual que en la tarjeta:
- Modo descanso → comportamiento actual (por `timerStatus`).
- Modo enfoque sin tarea activa → deshabilitado + aviso.
- Modo enfoque con tarea activa → Iniciar/Reanudar (`idle`/`paused`) o Pausar (`running`).

### 3. Lógica de toggle compartida

Extraer la intención "enfocar/pausar la tarea activa" a una función reutilizable (helper o acción del store, p. ej. `toggleFocus`) que ambos componentes invoquen, en lugar de duplicar la rama `isRunning ? pauseTimer() : startTimer()`. El temporizador ya opera sobre la tarea activa, así que su botón principal en modo enfoque llama a esa misma lógica.

- **Alternativa descartada**: dejar la lógica duplicada en cada componente. Se descartó por riesgo de divergencia, justo el problema que este cambio busca eliminar.

### 4. Edición de duración en vivo

En modo enfoque, `handleTimeClick` SHALL exigir además `activeTaskId != null` (hoy solo exige `idle`). Al guardar, el valor se aplica a la tarea activa (coherente con la edición de `focusTime` ya existente en `Card`). Sin tarea activa el tiempo no es editable.

## Risks / Trade-offs

- [El usuario que hoy usa el temporizador "suelto" pierde ese flujo] → Es el objetivo explícito (BREAKING). Se mitiga con un aviso claro que enseña el nuevo modelo (seleccionar tarea del tablero).
- [Un `startTimer` que se vuelve no-op silencioso podría confundir si algún llamador espera que siempre arranque] → La UI nunca ofrece el botón habilitado sin tarea activa, así que el no-op solo actúa como red de seguridad; no hay ruta esperada que dependa de arrancar sin tarea.
- [Descansos libres mientras el enfoque exige tarea puede parecer inconsistente] → Es intencional (decisión de producto): el descanso no se asocia a una tarea, por lo que no requiere una.

## Migration Plan

Cambio puramente de comportamiento en cliente (sin datos persistidos nuevos). No requiere migración de datos ni feature flag. Rollback = revertir el commit. La única consideración es agregar la cadena i18n del aviso en todos los idiomas soportados.
