## MODIFIED Requirements

### Requirement: Control de la sesión

El sistema SHALL permitir iniciar, pausar, reanudar y reiniciar el temporizador. Los estados posibles SHALL ser inactivo (`idle`), en marcha (`running`) y pausado (`paused`).

En el modo Enfoque (`work`), iniciar o reanudar la cuenta regresiva SHALL requerir una tarea activa vinculada al temporizador. Sin tarea activa, el temporizador de enfoque SHALL permanecer inactivo y su control de inicio SHALL presentarse deshabilitado junto a un aviso que invite a seleccionar una tarea del tablero. Los modos de Descanso Corto (`shortBreak`) y Descanso Largo (`longBreak`) SHALL poder iniciarse, pausarse y reanudarse libremente, sin exigir tarea activa.

El control principal del temporizador SHALL reflejar el estado de la sesión de la tarea activa y controlarlo: presentar Iniciar/Enfoque cuando está inactivo, Pausar cuando está en marcha y Reanudar cuando está pausado. Este control y los controles de la tarjeta Kanban activa SHALL mantenerse sincronizados, de modo que operar cualquiera de ellos afecta la misma sesión y ambos muestran el mismo estado.

Al reiniciar en modo Enfoque con una tarea activa, el temporizador SHALL volver a la duración de enfoque configurada de esa tarea (o a la duración de enfoque por defecto si la tarea no tiene una) y SHALL reiniciar también el tiempo restante persistido de la tarea, de modo que la tarjeta Kanban refleje el mismo reinicio. En los modos de Descanso, reiniciar SHALL volver a la duración del modo sin afectar a ninguna tarea.

#### Scenario: Iniciar el enfoque con tarea activa

- **WHEN** existe una tarea activa, el modo es Enfoque y el usuario presiona Iniciar estando el temporizador inactivo
- **THEN** el temporizador pasa a estado en marcha y comienza la cuenta regresiva
- **AND** la tarjeta Kanban activa refleja el estado en marcha

#### Scenario: Enfoque bloqueado sin tarea activa

- **WHEN** no existe una tarea activa y el modo es Enfoque
- **THEN** el control de inicio del temporizador se muestra deshabilitado
- **AND** se muestra un aviso que invita a seleccionar una tarea del tablero
- **AND** el temporizador no inicia la cuenta regresiva

#### Scenario: Descanso libre sin tarea activa

- **WHEN** el modo es Descanso Corto o Descanso Largo y el usuario presiona Iniciar
- **THEN** el temporizador pasa a estado en marcha y comienza la cuenta regresiva, aunque no haya tarea activa

#### Scenario: Pausar y reanudar

- **WHEN** el usuario presiona Pausar con el temporizador en marcha
- **THEN** la cuenta regresiva se detiene conservando el tiempo restante
- **WHEN** el usuario presiona Reanudar
- **THEN** la cuenta regresiva continúa desde el tiempo restante conservado

#### Scenario: Control sincronizado entre temporizador y tarjeta activa

- **WHEN** el usuario inicia o pausa la sesión de enfoque desde el control del temporizador
- **THEN** la tarjeta de la tarea activa muestra el mismo estado (en marcha o pausado)
- **WHEN** el usuario inicia o pausa la sesión desde los controles de la tarjeta activa
- **THEN** el control principal del temporizador muestra el mismo estado

#### Scenario: Reiniciar el enfoque con tarea activa

- **WHEN** el modo es Enfoque, existe una tarea activa y el usuario presiona Reiniciar
- **THEN** el tiempo del temporizador vuelve a la duración de enfoque de esa tarea (o a la duración de enfoque por defecto si no tiene una)
- **AND** el tiempo restante persistido de la tarea activa se reinicia al mismo valor
- **AND** la tarjeta Kanban de la tarea activa muestra ese tiempo reiniciado
- **AND** el temporizador queda en estado inactivo

#### Scenario: Reiniciar un descanso no afecta tareas

- **WHEN** el modo es Descanso Corto o Descanso Largo y el usuario presiona Reiniciar
- **THEN** el tiempo vuelve a la duración configurada del modo actual
- **AND** el temporizador queda en estado inactivo
- **AND** no se modifica el tiempo de ninguna tarea
