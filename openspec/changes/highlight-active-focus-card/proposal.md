## Why

Hoy el usuario puede designar una tarea como activa (vinculada al temporizador de enfoque), pero la tarjeta correspondiente en el tablero Kanban no se distingue con claridad del resto. Cuando hay varias tareas en pantalla, cuesta identificar de un vistazo cuál está en foco durante la sesión, lo que rompe la conexión visual entre el temporizador y la tarea en la que se está trabajando.

## What Changes

- La tarjeta de la tarea **activa** (la vinculada al temporizador) SHALL destacarse con un tratamiento visual claramente diferenciado del resto de las tarjetas del Kanban: color/acento distinto y un efecto profesional (borde de acento, halo/anillo, elevación) que la señale sin ruido visual.
- El realce SHALL derivarse de los tokens de tema existentes, de modo que se vea coherente en cada tema (claro/oscuro y variantes) y respete el contraste.
- En cualquier momento SHALL haber a lo sumo una tarjeta destacada; al cambiar de tarea activa el realce se traslada, y al deseleccionar (o mover la tarea activa a Hecho/Por Hacer) el realce desaparece.
- El efecto SHALL degradarse de forma accesible cuando el usuario tenga activada la preferencia de movimiento reducido (`prefers-reduced-motion: reduce`).

## Capabilities

### New Capabilities
<!-- Ninguna capacidad nueva: se refina una existente. -->

### Modified Capabilities
- `task-management`: Se añade una regla de estado visual sobre el tablero Kanban — la tarjeta de la tarea activa debe presentarse con un realce distintivo que la diferencie de las demás.

## Impact

- **UI/Componentes**: Componente de tarjeta del Kanban (estado visual de "tarea activa") y sus estilos.
- **Estilos/Tema**: Uso de los tokens de tema existentes para el color de acento y el efecto de realce; posible incorporación de un token de acento si no existe uno adecuado.
- **Sin cambios** en la lógica de selección de tarea activa, persistencia ni en el temporizador: solo se consume el estado ya disponible para representarlo visualmente.
