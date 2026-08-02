## ADDED Requirements

### Requirement: Realce visual de la tarjeta activa en el Kanban

El sistema SHALL destacar visualmente, dentro del tablero Kanban, la tarjeta de la tarea designada como activa (la vinculada al temporizador de enfoque), de modo que se diferencie de forma inequívoca del resto de las tarjetas. El realce SHALL emplear un tratamiento de acento profesional —color/acento distinto junto con un efecto de énfasis (por ejemplo borde de acento, anillo/halo o elevación)— derivado de los tokens del tema activo, preservando el contraste y la legibilidad en cada tema. En todo momento SHALL haber a lo sumo una tarjeta destacada.

#### Scenario: Destacar la tarjeta de la tarea activa

- **WHEN** existe una tarea activa vinculada al temporizador
- **THEN** su tarjeta en el Kanban se muestra con el realce de acento distintivo
- **AND** las demás tarjetas se muestran con su estilo normal

#### Scenario: A lo sumo una tarjeta destacada

- **WHEN** el usuario cambia la tarea activa de una tarjeta a otra
- **THEN** el realce se retira de la tarjeta anterior
- **AND** se aplica únicamente a la tarjeta de la nueva tarea activa

#### Scenario: Retirar el realce al deseleccionar

- **WHEN** no hay ninguna tarea activa, o la tarea activa se mueve a Hecho o Por Hacer y el sistema la deselecciona
- **THEN** ninguna tarjeta del Kanban muestra el realce de acento

#### Scenario: Coherencia con el tema activo

- **WHEN** el usuario cambia de tema
- **THEN** el realce de la tarjeta activa adopta el color de acento y el efecto correspondientes a ese tema, manteniendo el contraste y la legibilidad

#### Scenario: El realce respeta el movimiento reducido

- **WHEN** el usuario tiene activada la preferencia de sistema de movimiento reducido (`prefers-reduced-motion: reduce`)
- **THEN** cualquier componente animado del realce (por ejemplo un pulso o transición) se degrada a un efecto estático mínimo o nulo
- **AND** la tarjeta activa permanece claramente distinguible mediante color/borde estático
