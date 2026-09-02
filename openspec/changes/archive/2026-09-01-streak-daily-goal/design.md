## Context

Ver `proposal.md` (Why). El sistema de racha ya existe (capability `weekly-streak`, spec principal en `openspec/specs/weekly-streak/spec.md`):

- `src/lib/streak.ts` modela `StreakState { currentStreak, longestStreak, lastActiveDate, activeDays: string[] }`. Un día se marca activo con el primer pomodoro; `recordActivity` actualiza racha; `weekView` cruza `activeDays` (booleano) con la semana; `normalizeStreak` es defensivo.
- El store (`AppContext.tsx`) llama a `recordActivity(state.streak, Date.now())` dentro de `incrementSessions` y persiste en la clave `pomo-streak`.
- `StreakCard.tsx` pinta la llama, el contador y la fila Lun→Dom.

El cambio eleva la condición de "día activo" de ≥1 a ≥5 sesiones, lo que exige llevar el **conteo por día** en lugar de un booleano.

## Goals / Non-Goals

**Goals:**
- Meta diaria fija de 5, expresada como una constante única (`DAILY_GOAL`).
- Migrar el formato persistido antiguo (`activeDays: string[]`) sin perder rachas ya conseguidas.
- Mantener la firma pública de `recordActivity`/`recomputeOnLoad`/`weekView` para no tocar el enganche del store.
- Mostrar el progreso del día en curso en la tarjeta.

**Non-Goals:**
- Meta configurable por el usuario (queda fija en 5; podría abrirse después reutilizando el conteo por día).
- Barra de progreso animada tipo "STEPS": basta un indicador textual `n/5` para el día.
- Recalcular rachas históricas desde `sessionHistory`.

## Decisions

### Modelo: conteo por día en lugar de booleano
`activeDays: string[]` → `dailyCounts: Record<string, number>` (clave `YYYY-MM-DD` → nº de sesiones de Enfoque ese día), podado a ~14 fechas. Alternativa descartada: mantener `activeDays` y un contador aparte solo para hoy — se pierde el conteo de días anteriores y complica la migración. Con `dailyCounts`, "día cumplido" es `count >= DAILY_GOAL` y el progreso de hoy sale directo.

### `DAILY_GOAL` como constante exportada
Se define y exporta `DAILY_GOAL = 5` desde `streak.ts` para que la UI muestre `n/5` sin duplicar el número. Un solo lugar de verdad; si se quisiera hacer configurable más adelante, se sustituye por un parámetro.

### `recordActivity` incrementa y evalúa la meta
`recordActivity(state, now)` incrementa `dailyCounts[today]`. Solo cuando el conteo de hoy **cruza** exactamente la meta (pasa de 4 a 5) se actualiza la racha: si el día activo anterior (último día que cumplió la meta) es contiguo, `currentStreak + 1`; si hay hueco, reinicia a 1; se actualiza `longestStreak` y `lastActiveDate = today`. Por debajo de la meta, o ya por encima, solo cambia el conteo. Esto conserva la garantía de "como máximo una actualización de racha por día".

### `lastActiveDate` = último día que cumplió la meta
Su semántica pasa de "último día con ≥1 sesión" a "último día que alcanzó la meta". `recomputeOnLoad` y el cálculo de continuidad siguen igual, operando sobre esa fecha. No cambia su firma.

### `weekView` expone cumplimiento y conteo
Cada `WeekDay` pasa a `{ date, count, done, isToday }`, con `done = count >= DAILY_GOAL`. La UI usa `done` para el check y `count` del día actual para el progreso.

### Migración en `normalizeStreak`
Si el objeto persistido trae el formato antiguo (`activeDays: string[]` y sin `dailyCounts`), se convierte cada fecha activa en `dailyCounts[fecha] = DAILY_GOAL` (se asume que cumplió, para no romper rachas ya logradas). Si trae `dailyCounts`, se saneा (claves de fecha válidas, valores enteros ≥ 0) y se poda. Datos corruptos → estado vacío, como hoy.

### UI: progreso del día
`StreakCard` obtiene el conteo de hoy desde `weekView` (o un helper `todayCount`) y muestra `n/5` junto a la fila de días. Se reutilizan los tokens de tema existentes; no se añade barra animada.

## Risks / Trade-offs

- **Pérdida de racha al subir el listón** → Usuarios que hoy cumplen con 1 sesión verán su racha caer si no llegan a 5. Es el comportamiento deseado (BREAKING declarado); la migración solo preserva días que ya estaban marcados, no rehace el pasado.
- **Migración de datos antiguos** → Asumir `count = DAILY_GOAL` para días previamente activos infla el conteo real de esos días, pero solo afecta a la retro-vista; el objetivo (no perder la racha lograda) se cumple. Aceptable.
- **Cambio de forma en `pomo-streak`** → `normalizeStreak` cubre ambos formatos; si un dato quedara a medias se cae al estado vacío sin romper la app (misma tolerancia que hoy).
