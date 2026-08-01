## MODIFIED Requirements

### Requirement: Configuración de duraciones

El sistema SHALL permitir ajustar las duraciones en minutos de Enfoque, Descanso Corto y Descanso Largo. Durante la edición, cada campo numérico SHALL comportarse como un campo de texto que acepta un valor vacío o parcial sin corromper la configuración guardada. Al guardar, el sistema SHALL transformar y validar cada valor ingresado: parsearlo a un entero y recortarlo (clamp) al rango permitido del campo; si el valor es vacío o inválido, SHALL conservar el valor previamente guardado en lugar de persistir `0` o un valor no numérico. Solo se persisten duraciones válidas dentro de rango.

Al guardar nuevas duraciones, el temporizador SHALL recargar el tiempo del modo actual y quedar inactivo. Tras aplicar y normalizar los valores, el panel de Configuración SHALL cerrarse, dando una confirmación clara de que la acción se completó.

El panel de Configuración SHALL proteger los cambios sin guardar. El sistema SHALL considerar que hay cambios sin guardar cuando algún campo difiere de la configuración persistida, o cuando el tema de color seleccionado difiere del que estaba activo al abrir el panel. El tema se aplica como vista previa en vivo mientras el panel está abierto. Mientras existan cambios sin guardar, los mecanismos de cierre pasivos del drawer (clic o tap en el scrim, tecla Escape, botón de cerrar del panel) NO SHALL cerrar el panel ni descartar las ediciones; en su lugar, el sistema SHALL mostrar un mensaje que indique que el usuario debe Guardar los cambios o Cancelar para salir. Con cambios sin guardar, el panel SHALL cerrarse únicamente mediante Guardar (que aplica los cambios y mantiene el tema previsualizado) o Cancelar (que descarta las ediciones, revierte el tema al que estaba activo al abrir el panel, y sale). Cuando no existan cambios sin guardar, los mecanismos de cierre del drawer SHALL funcionar de forma normal.

#### Scenario: Guardar nuevas duraciones

- **WHEN** el usuario ingresa duraciones válidas y guarda en la configuración
- **THEN** las duraciones se aplican a los modos correspondientes
- **AND** el temporizador se recarga con la duración del modo actual en estado inactivo
- **AND** el panel de configuración se cierra

#### Scenario: Editar un campo dejándolo vacío o parcial

- **WHEN** el usuario borra el contenido de un campo numérico o escribe un valor parcial
- **THEN** el campo permite quedar vacío o parcial mientras se edita
- **AND** no se corrompe la configuración guardada mientras el usuario no guarda

#### Scenario: Guardar con un valor vacío o inválido

- **WHEN** el usuario deja un campo vacío o con un valor no numérico y pulsa Guardar
- **THEN** ese campo conserva el valor previamente guardado (o el valor por defecto)
- **AND** no se persiste `0` ni un valor no numérico para ese campo
- **AND** el panel de configuración se cierra con la configuración válida aplicada

#### Scenario: Guardar con un valor fuera de rango

- **WHEN** el usuario ingresa un número por debajo del mínimo o por encima del máximo permitido y pulsa Guardar
- **THEN** el valor se recorta al límite del rango correspondiente antes de persistirse
- **AND** el panel de configuración se cierra con el valor recortado ya guardado

#### Scenario: Intentar cerrar con cambios sin guardar

- **WHEN** el usuario modificó algún campo y todavía no ha guardado, y trata de cerrar el panel mediante el scrim, la tecla Escape o el botón de cerrar
- **THEN** el panel NO se cierra ni descarta las ediciones
- **AND** se muestra un mensaje indicando que debe Guardar los cambios o Cancelar para salir

#### Scenario: Cancelar con cambios sin guardar

- **WHEN** el usuario tiene cambios sin guardar y activa Cancelar
- **THEN** el panel se cierra descartando las ediciones sin persistirlas

#### Scenario: Cerrar sin cambios pendientes

- **WHEN** el panel no tiene cambios sin guardar y el usuario usa el scrim, Escape o el botón de cerrar
- **THEN** el panel se cierra normalmente

#### Scenario: Cambiar el tema cuenta como cambio sin guardar

- **WHEN** el usuario selecciona un tema de color distinto al que estaba activo al abrir el panel y trata de cerrar mediante el scrim, la tecla Escape o el botón de cerrar
- **THEN** el panel NO se cierra
- **AND** se muestra el mensaje indicando que debe Guardar los cambios o Cancelar para salir

#### Scenario: Cancelar revierte el tema previsualizado

- **WHEN** el usuario cambió el tema durante la sesión del panel y activa Cancelar
- **THEN** el panel se cierra
- **AND** el tema vuelve al que estaba activo al abrir el panel

#### Scenario: Guardar mantiene el tema seleccionado

- **WHEN** el usuario cambió el tema y pulsa Guardar
- **THEN** el panel se cierra
- **AND** el tema seleccionado se mantiene
