## Why

La app registra cada pomodoro completado pero no refleja la constancia del usuario a lo largo del tiempo. Una racha de días con enfoque es un incentivo simple y probado para mantener el hábito de estudio, y hoy no existe ninguna señal de "cuántos días seguidos llevas estudiando".

## What Changes

- Se introduce un sistema de **rachas semanales** persistido en `localStorage` (clave `pomo-streak`, independiente del historial de sesiones).
- Un día cuenta como **activo** cuando el usuario completa **al menos un pomodoro de Enfoque** ese día (descansos no cuentan).
- Se calcula y muestra: **racha actual** (días consecutivos hasta hoy), **racha más larga** (récord) y una **vista de la semana** (Lun→Dom) con los días completados marcados.
- La racha se actualiza en el mismo punto donde ya se registra un pomodoro completado, y se **recalcula al cargar la app** para reflejar rachas rotas mientras la app estuvo cerrada.
- Se añade una **tarjeta de racha (`StreakCard`)** dentro del panel de Historial de Sesiones, sobre las estadísticas existentes, con contador tipo llama y la fila de días de la semana.
- Textos nuevos en español e inglés.

## Capabilities

### New Capabilities
- `weekly-streak`: Cálculo, persistencia y visualización de la racha de días consecutivos con al menos un pomodoro de Enfoque completado, incluyendo la vista semanal Lun→Dom y la racha récord.

### Modified Capabilities
<!-- Ninguna. El historial de sesiones no cambia sus requisitos; la tarjeta de racha solo se aloja visualmente en su panel. -->

## Impact

- **Nuevo código:** `src/lib/streak.ts` (lógica pura), `src/components/StreakCard.tsx` (UI), `src/test/streak.test.ts` (tests).
- **Código modificado:** `src/context/AppContext.tsx` (estado, carga/guardado, enganche en `incrementSessions`), `src/components/SessionHistory.tsx` (alojar la tarjeta), `src/i18n/translations.ts` (textos en/es).
- **Almacenamiento:** nueva clave `pomo-streak` en `localStorage`, leída/escrita con los helpers `safeGetItem`/`safeSetItem` existentes.
- **Sin dependencias nuevas.** Reutiliza Zustand, Tailwind y `@tabler/icons-react` ya presentes.
