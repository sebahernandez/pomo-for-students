## 1. Lógica pura de racha

- [x] 1.1 Crear `src/lib/streak.ts` con el tipo `StreakState { currentStreak, longestStreak, lastActiveDate, activeDays[] }` y el estado vacío por defecto.
- [x] 1.2 Implementar `todayKey(now)` que devuelve la fecha local en formato `YYYY-MM-DD`, y un helper de diferencia en días entre dos claves de fecha.
- [x] 1.3 Implementar `normalizeStreak(raw)` defensivo (mismo patrón que `normalizeTask`), tolerante a datos ausentes/corruptos.
- [x] 1.4 Implementar `recordActivity(state, now)`: primer pomodoro del día marca el día y actualiza racha (consecutivo → +1, hueco → reinicio a 1); pomodoro repetido el mismo día no cambia la racha; actualizar `longestStreak` y podar `activeDays` (~14 fechas).
- [x] 1.5 Implementar `recomputeOnLoad(state, now)`: si `lastActiveDate` no es hoy ni ayer, `currentStreak = 0` sin tocar `longestStreak`.
- [x] 1.6 Implementar `weekView(state, now)` que devuelve los 7 días Lun→Dom con `{ date, done, isToday }`.

## 2. Integración en el store

- [x] 2.1 En `AppContext.tsx`, añadir `streak: StreakState` a `AppState` y las funciones `loadStreak()`/`saveStreak()` con `safeGetItem`/`safeSetItem` (clave `pomo-streak`).
- [x] 2.2 Inicializar el estado con `recomputeOnLoad(loadStreak(), Date.now())`.
- [x] 2.3 En `incrementSessions`, calcular `recordActivity(state.streak, Date.now())`, persistir con `saveStreak` y devolver `streak` en el objeto de estado.

## 3. UI

- [x] 3.1 Crear `src/components/StreakCard.tsx` que lea `streak` del store, use `weekView` y muestre el contador de racha actual con `IconFlame` y la fila Lun→Dom con marca (`IconCheck`) para días completados, día actual resaltado y días sin actividad apagados, usando tokens de tema.
- [x] 3.2 Derivar las etiquetas de día con `Intl.DateTimeFormat(language, { weekday: 'short' })` sobre las fechas de `weekView`.
- [x] 3.3 Insertar `<StreakCard />` en `SessionHistory.tsx` sobre las tarjetas de estadísticas existentes.

## 4. i18n

- [x] 4.1 Añadir las claves `streak` y `days` (o equivalentes) a los objetos `en` y `es` en `src/i18n/translations.ts`.

## 5. Tests y verificación

- [x] 5.1 Crear `src/test/streak.test.ts` cubriendo: pomodoro repetido el mismo día no incrementa; día consecutivo incrementa; hueco reinicia a 1; `longestStreak` se conserva tras romperse; `recomputeOnLoad` cae a 0 tras >1 día inactivo; `weekView` marca los días correctos cruzando semanas; `normalizeStreak` tolera datos corruptos.
- [x] 5.2 Ejecutar la suite de tests y el lint; corregir lo que falle.
- [x] 5.3 Verificar manualmente en la app: completar un pomodoro marca el día y actualiza la racha; la tarjeta aparece en el panel de Historial en ambos idiomas.
