# user-preferences Specification

## Purpose
Las preferencias del usuario permiten adaptar la aplicación a su gusto y contexto — duraciones, apariencia e idioma — y recordar esas elecciones entre visitas para ofrecer una experiencia consistente.
## Requirements
### Requirement: Configuración de duraciones

El sistema SHALL permitir ajustar las duraciones en minutos de Enfoque, Descanso Corto y Descanso Largo. Al guardar nuevas duraciones, el temporizador SHALL recargar el tiempo del modo actual y quedar inactivo.

#### Scenario: Guardar nuevas duraciones

- **WHEN** el usuario guarda nuevas duraciones en la configuración
- **THEN** las duraciones se aplican a los modos correspondientes
- **AND** el temporizador se recarga con la duración del modo actual en estado inactivo

### Requirement: Modo oscuro y claro

El sistema SHALL permitir alternar entre modo oscuro y claro. El modo por defecto SHALL ser oscuro.

#### Scenario: Alternar apariencia

- **WHEN** el usuario alterna el modo de apariencia
- **THEN** la interfaz cambia entre oscuro y claro de inmediato

### Requirement: Selección de tema de color

El sistema SHALL ofrecer varios temas de color seleccionables (Neutral, Ocean, Forest, Sunset, Rose, Midnight). El tema por defecto SHALL ser Neutral, y cada tema SHALL tener variantes para modo claro y oscuro.

#### Scenario: Cambiar de tema

- **WHEN** el usuario selecciona un tema de color
- **THEN** los colores de acento, degradados y superficies de la interfaz se actualizan según ese tema

### Requirement: Idioma de la interfaz

El sistema SHALL permitir cambiar el idioma entre Español (`es`) e Inglés (`en`). El idioma por defecto SHALL ser Español.

#### Scenario: Cambiar idioma

- **WHEN** el usuario selecciona otro idioma
- **THEN** los textos de la interfaz se muestran en ese idioma

### Requirement: Persistencia de preferencias

El sistema SHALL persistir localmente en el navegador las duraciones, el modo de apariencia, el tema y el idioma, de modo que se restauren automáticamente en la siguiente visita.

#### Scenario: Restaurar preferencias tras recargar

- **WHEN** el usuario recarga la aplicación después de cambiar sus preferencias
- **THEN** las duraciones, la apariencia, el tema y el idioma se restauran a los últimos valores elegidos

