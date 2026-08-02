## Why

Hoy el temporizador comparte un único `timeLeft` entre Enfoque y los descansos, y la cuenta regresiva persiste su valor en la tarea activa en cada segundo. Como consecuencia, correr un Descanso Corto o Largo mientras hay una tarea activa **sobrescribe el tiempo restante de esa tarea** con los segundos del descanso: el descanso "roba" tiempo a la tarjeta. Los descansos deben ser pausas independientes que no alteren la duración de ninguna tarea ni ningún otro temporizador.

## What Changes

- Los descansos (Corto y Largo) SHALL correr sobre una cuenta regresiva **propia e independiente**, separada del tiempo de Enfoque. Su avance, reinicio o edición NO SHALL modificar el `timeLeft` de la tarea activa ni el temporizador de Enfoque.
- Cambiar entre Enfoque y un descanso (y volver) SHALL preservar ambos tiempos: el descanso mantiene su cuenta y la tarea activa conserva su tiempo restante intacto.
- La persistencia del tiempo por tarea SHALL ocurrir únicamente durante Enfoque; mientras corre un descanso no SHALL escribirse tiempo en ninguna tarea.
- El sistema SHALL ofrecer un atajo **"Tomar descanso"** en la tarjeta de la tarea en la que se trabaja (columna En Progreso), disponible para iniciar un descanso al pausar o al terminar esa tarea. El atajo SHALL iniciar un **Descanso Corto aislado** sin afectar el tiempo de la tarea. El Descanso Largo permanece accesible desde las pestañas del temporizador.
- Reiniciar o editar en modo descanso SHALL afectar solo la cuenta del descanso.

## Capabilities

### New Capabilities
<!-- Ninguna capacidad nueva: se modifican dos existentes. -->

### Modified Capabilities
- `pomodoro-timer`: Los descansos pasan a tener una cuenta regresiva independiente; iniciar/avanzar/reiniciar/editar un descanso no altera el tiempo de Enfoque, y alternar de modo preserva ambos tiempos.
- `task-management`: El tiempo persistido de la tarea activa deja de verse afectado por los descansos, y se añade un atajo en la tarjeta para iniciar un descanso corto aislado al pausar o terminar la tarea.

## Impact

- **Estado/Store**: `AppContext` — introducir una cuenta regresiva de descanso separada del `timeLeft` de Enfoque; `saveTaskTime` solo persiste en modo `work`; `setTimerMode`/`resetTimer`/edición operan sobre la cuenta que corresponde al modo sin cruzar valores. Nueva acción para "iniciar descanso" desde la tarjeta.
- **UI/Componentes**: `TimerCard` muestra y calcula el progreso a partir de la cuenta del modo activo (Enfoque vs descanso). `Card` añade el botón "Tomar descanso". `TimerCard` tick decrementa la cuenta correcta.
- **i18n**: Nueva etiqueta "Tomar descanso" (en/es).
- **Sin cambios** en el historial, en la creación/movimiento de tareas ni en la regla de que Enfoque requiere tarea activa.
