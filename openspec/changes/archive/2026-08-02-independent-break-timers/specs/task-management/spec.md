## ADDED Requirements

### Requirement: Los descansos no alteran el tiempo de la tarea

El tiempo restante persistido de una tarea SHALL permanecer sin cambios mientras corre un descanso. El sistema SHALL persistir el tiempo restante de la tarea activa únicamente durante sesiones de Enfoque; durante un descanso NO SHALL escribir tiempo en ninguna tarea, aunque exista una tarea activa seleccionada.

#### Scenario: Correr un descanso no toca el tiempo de la tarea activa

- **WHEN** existe una tarea activa con un tiempo restante guardado y el usuario inicia y deja correr un descanso
- **THEN** el tiempo restante guardado de esa tarea permanece igual
- **AND** la tarjeta de la tarea sigue mostrando su tiempo restante original

#### Scenario: Volver al enfoque tras un descanso conserva el tiempo de la tarea

- **WHEN** el usuario corre un descanso y luego vuelve a la tarea activa en Enfoque
- **THEN** la tarea retoma exactamente el tiempo restante que tenía antes del descanso

### Requirement: Atajo para iniciar un descanso desde la tarjeta

La tarjeta de la tarea en la que se trabaja (columna En Progreso) SHALL ofrecer un atajo "Tomar descanso" que inicie un Descanso Corto. El atajo SHALL estar disponible para usarse al pausar o al terminar esa tarea. Iniciar el descanso desde este atajo SHALL cambiar el temporizador al modo Descanso Corto y ponerlo en marcha, sin modificar el tiempo restante de la tarea. El Descanso Largo permanece disponible desde las pestañas del temporizador.

#### Scenario: Iniciar un descanso corto desde la tarjeta

- **WHEN** el usuario usa el atajo "Tomar descanso" en la tarjeta de la tarea en la que trabaja
- **THEN** el temporizador cambia al modo Descanso Corto y comienza la cuenta del descanso
- **AND** el tiempo restante de la tarea no se modifica

#### Scenario: Tomar un descanso tras pausar la tarea

- **WHEN** la sesión de enfoque de la tarea activa está pausada y el usuario usa el atajo "Tomar descanso"
- **THEN** se inicia un Descanso Corto aislado
- **AND** al volver a Enfoque la tarea conserva el tiempo restante que tenía al pausar
