# panel-presentation Specification

## Purpose
Define cómo se presentan y descartan los paneles bajo demanda de la aplicación (Configuración, Historial de sesiones y Guía de uso) como drawers laterales, con un comportamiento uniforme y accesible en todos los tamaños de viewport.
## Requirements
### Requirement: Presentación como drawer lateral

Los paneles bajo demanda (Configuración, Historial de sesiones y Guía de uso) SHALL presentarse como un drawer lateral anclado al borde derecho de la ventana, tanto en móvil como en escritorio. El drawer SHALL ocupar el alto completo de la ventana y desplazarse (deslizar) desde el borde al abrirse.

#### Scenario: Abrir un panel en escritorio

- **WHEN** el usuario abre Configuración, Historial o Guía en un viewport de escritorio
- **THEN** el panel aparece como un drawer anclado al borde derecho, a alto completo de la ventana
- **AND** el drawer se muestra con una animación de deslizamiento desde ese borde

#### Scenario: Abrir un panel en móvil

- **WHEN** el usuario abre Configuración, Historial o Guía en un viewport móvil
- **THEN** el panel aparece como el mismo drawer lateral a alto completo, ocupando un ancho casi total de la pantalla
- **AND** el comportamiento de apertura es equivalente al de escritorio

### Requirement: Scrim y foco del drawer

Mientras un drawer está abierto, el sistema SHALL mostrar un scrim (overlay atenuado) sobre el resto de la interfaz para enfocar la atención en el panel.

#### Scenario: Scrim visible tras el drawer

- **WHEN** un drawer está abierto
- **THEN** se muestra un scrim atenuado detrás del drawer que cubre el resto de la interfaz

### Requirement: Cierre del drawer

El sistema SHALL permitir cerrar el drawer mediante al menos tres mecanismos: hacer clic o tocar el scrim, activar el botón de cerrar del panel, y presionar la tecla Escape. Al cerrarse, el drawer SHALL retirarse de la vista y devolver el control a la interfaz subyacente.

#### Scenario: Cerrar con el botón de cerrar

- **WHEN** el usuario activa el botón de cerrar del panel
- **THEN** el drawer se cierra y desaparece de la vista

#### Scenario: Cerrar tocando el scrim

- **WHEN** el usuario hace clic o toca el scrim fuera del contenido del drawer
- **THEN** el drawer se cierra sin aplicar cambios adicionales

#### Scenario: Cerrar con la tecla Escape

- **WHEN** el usuario presiona la tecla Escape con un drawer abierto
- **THEN** el drawer se cierra

### Requirement: Desplazamiento del contenido dentro del drawer

Cuando el contenido de un panel excede el alto disponible de la ventana, el drawer SHALL permitir desplazamiento vertical interno manteniendo visibles el encabezado y las acciones principales del panel.

#### Scenario: Contenido más alto que la ventana

- **WHEN** el contenido de un panel (por ejemplo, la guía o un historial largo) supera el alto de la ventana
- **THEN** el contenido se puede desplazar verticalmente dentro del drawer
- **AND** el encabezado del panel permanece accesible

