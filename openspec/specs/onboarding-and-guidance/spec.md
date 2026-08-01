# onboarding-and-guidance Specification

## Purpose
El onboarding y la guía ayudan a que los usuarios nuevos comprendan rápidamente cómo usar la aplicación, y ofrecen a cualquier usuario una referencia consultable en cualquier momento sin abandonar la app.
## Requirements
### Requirement: Asistente de bienvenida para usuarios nuevos

El sistema SHALL mostrar un asistente de bienvenida de varios pasos la primera vez que un usuario abre la aplicación, presentando el temporizador, el tablero de tareas y el enfoque por tarea. El asistente SHALL respetar el idioma seleccionado.

#### Scenario: Primera visita muestra el asistente

- **WHEN** un usuario abre la aplicación por primera vez (sin haber completado el onboarding)
- **THEN** se muestra el asistente de bienvenida con sus pasos introductorios

#### Scenario: No repetir en visitas posteriores

- **WHEN** el usuario ya completó o cerró el onboarding previamente
- **THEN** el asistente no se vuelve a mostrar automáticamente en visitas posteriores

### Requirement: Navegación del asistente

El sistema SHALL permitir avanzar y retroceder entre los pasos del asistente y cerrarlo en cualquier momento.

#### Scenario: Recorrer los pasos

- **WHEN** el usuario avanza o retrocede dentro del asistente
- **THEN** se muestra el paso correspondiente

#### Scenario: Cerrar el asistente

- **WHEN** el usuario cierra el asistente
- **THEN** el asistente desaparece y queda marcado como completado para no reaparecer automáticamente

### Requirement: Guía consultable a demanda

El sistema SHALL ofrecer una guía accesible en cualquier momento que explique el uso de la aplicación, independientemente de si el onboarding ya fue visto.

#### Scenario: Abrir la guía

- **WHEN** el usuario abre la guía desde la interfaz
- **THEN** se muestra el contenido de ayuda en el idioma seleccionado

