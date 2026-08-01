## ADDED Requirements

### Requirement: Aplicar cambios no cierra el drawer

Aplicar o guardar cambios dentro de un drawer (por ejemplo, guardar la configuración) SHALL dejar el drawer abierto con el cambio ya aplicado. El drawer SHALL cerrarse únicamente mediante afordancias explícitas de cierre: clic o tap en el scrim, el botón de cerrar del panel, la tecla Escape, o los botones de cierre del pie del panel. Ninguna acción cuyo propósito principal sea aplicar datos SHALL cerrar el drawer como efecto secundario.

#### Scenario: Guardar sin cerrar

- **WHEN** el usuario aplica o guarda un cambio dentro de un drawer
- **THEN** el cambio se aplica
- **AND** el drawer permanece abierto

#### Scenario: Cierre solo por afordancias explícitas

- **WHEN** el usuario desea cerrar el drawer
- **THEN** puede hacerlo mediante el scrim, el botón de cerrar, la tecla Escape o un botón de cierre del pie
- **AND** ninguna acción de aplicar/guardar provoca el cierre
