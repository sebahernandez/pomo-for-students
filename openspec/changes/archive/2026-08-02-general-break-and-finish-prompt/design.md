## Context

Ver `proposal.md` (Why). Estado actual relevante:

- `TimerMode = 'work' | 'shortBreak' | 'longBreak'`; `Settings = { work, shortBreak, longBreak }`. `getDurations` mapea los tres modos.
- El descanso ya corre sobre `breakTimeLeft` independiente (change anterior). La acción de la tarjeta es `takeShortBreak()` y las clases de fondo son `mode-shortBreak`/`mode-longBreak`.
- `moveTask(id, status)` cambia el estado de la tarea y limpia `timeLeft` al pasar a `done`/`todo`; hoy no muestra ningún aviso.
- `shortBreak`/`longBreak` aparecen en `AppContext`, `TimerCard`, `SettingsPanel`, `i18n`, `index.css` y en dos tests.

## Goals / Non-Goals

**Goals:**
- Un único modo Descanso (`break`) con una sola duración configurable; dos pestañas (Enfoque/Descanso).
- Migración transparente de la configuración guardada `{work, shortBreak, longBreak}` → `{work, break}`.
- Aviso de tres opciones al mover a Hecho la tarea activa.

**Non-Goals:**
- No cambiar la independencia del descanso (ya implementada), ni la regla de que Enfoque requiere tarea activa.
- No auto-seleccionar la siguiente tarea al "Continuar con otra tarea" (solo cierra).
- No rediseñar la deselección de la tarea activa al pasar a Hecho (comportamiento preexistente; fuera de alcance).

## Decisions

### 1. Colapsar el modo y la configuración

`TimerMode = 'work' | 'break'`. `Settings = { work: number; break: number }`. `DEFAULT_SETTINGS = { work: 25, break: 5 }`. `getDurations` devuelve `{ work, break }`. `setTimerMode`, `resetTimer`, la transición de completado (`work → break`, `break → work`), la inicialización de `breakTimeLeft` y `takeShortBreak` (renombrada `takeBreak`) operan sobre el modo único. Las clases de fondo se consolidan en una sola `mode-break` (helper `applyModeClasses`).

### 2. Migración en `loadSettings`

Al cargar de `localStorage`, si la configuración tiene la forma antigua (`shortBreak`/`longBreak`) o le falta `break`, mapear `break = stored.break ?? stored.shortBreak ?? DEFAULT_SETTINGS.break`, conservando `work`. Persistir de inmediato la forma nueva es opcional; basta con normalizar al leer para no romper sesiones existentes.

- **Alternativa descartada**: exigir que el usuario reconfigure. Se descartó por mala experiencia y pérdida de datos.

### 3. Aviso de fin de tarea vía estado en el store

Añadir `finishPromptOpen: boolean` (inicial `false`) y `closeFinishPrompt()`. En `moveTask`, cuando `id === activeTaskId && status === 'done'`, marcar `finishPromptOpen: true`. Un componente `FinishTaskPrompt` (modal, montado en `App`) lee el flag y ofrece:
- **Tomar descanso** → `takeBreak()` + `closeFinishPrompt()`.
- **Continuar con otra tarea** → `closeFinishPrompt()` (sin auto-selección).
- **No hacer nada** → `closeFinishPrompt()`.

El aviso solo se dispara para la tarea activa; mover otra tarjeta a Hecho no lo abre.

- **Alternativa descartada**: manejar el aviso con estado local en `KanbanBoard`. Se descartó porque el disparo ocurre dentro de la acción del store (`moveTask`); un flag en el store lo hace determinista y desacoplado de qué componente originó el movimiento.

### 4. Reutilizar el patrón de modal existente

`FinishTaskPrompt` sigue el estilo de los modales actuales (overlay + tarjeta centrada, tematizado), con foco accesible y cierre por tecla `Escape` (equivale a "No hacer nada").

## Risks / Trade-offs

- [Datos viejos con `longBreak` distinto se pierden al colapsar] → Aceptado: la nueva UX tiene un solo descanso; se conserva `shortBreak` como `break`. Documentado en la migración.
- [Tests existentes referencian los modos viejos] → Se actualizan `TimerCard.test.tsx` y `Drawer.test.tsx` como parte del cambio.
- [El aviso podría solaparse con otros overlays] → Es puntual (solo al terminar la tarea activa) y modal; se cierra con cualquier opción o `Escape`.

## Migration Plan

Cliente: `loadSettings` normaliza la forma antigua al leer; no requiere migración manual. Rollback = revertir el commit (la config vieja en `localStorage` sigue siendo legible por la versión previa).
