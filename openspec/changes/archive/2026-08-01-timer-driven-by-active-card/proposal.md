## Why

Hoy el temporizador de Enfoque puede iniciarse, pausarse y reiniciarse de forma libre, con independencia de que exista una tarjeta Kanban activa. Esto rompe la conexión entre "el tiempo que corre" y "la tarea en la que trabajo": se puede acumular tiempo de enfoque sin que quede vinculado a ninguna tarea, y los controles quedan duplicados entre la tarjeta y el temporizador con comportamientos que pueden divergir. Queremos que el enfoque sea siempre intencional: correr el temporizador implica trabajar sobre una tarea concreta.

## What Changes

- **BREAKING**: El modo Enfoque del temporizador SHALL depender de una tarea Kanban activa. Sin tarea activa, el temporizador de enfoque no puede iniciarse.
- El temporizador SHALL exponer los mismos controles que la tarjeta Kanban activa: establecer/reanudar el enfoque y pausarlo mientras corre. El botón principal del temporizador SHALL reflejar el estado de la tarea activa (Iniciar / Enfoque, Pausar, Reanudar).
- Cuando NO hay tarea activa y el modo es Enfoque, el botón principal SHALL mostrarse deshabilitado junto a un aviso que invite a seleccionar una tarea del tablero. No hay auto-selección de tarea.
- Los modos de Descanso (corto y largo) SHALL seguir funcionando de forma libre, sin exigir tarea activa. La dependencia de tarea activa aplica únicamente al modo Enfoque.
- Los controles del temporizador y los de la tarjeta activa SHALL mantenerse sincronizados: iniciar/pausar desde cualquiera de los dos afecta la misma sesión y ambos reflejan el mismo estado.
- La edición de duración en vivo desde el temporizador (clic en el tiempo) en modo Enfoque SHALL seguir la duración de la tarea activa; sin tarea activa esa edición queda deshabilitada, coherente con que el enfoque no puede correr.

## Capabilities

### New Capabilities
<!-- Ninguna capacidad nueva: se modifican dos existentes. -->

### Modified Capabilities
- `pomodoro-timer`: El control de sesión del modo Enfoque pasa a depender de una tarea activa (no se puede iniciar sin ella); el botón principal refleja y controla la sesión de la tarjeta activa. Los descansos siguen siendo libres.
- `task-management`: La tarea activa vinculada al temporizador se vuelve requisito para ejecutar una sesión de enfoque, y sus controles (enfocar/pausar/reanudar) quedan replicados y sincronizados en el temporizador.

## Impact

- **UI/Componentes**: `TimerCard` (botón principal y aviso de "sin tarea"), `Card` del Kanban (los controles de enfoque quedan como espejo del temporizador). Posible extracción de la lógica de "toggle enfoque" a un lugar compartido.
- **Estado/Store**: `AppContext` — `startTimer`/`pauseTimer` del modo Enfoque deben considerar `activeTaskId`; se apoya en `switchActiveTask`, `saveTaskTime` y `timerStatus` ya existentes. Sin cambios en persistencia de historial.
- **i18n**: Nuevo texto de aviso ("selecciona una tarea del tablero") en los idiomas soportados.
- **Sin cambios** en el tablero de columnas, creación/borrado de tareas, ni en el comportamiento de los descansos.
