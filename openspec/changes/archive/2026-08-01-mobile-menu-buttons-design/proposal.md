## Why

Los ítems del menú de herramientas en tablet/móvil reutilizan el estilo de botón compacto (`btn-secondary`), pensado para chips de icono centrados. Estirados a todo el ancho se ven como botones apretados en lugar de filas de menú: el contenido no queda claramente alineado a la izquierda, el espaciado es escaso y falta jerarquía. El resultado se siente improvisado frente al resto de la interfaz.

## What Changes

- Los ítems del menú de herramientas (drawer en viewports < 1024px) SHALL presentarse como **filas de menú**, no como botones compactos:
  - Icono en una ranura inicial fija, seguido del texto de la herramienta.
  - Texto e icono **alineados a la izquierda** (el contenido de la fila comienza en el borde izquierdo, sin centrar).
  - Padding cómodo y altura consistente entre filas, apropiado para toque.
  - Estados de hover/activo/foco claros y coherentes con el tema activo (claro/oscuro y color de tema).
- Ajustar la presentación en `ToolsMenu.tsx` (y, si hace falta, un estilo de fila dedicado en `index.css`) sin cambiar qué herramientas se listan ni su comportamiento al seleccionarlas.

## Capabilities

### New Capabilities
<!-- Ninguna. -->

### Modified Capabilities
- `responsive-navigation`: Se precisa el requisito del menú de herramientas dedicado para especificar la presentación de sus ítems como filas de menú con contenido alineado a la izquierda, espaciado cómodo y estados visuales coherentes con el tema.

## Impact

- Código: `src/components/ToolsMenu.tsx` (marcado/estilo de los ítems); posiblemente una clase de fila de menú en `src/index.css`.
- Sin cambios en la barra compacta, en qué herramientas aparecen en el menú, ni en la apertura de sus paneles.
- Sin cambios que rompan compatibilidad; solo presentación.
