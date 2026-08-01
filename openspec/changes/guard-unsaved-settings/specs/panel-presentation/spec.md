## MODIFIED Requirements

### Requirement: Cierre del drawer

El sistema SHALL permitir cerrar el drawer mediante al menos tres mecanismos: hacer clic o tocar el scrim, activar el botón de cerrar del panel, y presionar la tecla Escape. Al cerrarse, el drawer SHALL retirarse de la vista y devolver el control a la interfaz subyacente. Un panel MAY interceptar estos mecanismos de cierre cuando tenga cambios sin guardar, difiriendo el cierre y mostrando un aviso en lugar de descartar las ediciones; en ese caso el drawer permanece abierto hasta que el usuario resuelva los cambios (guardar o cancelar). Cuando el panel no tiene cambios pendientes, los mecanismos de cierre SHALL cerrar el drawer de inmediato.

#### Scenario: Cerrar con el botón de cerrar

- **WHEN** el usuario activa el botón de cerrar del panel y el panel no tiene cambios sin guardar
- **THEN** el drawer se cierra y desaparece de la vista

#### Scenario: Cerrar tocando el scrim

- **WHEN** el usuario hace clic o toca el scrim fuera del contenido del drawer y el panel no tiene cambios sin guardar
- **THEN** el drawer se cierra sin aplicar cambios adicionales

#### Scenario: Cerrar con la tecla Escape

- **WHEN** el usuario presiona la tecla Escape con un drawer abierto y el panel no tiene cambios sin guardar
- **THEN** el drawer se cierra

#### Scenario: Cierre interceptado por cambios sin guardar

- **WHEN** el usuario intenta cerrar el drawer mediante el scrim, el botón de cerrar o la tecla Escape mientras el panel tiene cambios sin guardar
- **THEN** el drawer no se cierra
- **AND** el panel muestra un aviso para que el usuario guarde o descarte los cambios antes de salir
