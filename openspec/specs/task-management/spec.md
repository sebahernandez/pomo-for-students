# task-management Specification

## Purpose
La gestión de tareas permite al usuario organizar en qué va a trabajar mediante un tablero Kanban y vincular cada sesión de enfoque a una tarea concreta, de modo que el tiempo dedicado quede asociado al trabajo real.
## Requirements
### Requirement: Tablero Kanban de tres columnas

El sistema SHALL presentar las tareas en tres columnas: Por Hacer (`todo`), En Progreso (`doing`) y Hecho (`done`). Cada tarea SHALL pertenecer a exactamente una columna y el sistema SHALL mostrar el total de tareas.

#### Scenario: Distribución por columna

- **WHEN** existen tareas con distintos estados
- **THEN** cada tarea aparece únicamente en la columna correspondiente a su estado

#### Scenario: Columna vacía

- **WHEN** una columna no tiene tareas
- **THEN** el sistema muestra un indicador de columna vacía

### Requirement: Crear tarea

El sistema SHALL permitir crear una tarea a partir de un título de texto. El título SHALL recortar espacios y una entrada vacía SHALL ser rechazada. Toda tarea nueva SHALL crearse en la columna Por Hacer con cero pomodoros completados.

#### Scenario: Crear tarea válida

- **WHEN** el usuario escribe un título no vacío y confirma
- **THEN** se agrega una nueva tarea a la columna Por Hacer
- **AND** el campo de entrada se limpia

#### Scenario: Rechazar título vacío

- **WHEN** el usuario intenta agregar una tarea con título vacío o solo espacios
- **THEN** no se crea ninguna tarea

### Requirement: Mover tarea entre columnas

El sistema SHALL permitir mover una tarea entre columnas mediante arrastrar y soltar (drag & drop). Al mover una tarea a Hecho o a Por Hacer, el sistema SHALL descartar el tiempo parcial guardado de esa tarea.

#### Scenario: Arrastrar a otra columna

- **WHEN** el usuario arrastra una tarjeta y la suelta sobre otra columna
- **THEN** la tarea adopta el estado de esa columna

#### Scenario: Mover la tarea activa a Hecho

- **WHEN** el usuario mueve a Hecho la tarea que está activa en el temporizador
- **THEN** el sistema deselecciona la tarea activa
- **AND** reinicia el temporizador

### Requirement: Eliminar tarea

El sistema SHALL permitir eliminar una tarea del tablero.

#### Scenario: Eliminar una tarea

- **WHEN** el usuario elimina una tarea
- **THEN** la tarea desaparece del tablero de forma permanente

### Requirement: Tarea activa vinculada al temporizador

El sistema SHALL permitir designar una tarea como activa para que las sesiones de enfoque se asocien a ella. Al cambiar de tarea activa, el sistema SHALL guardar el tiempo restante de la tarea anterior y restaurar el de la nueva tarea (o su tiempo de enfoque configurado, o la duración de enfoque por defecto).

La tarea activa SHALL ser requisito para ejecutar una sesión de enfoque: mientras no haya una tarea activa, el temporizador no puede iniciar el modo Enfoque. Los controles de enfoque de la tarjeta activa (enfocar/reanudar y pausar) SHALL estar replicados en el temporizador y ambos SHALL mantenerse sincronizados, de modo que operar cualquiera de los dos afecta la misma sesión y ambos reflejan el mismo estado.

Al reiniciar el temporizador en modo Enfoque, el sistema SHALL reiniciar también el tiempo restante persistido de la tarea activa, dejándolo en su tiempo de enfoque configurado (o en la duración de enfoque por defecto), de modo que la tarjeta y el temporizador queden sincronizados tras el reinicio.

#### Scenario: Seleccionar tarea activa

- **WHEN** el usuario marca una tarea como activa
- **THEN** el temporizador queda asociado a esa tarea
- **AND** al completar una sesión de enfoque se incrementa el conteo de pomodoros de esa tarea

#### Scenario: Cambiar de tarea activa conserva el progreso

