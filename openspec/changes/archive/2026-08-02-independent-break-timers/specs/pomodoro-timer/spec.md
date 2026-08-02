## ADDED Requirements

### Requirement: Descansos independientes del enfoque

Los modos de Descanso Corto (`shortBreak`) y Descanso Largo (`longBreak`) SHALL correr sobre una cuenta regresiva propia, independiente del tiempo de Enfoque (`work`). Iniciar, avanzar, pausar, reiniciar o editar un descanso NO SHALL modificar el tiempo restante de Enfoque ni el de ninguna tarea. Al alternar entre Enfoque y un descanso, y al volver, el tiempo de Enfoque (el de la tarea activa) SHALL permanecer intacto.

#### Scenario: El descanso no descuenta tiempo del enfoque

- **WHEN** el temporizador está en un modo de descanso y su cuenta avanza en marcha
- **THEN** el tiempo restante de Enfoque no cambia
- **AND** el tiempo restante de la tarea activa no cambia

#### Scenario: Alternar entre enfoque y descanso preserva el tiempo del enfoque

- **WHEN** el usuario, con un tiempo de Enfoque en curso, cambia a un descanso y luego vuelve a Enfoque
- **THEN** el tiempo de Enfoque vuelve a mostrar el tiempo restante de la tarea activa, sin haber sido alterado por el descanso

#### Scenario: Reiniciar un descanso solo afecta al descanso

- **WHEN** el modo es un descanso y el usuario presiona Reiniciar
- **THEN** la cuenta del descanso vuelve a la duración configurada de ese descanso
- **AND** ni el tiempo de Enfoque ni el de ninguna tarea se modifican

#### Scenario: Editar la duración de un descanso solo afecta al descanso

- **WHEN** el modo es un descanso, está inactivo, y el usuario edita el tiempo mostrado
- **THEN** solo cambia la cuenta de ese descanso
- **AND** ni el tiempo de Enfoque ni el de ninguna tarea se modifican
