## Why

La racha actual se gana con un solo pomodoro al día, lo que la hace poco exigente como incentivo de estudio. Elevar el listón a una **meta diaria de 5 sesiones de Enfoque** hace que mantener la racha represente un esfuerzo real y sostenido, y da al usuario una señal clara de progreso dentro del día.

## What Changes

- Un día cuenta como **activo para la racha** solo cuando el usuario completa **al menos 5 pomodoros de Enfoque** ese día (antes bastaba 1). **BREAKING** respecto al comportamiento previo de la racha.
- Se pasa a llevar el **conteo de sesiones por día** (no un simple booleano de "día activo"), para poder medir el avance hacia la meta.
- La **vista semanal** marca un día como cumplido cuando alcanza la meta de 5 sesiones.
- La **tarjeta de racha** muestra el progreso del día en curso hacia la meta (p. ej. `3/5`).
- Los datos persistidos previos (días activos con la regla de 1 sesión) se **migran** de forma que no se pierdan las rachas ya conseguidas.

## Capabilities

### New Capabilities
<!-- Ninguna. -->

### Modified Capabilities
- `weekly-streak`: cambia la condición de "día activo" de ≥1 a ≥5 pomodoros de Enfoque por día; la vista semanal y la tarjeta reflejan el cumplimiento de la meta y el progreso diario.

## Impact

- **Código modificado:** `src/lib/streak.ts` (modelo de datos con conteos por día, meta diaria, `recordActivity`, `weekView`, `normalizeStreak` + migración), `src/context/AppContext.tsx` (sin cambios de firma; sigue llamando a `recordActivity`), `src/components/StreakCard.tsx` (indicador de progreso del día), `src/i18n/translations.ts` (texto de progreso/meta si aplica).
- **Tests modificados:** `src/test/streak.test.ts` y `src/test/StreakCard.test.tsx` actualizados a la regla de 5.
- **Almacenamiento:** la clave `pomo-streak` cambia de `activeDays: string[]` a conteos por día; `normalizeStreak` migra el formato antiguo sin romper la app.
- **Sin dependencias nuevas.**
