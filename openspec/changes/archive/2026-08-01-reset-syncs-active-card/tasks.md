## 1. Store: reiniciar sincroniza la tarea activa

- [x] 1.1 En `AppContext`, modificar `resetTimer` para bifurcar por modo: en `work` con `activeTaskId`, calcular `mins = activeTask.focusTime ?? settings.work` y `newTimeLeft = mins * 60`.
- [x] 1.2 En ese caso, además de `{ timeLeft: newTimeLeft, timerStatus: 'idle' }`, persistir `task.timeLeft = newTimeLeft` en la tarea activa vía `saveTasks` (mismo patrón que `saveTaskTime`/`switchActiveTask`) y devolver `tasks` actualizado.
- [x] 1.3 Conservar el comportamiento actual de `resetTimer` en descansos (`shortBreak`/`longBreak`) y en Enfoque sin tarea activa: `timeLeft = d[mode]`, `idle`, sin tocar tareas.

## 2. Verificación

- [x] 2.1 Verificar en la app: con tarea activa en Enfoque y tiempo parcial corrido, presionar Reiniciar deja el temporizador y la tarjeta en la duración de enfoque de la tarea, y persiste (sobrevive a recarga y a cambiar/volver de tarea).
- [x] 2.2 Verificar que reiniciar un Descanso Corto/Largo vuelve a la duración del modo y no altera el tiempo de ninguna tarea.
- [x] 2.3 Ejecutar lint/typecheck y build del proyecto.
