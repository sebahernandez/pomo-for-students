## MODIFIED Requirements

### Requirement: Configuración de duraciones

El sistema SHALL permitir ajustar las duraciones en minutos de Enfoque, Descanso Corto y Descanso Largo. Al guardar nuevas duraciones, el temporizador SHALL recargar el tiempo del modo actual y quedar inactivo. Guardar nuevas duraciones NO SHALL cerrar el panel de Configuración; el panel permanece abierto para que el usuario confirme el cambio o siga ajustando.

#### Scenario: Guardar nuevas duraciones

- **WHEN** el usuario guarda nuevas duraciones en la configuración
- **THEN** las duraciones se aplican a los modos correspondientes
- **AND** el temporizador se recarga con la duración del modo actual en estado inactivo
- **AND** el panel de configuración permanece abierto
