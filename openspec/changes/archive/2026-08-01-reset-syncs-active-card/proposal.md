## Why

Tras acoplar el temporizador a la tarjeta Kanban activa, el botón **Reiniciar** quedó a medias: reinicia el tiempo mostrado en el temporizador pero no el tiempo persistido de la tarea activa. Como resultado, la tarjeta sigue mostrando el tiempo restante anterior y, al cambiar de tarea y volver, se restaura ese valor viejo. Si el temporizador ahora depende totalmente de la tarjeta activa, Reiniciar debe reiniciar ambos de forma consistente.

## What Changes

- Al presionar **Reiniciar** en modo Enfoque con una tarea activa, el sistema SHALL reiniciar también el tiempo persistido de esa tarea, de modo que la tarjeta Kanban refleje el mismo reinicio que el temporizador.
- El reinicio en Enfoque SHALL volver a la **duración de enfoque configurada de la tarea activa** (o a la duración de enfoque por defecto si la tarea no tiene una), en coherencia con que el temporizador depende de la tarjeta activa.
- Los modos de **Descanso Corto** y **Descanso Largo** SHALL conservar el comportamiento actual de Reiniciar (volver a la duración del modo) y NO SHALL tocar ninguna tarea, ya que los descansos son libres.
- Sin tarea activa, Reiniciar en Enfoque SHALL comportarse como hoy (volver a la duración por defecto) sin efectos sobre tareas.

## Capabilities

### New Capabilities
<!-- Ninguna capacidad nueva: se modifican dos existentes. -->

### Modified Capabilities
- `pomodoro-timer`: El comportamiento de Reiniciar en modo Enfoque pasa a reiniciar además el tiempo de la tarea activa y a volver a la duración de enfoque de esa tarea; los descansos no cambian.
- `task-management`: El tiempo restante persistido de la tarea activa se reinicia cuando el usuario reinicia el temporizador en Enfoque, manteniendo tarjeta y temporizador sincronizados.

## Impact

- **Estado/Store**: `AppContext` — `resetTimer` debe, en modo `work` con `activeTaskId`, calcular el tiempo desde el `focusTime` de la tarea y persistirlo en `task.timeLeft` (reutilizando la lógica de `saveTasks`/tareas ya existente). Descansos y caso sin tarea activa sin cambios.
- **UI/Componentes**: `Card` del Kanban refleja el nuevo `task.timeLeft` automáticamente (ya lee ese valor); `TimerCard` no requiere cambios de marcado, solo se beneficia del store.
- **Sin cambios** en persistencia de historial, creación/movimiento de tareas ni en el flujo de descansos.
