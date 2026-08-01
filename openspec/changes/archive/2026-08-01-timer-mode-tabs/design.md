## Context

Ver `proposal.md` — Why. Estado actual relevante:

- Los selectores de modo están en `src/App.tsx` como una fila de `<button>` sobre el layout, llamando a `setTimerMode(mode.key)`.
- `TimerCard` (`src/components/TimerCard.tsx`) muestra un badge estático con `modeLabel` en su parte superior.
- `setTimerMode` (en `src/context/AppContext.tsx`) ya carga la duración del modo, deja el temporizador en `idle` y alterna las clases `mode-shortBreak`/`mode-longBreak` en `<html>` para la variación de fondo. No requiere cambios.
- `src/index.css` ya define keyframes y utilidades (`fade-in`, `slide-up`, etc.) y un bloque `@media (prefers-reduced-motion: reduce)`.

## Goals / Non-Goals

**Goals:**
- Presentar los tres modos como pestañas dentro de la tarjeta del temporizador.
- Ejecutar una animación de transición perceptible al cambiar de modo, respetando `prefers-reduced-motion`.
- Reutilizar el store y las etiquetas i18n existentes sin cambios.

**Non-Goals:**
- No cambiar la lógica de duración, cuenta regresiva ni transición automática al completar.
- No introducir librerías de animación (Framer Motion u otras); se usa CSS.
- No rediseñar el resto de la tarjeta (progreso, controles, contador de sesiones).

## Decisions

**1. Ubicación de las pestañas: dentro de `TimerCard`, reemplazando el badge estático.**
La barra de pestañas vive en la parte superior de la tarjeta, ocupando el rol de indicador de modo que hoy tiene el badge. Se elimina la fila de botones de `App.tsx`. Alternativa descartada: mantener los botones en `App.tsx` y solo estilizarlos como pestañas — no cumple el requisito de que sean "pestañas del timer" (integradas a la tarjeta).

**2. Disparo de la animación: remount por `key` en el contenido del display.**
Se envuelve el contenido animable del temporizador (display de tiempo y/o zona central) en un contenedor cuyo `key={timerMode}`. Al cambiar `timerMode`, React desmonta y remonta el subárbol, reejecutando la utilidad de animación CSS (p. ej. `animate-fade-in` o un nuevo keyframe dedicado). Esto evita gestionar estado de animación manual y garantiza que la animación corra en cada cambio.
Alternativa descartada: `useEffect` sobre `timerMode` que agrega/quita una clase con `setTimeout` — más frágil (timing manual, limpieza) que el remount por `key`.

**3. Estilo de la animación: transición sutil (fade + desplazamiento leve).**
Se reutiliza `fade-in` existente o se agrega un keyframe dedicado y acotado (p. ej. `mode-switch`) en `src/index.css` si se busca un efecto propio de cambio de pestaña. La duración se mantiene corta (~0.3–0.4s) coherente con las animaciones actuales.

**4. Accesibilidad de movimiento.**
La animación se cubre con el bloque `@media (prefers-reduced-motion: reduce)` existente, degradando a opacidad instantánea o efecto mínimo, consistente con `slide-in-right`.

## Risks / Trade-offs

- [Remount por `key` reinicia el subárbol del display] → Mantener el `key` acotado al contenido presentacional (display/badge), no a los controles ni a estado de edición en vivo, para no perder foco ni estado del input de edición de minutos.
- [Duplicar indicación de modo (pestaña activa + badge)] → Se elimina el badge estático; la pestaña activa es la única fuente de indicación de modo, evitando redundancia.
- [Layout: mover los botones fuera de `App.tsx` altera el espaciado superior] → Ajustar `space-y`/márgenes del contenedor en `App.tsx` tras retirar la fila.
