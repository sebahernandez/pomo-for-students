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

#### Scenario: Seleccionar tarea activa

- **WHEN** el usuario marca una tarea como activa
- **THEN** el temporizador queda asociado a esa tarea
- **AND** al completar una sesión de enfoque se incrementa el conteo de pomodoros de esa tarea

#### Scenario: Cambiar de tarea activa conserva el progreso

- **WHEN** el usuario cambia de una tarea activa a otra
- **THEN** el tiempo restante de la tarea anterior se guarda
- **AND** el temporizador carga el tiempo restante previamente guardado de la nueva tarea, o su tiempo de enfoque configurado, o la duración de enfoque por defecto

### Requirement: Tiempo de enfoque por tarea

El sistema SHALL permitir asignar a cada tarea un tiempo de enfoque personalizado que determine la duración y el progreso de sus sesiones. Mientras una tarea activa corre, el sistema SHALL persistir su tiempo restante de forma continua.

#### Scenario: Persistir tiempo restante en marcha

- **WHEN** una tarea activa está en marcha
- **THEN** su tiempo restante se guarda mientras avanza, de modo que sobrevive a una recarga de página

