## ADDED Requirements

### Requirement: Presentación de los ítems del menú de herramientas

Los ítems del menú de herramientas (drawer en viewports < 1024px) SHALL presentarse como filas de menú, no como botones compactos. Cada fila SHALL mostrar el icono de la herramienta en una ranura inicial fija seguido de su etiqueta de texto, con el contenido alineado a la izquierda (la fila comienza en el borde inicial, sin centrar el contenido). Las filas SHALL ocupar todo el ancho del menú, mantener una altura consistente entre sí y un padding cómodo apropiado para interacción táctil. Las filas SHALL exponer estados de hover, activo y foco claros y coherentes con el tema activo (modo claro/oscuro y color de tema). Esta presentación SHALL respetar el contraste de texto legible (mínimo WCAG AA, 4.5:1 para texto normal) en ambos modos. El contenido del menú —qué herramientas se listan y el panel que abre cada una— no cambia; solo su presentación.

#### Scenario: Ítems alineados a la izquierda

- **WHEN** el usuario abre el menú de herramientas en un viewport < 1024px
- **THEN** cada ítem muestra su icono seguido de la etiqueta con el contenido alineado a la izquierda
- **AND** la etiqueta no aparece centrada dentro de la fila

#### Scenario: Filas de ancho completo y espaciado consistente

- **WHEN** el menú de herramientas está abierto
- **THEN** cada ítem se presenta como una fila de ancho completo con altura y padding consistentes entre las filas

#### Scenario: Estados visuales coherentes con el tema

- **WHEN** el usuario pasa el cursor, enfoca o activa un ítem del menú, con cualquier tema y en modo claro u oscuro
- **THEN** la fila muestra un estado visual claro (hover/activo/foco) coherente con el tema
- **AND** el texto del ítem mantiene un contraste legible respecto a su fondo
