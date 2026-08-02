# pomodoro-timer Specification

## Purpose
El temporizador Pomodoro es el núcleo de la aplicación: permite al usuario ejecutar sesiones cronometradas de enfoque y descanso, controlar su avance y recibir señales claras al inicio y fin de cada sesión.
## Requirements
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

### Requirement: Cuenta regresiva

Mientras el temporizador está en marcha, el sistema SHALL disminuir el tiempo restante en un segundo cada segundo y SHALL mostrarlo en formato `MM:SS`.

#### Scenario: Descuento por segundo

- **WHEN** el temporizador está en marcha
- **THEN** el tiempo restante disminuye en 1 segundo cada segundo transcurrido
- **AND** la visualización se actualiza en formato `MM:SS` con relleno de ceros

### Requirement: Edición de duración en vivo

El sistema SHALL permitir editar la duración del temporizador haciendo clic sobre el tiempo mostrado, únicamente cuando el temporizador está inactivo. El valor aceptado SHALL estar entre 1 y 120 minutos. En el modo Enfoque, esta edición SHALL estar disponible solo cuando existe una tarea activa y SHALL ajustar la duración de esa tarea; sin tarea activa la edición del tiempo de enfoque SHALL quedar deshabilitada.

#### Scenario: Editar minutos con valor válido

- **WHEN** el usuario, con el temporizador inactivo y (en modo Enfoque) con una tarea activa, hace clic en el tiempo e ingresa un valor entre 1 y 120 y confirma
- **THEN** el tiempo restante se ajusta a ese número de minutos

#### Scenario: Rechazar valor fuera de rango

- **WHEN** el usuario ingresa un valor menor a 1 o mayor a 120
- **THEN** el sistema no modifica el tiempo restante

#### Scenario: Edición bloqueada mientras corre

- **WHEN** el temporizador está en marcha o pausado
- **THEN** el sistema no permite editar la duración haciendo clic en el tiempo

#### Scenario: Edición de enfoque bloqueada sin tarea activa

- **WHEN** el modo es Enfoque y no existe una tarea activa
- **THEN** el sistema no permite editar la duración del temporizador haciendo clic en el tiempo

### Requirement: Transición automática al completar

Cuando el tiempo restante llega a cero con el temporizador en marcha, el sistema SHALL reproducir un sonido de finalización y cambiar automáticamente de modo. Al completar una sesión de Enfoque SHALL registrar una sesión completada y pasar a Descanso Corto; al completar un descanso SHALL volver a Enfoque.

#### Scenario: Fin de sesión de enfoque

- **WHEN** una sesión de Enfoque llega a 0 segundos en marcha
- **THEN** se reproduce el sonido de finalización
- **AND** se incrementa el contador de sesiones completadas
- **AND** el temporizador cambia al modo Descanso Corto

#### Scenario: Fin de sesión de descanso

- **WHEN** una sesión de descanso llega a 0 segundos en marcha
- **THEN** se reproduce el sonido de finalización
- **AND** el temporizador vuelve al modo Enfoque

### Requirement: Indicador visual de progreso

El sistema SHALL mostrar un anillo de progreso circular que refleje la fracción de tiempo transcurrida de la sesión actual. En estado inactivo el progreso SHALL ser 0%.

#### Scenario: Progreso durante la sesión

- **WHEN** el temporizador avanza en marcha
- **THEN** el anillo de progreso crece proporcionalmente al tiempo transcurrido respecto a la duración total de la sesión

#### Scenario: Sin progreso en inactivo

- **WHEN** el temporizador está inactivo
- **THEN** el anillo de progreso muestra 0%

### Requirement: Contador de sesiones completadas

El sistema SHALL mostrar la cantidad de sesiones de enfoque completadas en la sesión de uso actual.

#### Scenario: Visualización del conteo

- **WHEN** el usuario ha completado una o más sesiones de enfoque
- **THEN** la interfaz muestra el total de sesiones completadas con su etiqueta traducida

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

