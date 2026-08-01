# session-history Specification

## Purpose
El historial de sesiones registra cada sesión de enfoque completada para que el usuario pueda revisar su dedicación acumulada, ver estadísticas y relacionar el tiempo invertido con tareas concretas.
## Requirements
### Requirement: Registro de sesión completada

Cuando una sesión de enfoque se completa, el sistema SHALL registrar una entrada de historial con identificador único, marca de tiempo de finalización, duración de la sesión y, si había una tarea activa, su identificador y título.

#### Scenario: Registrar sesión con tarea activa

- **WHEN** una sesión de enfoque se completa con una tarea activa seleccionada
- **THEN** se agrega al historial un registro con la fecha/hora, la duración y el título de la tarea

#### Scenario: Registrar sesión sin tarea activa

- **WHEN** una sesión de enfoque se completa sin ninguna tarea activa
- **THEN** se agrega un registro con fecha/hora y duración, sin tarea asociada

### Requirement: Estadísticas del historial

El sistema SHALL mostrar estadísticas agregadas del historial, incluyendo el total de sesiones y el tiempo total de enfoque acumulado.

#### Scenario: Ver estadísticas

- **WHEN** el usuario abre el historial de sesiones
- **THEN** ve el número total de sesiones completadas y el tiempo total de enfoque

#### Scenario: Historial vacío

- **WHEN** no existe ninguna sesión registrada
- **THEN** el sistema muestra un estado vacío indicando que aún no hay sesiones

### Requirement: Limpiar historial

El sistema SHALL permitir al usuario borrar todo el historial de sesiones.

#### Scenario: Borrar el historial

- **WHEN** el usuario elige limpiar el historial
- **THEN** todos los registros de sesión se eliminan de forma permanente

