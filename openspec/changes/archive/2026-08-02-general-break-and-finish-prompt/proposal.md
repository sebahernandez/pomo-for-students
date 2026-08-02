## Why

El temporizador maneja dos descansos (Corto y Largo) que en la práctica se usan igual y complican la interfaz y la configuración. Simplificamos a un único **descanso general** con una duración configurable. Además, al terminar una tarea el usuario no tiene una guía clara de qué sigue; queremos ofrecerle en ese momento tomar un descanso, seguir con otra tarea o no hacer nada.

## What Changes

- **BREAKING**: Se reemplazan los modos Descanso Corto y Descanso Largo por un único modo **Descanso** general. El temporizador muestra dos pestañas: **Enfoque** y **Descanso**.
- **BREAKING**: Los ajustes reemplazan las dos duraciones (Corto/Largo) por una sola **duración de Descanso** configurable. La configuración existente SHALL migrarse a la nueva forma sin perder datos.
- El descanso general es independiente del tiempo de Enfoque (se conserva la regla ya existente): su cuenta no modifica el tiempo de ninguna tarea.
- El botón de la tarjeta Kanban **"Tomar descanso"** inicia el descanso general; queda disponible al pausar o mientras se trabaja una tarea.
- Al **terminar una tarea** (mover a Hecho la tarea activa), el sistema SHALL mostrar un aviso con tres opciones: **Tomar descanso** (inicia el descanso general), **Continuar con otra tarea** (cierra el aviso; el usuario elige otra tarjeta) y **No hacer nada** (cierra el aviso). El aviso NO aparece al mover a Hecho una tarea que no es la activa.
- La transición automática al completar una sesión de Enfoque pasa a apuntar al único modo Descanso.

## Capabilities

### New Capabilities
<!-- Ninguna capacidad nueva: se modifican existentes. -->

### Modified Capabilities
- `pomodoro-timer`: De tres modos (Enfoque + dos descansos) a dos (Enfoque + Descanso general); una sola duración de descanso; la transición automática y la independencia del descanso se expresan sobre el modo único.
- `task-management`: El atajo de la tarjeta inicia el descanso general; al terminar (mover a Hecho) la tarea activa se muestra un aviso con tres opciones.
- `user-preferences`: Los ajustes de duración pasan de Enfoque + Corto + Largo a Enfoque + Descanso, con migración de la configuración guardada.

## Impact

- **Estado/Store** (`AppContext`): `TimerMode` pasa a `'work' | 'break'`; `Settings` pasa de `{ work, shortBreak, longBreak }` a `{ work, break }`; `getDurations`, `DEFAULT_SETTINGS`, `loadSettings` (con migración de la forma antigua), `setTimerMode`, la acción de descanso (`takeShortBreak` → `takeBreak`) y la transición de completado se ajustan al modo único.
- **UI/Componentes**: `TimerCard` (dos pestañas, clases de fondo `mode-break`), `SettingsPanel` (un solo campo "Descanso (min)"), `Card`/`KanbanBoard` (aviso de tres opciones al terminar la tarea activa; el botón "Tomar descanso" inicia el descanso general).
- **Estilos** (`index.css`): consolidar `mode-shortBreak`/`mode-longBreak` en `mode-break`.
- **i18n**: etiquetas de modo (una sola "Descanso"), del campo de ajuste, y del aviso de fin de tarea (Tomar descanso / Continuar con otra tarea / No hacer nada) en es y en.
- **Pruebas**: actualizar `src/test/TimerCard.test.tsx` y `src/test/Drawer.test.tsx` que referencian `shortBreak`/`longBreak`.
- **Sin cambios** en el historial ni en la regla de que Enfoque requiere tarea activa.
