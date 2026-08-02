## 1. Store: cuenta de descanso independiente

- [x] 1.1 En `AppContext`, añadir estado `breakTimeLeft` (inicializado a `getDurations(settings).shortBreak`) y su tipo en `AppState`.
- [x] 1.2 Añadir setter `setBreakTimeLeft(time)` y la acción `takeShortBreak()` (aplica clases de modo, `timerMode='shortBreak'`, `breakTimeLeft = d.shortBreak`, `timerStatus='running'`; no toca `timeLeft` ni tareas).
- [x] 1.3 Modificar `setTimerMode`: a un descanso → `breakTimeLeft = d[mode]`, `idle`, sin tocar `timeLeft`; a `work` → `idle`, conservando `timeLeft` (dejar de resetear a `d.work`).
- [x] 1.4 Modificar `resetTimer`: añadir rama descanso (`breakTimeLeft = d[mode]`, `idle`, sin tocar tareas); conservar la rama `work` actual.
- [x] 1.5 En `saveTaskTime`, retornar sin escribir cuando `timerMode !== 'work'` (red de seguridad).

## 2. TimerCard: usar la cuenta del modo activo

- [x] 2.1 Derivar `isBreak = timerMode !== 'work'` y el tiempo mostrado (`breakTimeLeft` en descanso, `timeLeft` en Enfoque); usarlo en el display `MM:SS` y en el cálculo de progreso (duración total = descanso: `settings[mode]*60`; Enfoque: `focusTime`/`settings.work`).
- [x] 2.2 En el tick: en `work` decrementar `timeLeft` + `saveTaskTime()`; en descanso decrementar `breakTimeLeft` sin persistir tareas. La detección de fin (0s) usa la cuenta del modo actual; añadir `breakTimeLeft` a las dependencias del efecto.
- [x] 2.3 En la edición en vivo (`handleTimeSave`): en descanso escribir `setBreakTimeLeft(val*60)`; en Enfoque conservar la lógica actual (tarea activa + `setTaskFocusTime`).

## 3. Card: atajo "Tomar descanso"

- [x] 3.1 Añadir un botón "Tomar descanso" en las acciones de la tarjeta en la columna En Progreso, que invoque `takeShortBreak()`; disponible con la sesión pausada o en marcha.
- [x] 3.2 Verificar que el atajo no dispara la selección de tarea ni el drag (stopPropagation como los otros controles de la fila).

## 4. i18n

- [x] 4.1 Añadir la etiqueta `takeBreak` ("Tomar descanso" / "Take a break") en es y en.

## 5. Verificación

- [x] 5.1 Verificar: con tarea activa y tiempo parcial, iniciar un descanso (pestaña y atajo) y dejar correr → el tiempo de la tarjeta NO cambia; al volver a Enfoque la tarea conserva su tiempo.
- [x] 5.2 Verificar que reiniciar/editar un descanso solo afecta la cuenta del descanso, no el Enfoque ni tareas.
- [x] 5.3 Verificar que el atajo "Tomar descanso" inicia un Descanso Corto en marcha sin alterar la tarea.
- [x] 5.4 Ejecutar lint/typecheck y build del proyecto.
