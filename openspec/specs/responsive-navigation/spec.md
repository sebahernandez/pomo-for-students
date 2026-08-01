# responsive-navigation Specification

## Purpose
Define cómo se presenta el encabezado de la aplicación y cómo se accede a las herramientas según el tamaño del viewport, ofreciendo una barra completa en escritorio y una barra compacta con un menú dedicado en tablet y móvil, sin que el logo interfiera con los controles.
## Requirements
### Requirement: Barra de herramientas completa en escritorio

En viewports de escritorio (ancho ≥ 1024px) el encabezado SHALL mostrar de forma directa todos los controles de herramientas: Guía, Idioma, Modo claro/oscuro, Historial y Configuración. En este tamaño NO SHALL mostrarse el botón de menú de herramientas.

#### Scenario: Escritorio muestra todos los controles

- **WHEN** el usuario ve el encabezado en un viewport de ancho ≥ 1024px
- **THEN** se muestran directamente los controles de Guía, Idioma, Modo claro/oscuro, Historial y Configuración
- **AND** no se muestra el botón de menú de herramientas

### Requirement: Barra compacta en tablet y móvil

En viewports de tablet y móvil (ancho < 1024px) el encabezado SHALL mostrar una barra compacta que deja a la vista únicamente los controles de Idioma y Modo claro/oscuro, más un botón de menú de herramientas. Los controles de Guía, Historial y Configuración NO SHALL mostrarse directamente en la barra; SHALL quedar accesibles a través del menú.

#### Scenario: Móvil/tablet muestra solo idioma, modo y menú

- **WHEN** el usuario ve el encabezado en un viewport de ancho < 1024px
- **THEN** se muestran a la vista solo los controles de Idioma y Modo claro/oscuro y un botón de menú de herramientas
- **AND** los controles de Guía, Historial y Configuración no aparecen directamente en la barra

#### Scenario: Cambio de idioma y modo siguen accesibles directamente

- **WHEN** el usuario está en un viewport < 1024px
- **THEN** puede cambiar el idioma y alternar el modo claro/oscuro directamente desde la barra sin abrir el menú

### Requirement: Menú de herramientas dedicado

El botón de menú de herramientas SHALL abrir un drawer lateral dedicado que lista las herramientas desplazadas (Guía, Historial y Configuración). Al seleccionar una herramienta del menú, el sistema SHALL abrir el panel correspondiente existente. El menú SHALL poder cerrarse mediante el scrim, un botón de cerrar y la tecla Escape, de forma coherente con los demás drawers de la aplicación.

#### Scenario: Abrir el menú de herramientas

- **WHEN** el usuario activa el botón de menú en un viewport < 1024px
- **THEN** se abre un drawer lateral que lista Guía, Historial y Configuración

#### Scenario: Seleccionar una herramienta del menú

- **WHEN** el usuario selecciona una herramienta (por ejemplo, Configuración) en el menú
- **THEN** el menú se cierra y se abre el panel correspondiente a esa herramienta

#### Scenario: Cerrar el menú sin elegir

- **WHEN** el usuario toca el scrim, activa el botón de cerrar o presiona Escape con el menú abierto
- **THEN** el menú se cierra sin abrir ningún panel

### Requirement: Ubicación no invasiva del logo en móvil

En la vista móvil el logo SHALL conservar su ubicación en el extremo izquierdo del encabezado sin invadir, solaparse ni empujar fuera de la vista a los controles del lado derecho. Cuando el ancho disponible sea reducido, el texto secundario del logo (tagline) SHALL ocultarse o truncarse para evitar el desbordamiento, manteniendo visible el título principal.

#### Scenario: El logo no interfiere con los controles

- **WHEN** el usuario ve el encabezado en un viewport móvil estrecho
- **THEN** el logo permanece anclado a la izquierda y los controles permanecen visibles y accesibles a la derecha
- **AND** ni el logo ni su tagline se solapan con los controles ni provocan desbordamiento horizontal

#### Scenario: Tagline del logo en anchos reducidos

- **WHEN** el ancho del viewport es demasiado pequeño para mostrar el tagline sin empujar los controles
- **THEN** el tagline se oculta o trunca mientras el título principal del logo permanece visible

