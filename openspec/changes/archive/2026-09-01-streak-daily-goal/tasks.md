## 1. Modelo de datos y lógica

- [x] 1.1 En `src/lib/streak.ts`, exportar la constante `DAILY_GOAL = 5` y cambiar `StreakState.activeDays: string[]` por `dailyCounts: Record<string, number>` (actualizar `emptyStreak`).
- [x] 1.2 Actualizar `recordActivity(state, now)`: incrementar `dailyCounts[today]`; solo al cruzar la meta (de `GOAL-1` a `GOAL`) actualizar racha (consecutivo con el último día que cumplió meta → +1, hueco → 1), `longestStreak` y `lastActiveDate`; podar `dailyCounts` a ~14 fechas.
- [x] 1.3 Actualizar `weekView` para devolver `{ date, count, done, isToday }` con `done = count >= DAILY_GOAL`; añadir helper `todayCount(state, now)` si ayuda a la UI.
- [x] 1.4 Verificar que `recomputeOnLoad` sigue correcto con `lastActiveDate` = último día que cumplió la meta (sin cambios de firma).
- [x] 1.5 Actualizar `normalizeStreak`: sanear `dailyCounts` (fechas válidas, enteros ≥ 0, poda) y migrar el formato antiguo `activeDays: string[]` → `dailyCounts[fecha] = DAILY_GOAL`.

## 2. UI

- [x] 2.1 En `src/components/StreakCard.tsx`, mostrar el progreso del día en curso hacia la meta (`n/5`) usando `weekView`/`todayCount`, y marcar los días con `done` (meta cumplida).
- [x] 2.2 Añadir a `src/i18n/translations.ts` el/los texto(s) necesarios para el progreso o la meta, en `en` y `es` (si el indicador requiere etiqueta).

## 3. Store

- [x] 3.1 Confirmar en `src/context/AppContext.tsx` que `incrementSessions` sigue llamando a `recordActivity` sin cambios (la firma se mantiene) y que persiste el nuevo formato en `pomo-streak`.

## 4. Tests y verificación

- [x] 4.1 Actualizar `src/test/streak.test.ts`: día no cuenta con <5 sesiones; cuenta al llegar a 5; sesiones extra no cambian la racha; consecutividad e interrupción con la meta; migración de `activeDays` antiguo; `normalizeStreak` tolera corrupción; `weekView` devuelve `count`/`done`.
- [x] 4.2 Actualizar `src/test/StreakCard.test.tsx` para la regla de 5 y el indicador de progreso.
- [x] 4.3 Ejecutar la suite completa y el lint; corregir lo que falle.
