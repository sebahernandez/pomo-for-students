## MODIFIED Requirements

### Requirement: Tarea activa vinculada al temporizador

El sistema SHALL permitir designar una tarea como activa para que las sesiones de enfoque se asocien a ella. Al cambiar de tarea activa, el sistema SHALL guardar el tiempo restante de la tarea anterior y restaurar el de la nueva tarea (o su tiempo de enfoque configurado, o la duración de enfoque por defecto).

La tarea activa SHALL ser requisito para ejecutar una sesión de enfoque: mientras no haya una tarea activa, el temporizador no puede iniciar el modo Enfoque. Los controles de enfoque de la tarjeta activa (enfocar/reanudar y pausar) SHALL estar replicados en el temporizador y ambos SHALL mantenerse sincronizados, de modo que operar cualquiera de los dos afecta la misma sesión y ambos reflejan el mismo estado.

Al reiniciar el temporizador en modo Enfoque, el sistema SHALL reiniciar también el tiempo restante persistido de la tarea activa, dejándolo en su tiempo de enfoque configurado (o en la duración de enfoque por defecto), de modo que la tarjeta y el temporizador queden sincronizados tras el reinicio.

#### Scenario: Seleccionar tarea activa

- **WHEN** el usuario marca una tarea como activa
- **THEN** el temporizador queda asociado a esa tarea
- **AND** al completar una sesión de enfoque se incrementa el conteo de pomodoros de esa tarea

#### Scenario: Cambiar de tarea activa conserva el progreso

- **WHEN** el usuario cambia de una tarea activa a otra
- **THEN** el tiempo restante de la tarea anterior se guarda
- **AND** el temporizador carga el tiempo restante previamente guardado de la nueva tarea, o su tiempo de enfoque configurado, o la duración de enfoque por defecto

#### Scenario: El enfoque exige tarea activa

- **WHEN** no existe una tarea activa
- **THEN** el temporizador no puede iniciar una sesión de enfoque
- **AND** la interfaz invita a seleccionar una tarea del tablero para comenzar

#### Scenario: Controlar el enfoque desde el temporizador

- **WHEN** existe una tarea activa y el usuario usa el control principal del temporizador para iniciar, pausar o reanudar el enfoque
- **THEN** la sesión de esa tarea activa inicia, se pausa o se reanuda según corresponda
- **AND** la tarjeta Kanban de la tarea activa refleja el mismo estado

#### Scenario: Reiniciar sincroniza el tiempo de la tarea activa

- **WHEN** el modo es Enfoque, existe una tarea activa y el usuario reinicia el temporizador
- **THEN** el tiempo restante persistido de la tarea activa se reinicia a su tiempo de enfoque configurado (o a la duración de enfoque por defecto)
- **AND** la tarjeta Kanban de esa tarea muestra el tiempo reiniciado
