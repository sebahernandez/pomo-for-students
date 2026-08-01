## MODIFIED Requirements

### Requirement: Guía consultable a demanda

El sistema SHALL ofrecer una guía accesible en cualquier momento que explique el uso de la aplicación, independientemente de si el onboarding ya fue visto. La guía SHALL presentarse como un drawer lateral (según la capacidad `panel-presentation`) en lugar de un modal centrado, con el mismo comportamiento en móvil y escritorio.

#### Scenario: Abrir la guía

- **WHEN** el usuario abre la guía desde la interfaz
- **THEN** se muestra el contenido de ayuda en el idioma seleccionado
- **AND** el contenido aparece dentro de un drawer lateral anclado al borde derecho de la ventana

#### Scenario: Cerrar la guía

- **WHEN** el usuario cierra la guía mediante el botón de cerrar, el scrim o la tecla Escape
- **THEN** el drawer de la guía se cierra y se devuelve el control a la interfaz subyacente
