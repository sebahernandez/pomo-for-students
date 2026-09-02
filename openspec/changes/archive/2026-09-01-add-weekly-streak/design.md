## Context

Ver `proposal.md` (Why) para la motivación. El estado actual relevante:

- El store es Zustand (`src/context/AppContext.tsx`). Cada dominio persistente (settings, tasks, history, timer) sigue el mismo patrón: funciones `load*`/`save*` con los helpers tolerantes a fallos `safeGetItem`/`safeSetItem` (`src/lib/storage.ts`), normalización defensiva de datos persistidos (`normalizeTask`, `normalizeSessionRecord`, `migrateSettings`) y una clave propia en `localStorage`.
- Los pomodoros de Enfoque completados ya pasan por un único punto: `incrementSessions`, que crea el `SessionRecord`, lo guarda en `pomo-history` y devuelve el nuevo estado. Es el punto natural para registrar actividad de racha.
- La UI usa Tailwind con tokens de tema (`text-theme-*`), `@tabler/icons-react` (`IconFlame`, `IconCheck` disponibles) y drawers reutilizables. El Historial de Sesiones (`SessionHistory.tsx`) ya renderiza dos tarjetas de estadísticas dentro de un `Drawer`.
- i18n vive en `src/i18n/translations.ts` con objetos `en`/`es` y el hook `useTranslations(language)`.
- Los tests usan Vitest; `store.test.ts` prueba funciones puras exportadas del store con `now`/estado inyectado.

## Goals / Non-Goals

**Goals:**
- Lógica de racha 100% pura y testeable, con la fecha (`now`) inyectable para tests deterministas.
- Un solo punto de escritura de actividad (`incrementSessions`) para evitar desincronización.
- Persistencia aislada del historial: limpiar el historial no debe borrar la racha.
- Reutilizar los patrones existentes (helpers de storage, normalización, tokens de tema, i18n) sin dependencias nuevas.

**Non-Goals:**
- Meta configurable de pomodoros por día (barra de progreso tipo "STEPS" de la referencia). El día es binario: hubo o no hubo Enfoque.
- Notificaciones, badges o sincronización entre dispositivos.
- Migración de rachas a partir del historial existente (la racha arranca desde el primer pomodoro tras el despliegue).

## Decisions

### Fechas como `YYYY-MM-DD` local, no epoch
Se guardan las fechas activas como cadenas `YYYY-MM-DD` en zona local. Alternativa descartada: epoch ms + comparación por rangos de medianoche, que es propensa a errores de zona horaria y de límite de día. Con la clave de fecha local, "consecutivo" es una resta de días sobre fechas normalizadas y "hoy/ayer" es comparación de cadenas.

### Store dedicado con clave `pomo-streak`
`StreakState = { currentStreak, longestStreak, lastActiveDate, activeDays[] }`. Alternativa descartada: derivar todo desde `sessionHistory` en cada render — se rompe al limpiar historial y obliga a recomputar N registros. El estado calculado es O(1) de leer y sobrevive al borrado de historial. `activeDays` se poda a las últimas ~14 fechas (la vista solo necesita la semana actual y el cálculo solo mira `lastActiveDate`).

### Módulo de lógica pura `src/lib/streak.ts`
Funciones exportadas, sin acceso a `localStorage` ni a `Date.now()` implícito:
- `todayKey(now: number): string` — fecha local `YYYY-MM-DD`.
- `normalizeStreak(raw: unknown): StreakState` — defensivo, igual patrón que `normalizeTask`.
- `recordActivity(state, now): StreakState` — aplica las reglas de "primer pomodoro del día / consecutivo / interrupción" y actualiza récord + `activeDays`.
- `recomputeOnLoad(state, now): StreakState` — baja `currentStreak` a 0 si `lastActiveDate` no es hoy ni ayer; nunca toca `longestStreak`.
- `weekView(state, now): { dayKey, label, date, done, isToday }[]` — Lun→Dom de la semana actual cruzando `activeDays`.

Espeja el rol de `restoreTimerState`/`migrateSettings`: el store solo orquesta, la lógica se prueba aislada.

### Integración mínima en el store
- `loadStreak()`/`saveStreak()` con los helpers de storage; en init: `const streak = recomputeOnLoad(loadStreak(), Date.now())`, expuesto como `streak: StreakState` en `AppState`.
- Dentro de `incrementSessions`, junto al guardado de historial: `const streak = recordActivity(state.streak, Date.now()); saveStreak(streak)` y añadir `streak` al objeto retornado. No se crea nueva acción pública (no hay UI que mute la racha manualmente).

### UI: `StreakCard` dentro de `SessionHistory`
Componente nuevo que lee `streak` del store y usa `weekView`. Se inserta arriba de las dos tarjetas de estadísticas actuales del drawer. Los nombres de día se obtienen con `Intl.DateTimeFormat(language, { weekday: 'short' })` sobre las fechas de `weekView`, evitando mantener 7 traducciones por idioma; solo se añaden a i18n las etiquetas `streak` y `days`.

## Risks / Trade-offs

- **Cambio de zona horaria / viaje entre husos** → El día se ancla a la zona local del dispositivo; un salto de huso puede adelantar/atrasar un límite de día. Aceptable para una app de estudio personal; documentado, sin mitigación adicional.
- **Reloj del sistema manipulado** → El usuario podría inflar la racha cambiando la fecha. Fuera de alcance para almacenamiento puramente local; sin verificación de servidor.
- **Poda de `activeDays`** → Guardar solo ~14 fechas impide históricos largos de calendario, pero la vista y el cálculo no los necesitan. Si en el futuro se quiere un heatmap anual, se ampliará el límite; el modelo de datos ya lo permite.
- **Arranque sin datos históricos** → Usuarios existentes empiezan con racha 0; no se retro-calcula desde `sessionHistory` (Non-Goal). Trade-off aceptado por simplicidad y para no acoplar racha a historial.