- **WHEN** el usuario cambia de una tarea activa a otra
- **THEN** el tiempo restante de la tarea anterior se guarda
- **AND** el temporizador carga el tiempo restante previamente guardado de la nueva tarea, o su tiempo de enfoque configurado, o la duración de enfoque por defecto

#### Scenario: El enfoque exige tarea activa

- **WHEN** no existe una tarea activa
- **THEN** el temporizador no puede iniciar una sesión de enfoque
- **AND** la interfaz invita a seleccionar una tarea del tablero para comenzar

#### Scenario: Controlar el enfoque desde el temporizador

- **WHEN** existe una tarea activa y el usuario usa el control principal del temporizador para iniciar, pausar o reanudar el enfoque
- **THEN** la sesión de esa tarea activa inicia, se pausa o se reanuda según corresponda
- **AND** la tarjeta Kanban de la tarea activa refleja el mismo estado

#### Scenario: Reiniciar sincroniza el tiempo de la tarea activa

- **WHEN** el modo es Enfoque, existe una tarea activa y el usuario reinicia el temporizador
- **THEN** el tiempo restante persistido de la tarea activa se reinicia a su tiempo de enfoque configurado (o a la duración de enfoque por defecto)
- **AND** la tarjeta Kanban de esa tarea muestra el tiempo reiniciado

### Requirement: Tiempo de enfoque por tarea

El sistema SHALL permitir asignar a cada tarea un tiempo de enfoque personalizado que determine la duración y el progreso de sus sesiones. Mientras una tarea activa corre, el sistema SHALL persistir su tiempo restante de forma continua.

#### Scenario: Persistir tiempo restante en marcha

- **WHEN** una tarea activa está en marcha
- **THEN** su tiempo restante se guarda mientras avanza, de modo que sobrevive a una recarga de página

### Requirement: Los descansos no alteran el tiempo de la tarea

El tiempo restante persistido de una tarea SHALL permanecer sin cambios mientras corre un descanso. El sistema SHALL persistir el tiempo restante de la tarea activa únicamente durante sesiones de Enfoque; durante un descanso NO SHALL escribir tiempo en ninguna tarea, aunque exista una tarea activa seleccionada.

#### Scenario: Correr un descanso no toca el tiempo de la tarea activa

- **WHEN** existe una tarea activa con un tiempo restante guardado y el usuario inicia y deja correr un descanso
- **THEN** el tiempo restante guardado de esa tarea permanece igual
- **AND** la tarjeta de la tarea sigue mostrando su tiempo restante original

#### Scenario: Volver al enfoque tras un descanso conserva el tiempo de la tarea

- **WHEN** el usuario corre un descanso y luego vuelve a la tarea activa en Enfoque
- **THEN** la tarea retoma exactamente el tiempo restante que tenía antes del descanso

### Requirement: Atajo para iniciar un descanso desde la tarjeta

La tarjeta de la tarea en la que se trabaja (columna En Progreso) SHALL ofrecer un atajo "Tomar descanso" que inicie un Descanso Corto. El atajo SHALL estar disponible para usarse al pausar o al terminar esa tarea. Iniciar el descanso desde este atajo SHALL cambiar el temporizador al modo Descanso Corto y ponerlo en marcha, sin modificar el tiempo restante de la tarea. El Descanso Largo permanece disponible desde las pestañas del temporizador.

#### Scenario: Iniciar un descanso corto desde la tarjeta

- **WHEN** el usuario usa el atajo "Tomar descanso" en la tarjeta de la tarea en la que trabaja
- **THEN** el temporizador cambia al modo Descanso Corto y comienza la cuenta del descanso
- **AND** el tiempo restante de la tarea no se modifica

#### Scenario: Tomar un descanso tras pausar la tarea

- **WHEN** la sesión de enfoque de la tarea activa está pausada y el usuario usa el atajo "Tomar descanso"
- **THEN** se inicia un Descanso Corto aislado
- **AND** al volver a Enfoque la tarea conserva el tiempo restante que tenía al pausar

