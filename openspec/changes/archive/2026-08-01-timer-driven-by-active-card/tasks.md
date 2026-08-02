## 1. Store: guarda de enfoque y lógica compartida

- [x] 1.1 En `AppContext`, hacer que `startTimer` sea no-op cuando `timerMode === 'work'` y `activeTaskId === null` (no cambia `timerStatus`); mantener el arranque libre para `shortBreak`/`longBreak`.
- [x] 1.2 Añadir una acción `toggleFocus` (o helper compartido) que replique la intención de enfocar/pausar la tarea activa: si `timerStatus === 'running'` → `pauseTimer()`, en otro caso → `startTimer()`. Debe respetar la guarda de 1.1.
- [x] 1.3 Verificar que `pauseTimer`/`resetTimer` siguen funcionando en todos los modos sin depender de tarea activa.

## 2. TimerCard: control principal dependiente de la tarea activa

- [x] 2.1 Calcular en `TimerCard` el estado del botón principal a partir de `timerMode`, `timerStatus` y `activeTaskId` (leer `activeTaskId` del store).
- [x] 2.2 En modo Enfoque sin tarea activa: mostrar el botón de inicio deshabilitado y renderizar el aviso que invita a seleccionar una tarea del tablero.
- [x] 2.3 En modo Enfoque con tarea activa: el botón principal invoca `toggleFocus` y muestra Iniciar/Reanudar/Pausar según `timerStatus`.
- [x] 2.4 Mantener el comportamiento libre actual del botón en modos Descanso Corto y Descanso Largo.
- [x] 2.5 Gatear `handleTimeClick`: en modo Enfoque exigir además `activeTaskId != null`; al guardar, aplicar la duración a la tarea activa (coherente con `setTaskFocusTime`).

## 3. Card (Kanban): sincronización con el temporizador

- [x] 3.1 Reemplazar la lógica local de `handleToggleFocus` para reutilizar la acción/helper compartido de 1.2 cuando la tarjeta ya es la activa, conservando `switchActiveTask(id)` + arranque al enfocar una tarjeta que no lo estaba.
- [x] 3.2 Confirmar que iniciar/pausar desde el temporizador se refleja en la tarjeta activa y viceversa (ambos derivan de `timerStatus`).

## 4. i18n

- [x] 4.1 Añadir la cadena del aviso "selecciona una tarea del tablero" en todos los idiomas soportados de `src/i18n/translations`.
- [x] 4.2 Usar la cadena traducida en el aviso de `TimerCard` (2.2).

## 5. Verificación

- [x] 5.1 Verificar manualmente: sin tarea activa el enfoque no arranca (botón deshabilitado + aviso); con tarea activa arranca/pausa/reanuda desde temporizador y tarjeta de forma sincronizada.
- [x] 5.2 Verificar que los descansos corren libremente sin tarea activa.
- [x] 5.3 Verificar la edición de duración en vivo: habilitada solo con tarea activa en Enfoque; bloqueada mientras corre o pausado.
- [x] 5.4 Ejecutar lint/typecheck y build del proyecto.
