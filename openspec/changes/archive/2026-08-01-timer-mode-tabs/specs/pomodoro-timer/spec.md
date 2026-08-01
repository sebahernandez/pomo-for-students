## MODIFIED Requirements

### Requirement: Modos de temporizador

El sistema SHALL ofrecer tres modos de temporizador — Enfoque (`work`), Descanso Corto (`shortBreak`) y Descanso Largo (`longBreak`) — cada uno con su propia duración configurable. Los tres modos SHALL presentarse como una barra de pestañas integrada a la tarjeta del temporizador, mostrando la pestaña del modo activo destacada y las inactivas atenuadas pero accionables. Al seleccionar un modo, el temporizador SHALL cargar la duración de ese modo, quedar en estado inactivo (`idle`) y ejecutar una animación de transición sobre el contenido del temporizador que señale el cambio de estado.

#### Scenario: Los modos se presentan como pestañas del temporizador

- **WHEN** se muestra la tarjeta del temporizador
- **THEN** los modos Enfoque, Descanso Corto y Descanso Largo aparecen como pestañas dentro de la tarjeta del temporizador
- **AND** la pestaña correspondiente al modo actual se muestra como activa (destacada) y las demás como inactivas

#### Scenario: Cambiar de modo reinicia el tiempo

- **WHEN** el usuario selecciona una pestaña de modo distinta a la actual
- **THEN** el tiempo mostrado se ajusta a la duración configurada para ese modo
- **AND** el temporizador queda en estado inactivo (no en marcha)
- **AND** la pestaña seleccionada pasa a mostrarse como activa

#### Scenario: El cambio de modo ejecuta una animación de transición

- **WHEN** el usuario selecciona un modo distinto al actual
- **THEN** el contenido del temporizador ejecuta una animación de transición que señala el paso de un estado a otro

#### Scenario: La animación respeta el movimiento reducido

- **WHEN** el usuario tiene activada la preferencia de sistema de movimiento reducido (`prefers-reduced-motion: reduce`)
- **THEN** el cambio de modo degrada la animación a un efecto mínimo o nulo, sin transición de movimiento

#### Scenario: El fondo refleja el modo de descanso

- **WHEN** el usuario selecciona Descanso Corto o Descanso Largo
- **THEN** la aplicación aplica una variación visual de fondo asociada a ese modo
- **AND** al volver a Enfoque se retira dicha variación
