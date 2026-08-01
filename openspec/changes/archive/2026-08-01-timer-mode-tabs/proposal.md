## Why

Hoy los selectores de modo (Enfoque, Descanso Corto, Descanso Largo) viven como una fila de botones separada, por encima del temporizador y del tablero Kanban, desconectados visualmente de la tarjeta a la que controlan. Al cambiar de modo el temporizador salta de un estado a otro sin ninguna señal de transición, lo que hace el cambio abrupto y poco claro. Convertir esos botones en pestañas integradas a la tarjeta del temporizador refuerza la relación control→temporizador y una animación de transición hace el cambio de estado perceptible y pulido.

## What Changes

- Mover los tres selectores de modo desde la fila superior de `App.tsx` a la propia tarjeta del temporizador (`TimerCard`), presentándolos como una barra de **pestañas** en la parte superior de la tarjeta.
- La pestaña del modo activo se destaca visualmente; las inactivas quedan atenuadas y son accionables para cambiar de modo (mismo comportamiento que hoy: seleccionar un modo carga su duración y deja el temporizador inactivo).
- Al cambiar de modo se ejecuta una **animación de transición** sobre el contenido del temporizador (p. ej. el display y el badge de modo), señalando el paso de un estado a otro.
- La animación respeta `prefers-reduced-motion`, degradando a un efecto mínimo o nulo.
- El badge de modo estático actual dentro de `TimerCard` se reemplaza/complementa por las pestañas como fuente principal de indicación del modo.

## Capabilities

### New Capabilities
<!-- Ninguna capacidad nueva: el cambio ajusta el comportamiento del temporizador existente. -->

### Modified Capabilities
- `pomodoro-timer`: la selección de modo pasa a presentarse como pestañas integradas a la tarjeta del temporizador, y el cambio de modo dispara una animación de transición perceptible (respetando accesibilidad de movimiento reducido).

## Impact

- `src/App.tsx`: se retira la fila de botones de modo (líneas del bloque `modes.map`).
- `src/components/TimerCard.tsx`: se añade la barra de pestañas y la lógica/estilos de animación al cambiar de modo.
- `src/index.css`: posible nuevo keyframe/utilidad de animación para la transición de cambio de modo.
- Sin cambios en el store (`AppContext`): `setTimerMode` ya carga la duración y deja el temporizador inactivo; se reutiliza tal cual.
- i18n: se reutilizan las etiquetas existentes `focus`, `shortBreak`, `longBreak`.
