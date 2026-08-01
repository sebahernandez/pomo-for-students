## Why

En el encabezado se muestran cinco botones (Guía, Idioma, Modo claro/oscuro, Historial y Configuración) junto al logo. En viewports de tablet y móvil (< 1024px) esa fila se aprieta contra el logo, reduce el área táctil y hace que el logo compita por el espacio con los controles. Se necesita una presentación compacta que mantenga a la vista solo los controles de uso más frecuente y agrupe el resto de herramientas en un menú dedicado.

## What Changes

- Introducir un punto de quiebre responsivo en el encabezado: en escritorio (≥ 1024px) se conservan los cinco botones actuales; en tablet y móvil (< 1024px) se muestra una barra compacta.
- En la barra compacta, dejar visibles únicamente **Idioma** y **Modo claro/oscuro**, más un **botón de menú** que abre un drawer lateral dedicado de "Herramientas".
- El drawer de Herramientas SHALL listar las acciones desplazadas (Guía, Historial, Configuración); al elegir una, se abre su panel/drawer existente.
- Reubicar el **logo** en la vista móvil para que conserve su posición (extremo izquierdo) sin invadir ni empujar los controles: el texto secundario (tagline) se oculta o trunca en anchos reducidos para no desbordar.
- No cambia ninguna funcionalidad de las herramientas ni el comportamiento de los paneles existentes; solo cambia cómo se accede a ellas en pantallas pequeñas.

## Capabilities

### New Capabilities
- `responsive-navigation`: Presentación responsiva del encabezado y acceso a las herramientas — barra completa en escritorio y barra compacta con menú de herramientas (drawer) en tablet/móvil, más la ubicación no invasiva del logo.

### Modified Capabilities
<!-- Ninguna. Los paneles (panel-presentation) y las preferencias no cambian su comportamiento; solo el punto de acceso en móvil. -->

## Impact

- **Componentes**: `src/components/Header.tsx` (layout responsivo + estado del menú), nuevo componente de menú de herramientas (drawer) reutilizando `src/components/Drawer.tsx`, y ajustes menores en `src/components/Logo.tsx` para el comportamiento del tagline en móvil.
- **i18n**: `src/i18n/translations.ts` — etiquetas nuevas ("Herramientas"/"Tools", "Menú"/"Menu" y títulos de los ítems si faltan).
- **Sin cambios** en la lógica de estado, persistencia ni en los paneles de Configuración/Historial/Guía; se reutilizan tal cual.
