## MODIFIED Requirements

### Requirement: Atajo para iniciar un descanso desde la tarjeta

La tarjeta de la tarea en la que se trabaja (columna En Progreso) SHALL ofrecer un atajo "Tomar descanso" que inicie el Descanso general. El atajo SHALL estar disponible para usarse al pausar o mientras se trabaja esa tarea. Iniciar el descanso desde este atajo SHALL cambiar el temporizador al modo Descanso y ponerlo en marcha, sin modificar el tiempo restante de la tarea.

#### Scenario: Iniciar el descanso desde la tarjeta

- **WHEN** el usuario usa el atajo "Tomar descanso" en la tarjeta de la tarea en la que trabaja
- **THEN** el temporizador cambia al modo Descanso y comienza la cuenta del descanso
- **AND** el tiempo restante de la tarea no se modifica

#### Scenario: Tomar un descanso tras pausar la tarea

- **WHEN** la sesión de enfoque de la tarea activa está pausada y el usuario usa el atajo "Tomar descanso"
- **THEN** se inicia el Descanso aislado
- **AND** al volver a Enfoque la tarea conserva el tiempo restante que tenía al pausar

## ADDED Requirements

### Requirement: Aviso al terminar la tarea activa

Al mover a Hecho la tarea que está activa en el temporizador, el sistema SHALL mostrar un aviso con tres opciones: **Tomar descanso**, **Continuar con otra tarea** y **No hacer nada**. Elegir "Tomar descanso" SHALL iniciar el Descanso general y cerrar el aviso. Elegir "Continuar con otra tarea" SHALL cerrar el aviso sin iniciar descanso ni seleccionar automáticamente otra tarea, dejando que el usuario elija la siguiente. Elegir "No hacer nada" SHALL cerrar el aviso sin efectos. El aviso NO SHALL aparecer al mover a Hecho una tarea que no es la activa.

#### Scenario: Terminar la tarea activa muestra el aviso

- **WHEN** el usuario mueve a Hecho la tarea que está activa en el temporizador
- **THEN** se muestra un aviso con las opciones Tomar descanso, Continuar con otra tarea y No hacer nada

#### Scenario: Elegir tomar un descanso al terminar

- **WHEN** el aviso de fin de tarea está visible y el usuario elige "Tomar descanso"
- **THEN** el temporizador inicia el Descanso general
- **AND** el aviso se cierra

#### Scenario: Elegir continuar con otra tarea

- **WHEN** el aviso de fin de tarea está visible y el usuario elige "Continuar con otra tarea"
- **THEN** el aviso se cierra sin iniciar un descanso
- **AND** no se selecciona automáticamente otra tarea activa

#### Scenario: Elegir no hacer nada

- **WHEN** el aviso de fin de tarea está visible y el usuario elige "No hacer nada"
- **THEN** el aviso se cierra sin ningún efecto adicional

#### Scenario: Terminar una tarea no activa no muestra aviso

- **WHEN** el usuario mueve a Hecho una tarea que no es la activa en el temporizador
- **THEN** no se muestra el aviso de fin de tarea
