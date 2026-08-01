## Context

Ver `proposal.md` — Why. El encabezado actual (`src/components/Header.tsx`) renderiza un `<Logo />` a la izquierda y una fila fija de cinco `btn-secondary` a la derecha, sin variación por breakpoint. El estado de apertura de los tres paneles (Configuración, Historial, Guía) ya vive en `Header` con `useState`, y cada panel se presenta con el componente `Drawer` (`src/components/Drawer.tsx`), que ya implementa scrim, cierre por scrim/botón/Escape y animación de deslizamiento (ver capability `panel-presentation`). El proyecto usa Tailwind v4 con breakpoints estándar (`lg` = 1024px) y clase `.dark` para modo oscuro. `Logo` muestra un título y un tagline; el tagline puede ser largo.

## Goals / Non-Goals

**Goals:**
- Layout responsivo del encabezado con umbral en `lg` (1024px): barra completa en escritorio, barra compacta + menú en tablet/móvil.
- Reutilizar `Drawer` para el menú de herramientas, heredando su accesibilidad y consistencia.
- Reubicar el logo para que no interfiera con los controles en móvil.

**Non-Goals:**
- No se modifica el contenido ni el comportamiento de los paneles Configuración/Historial/Guía.
- No se cambia el patrón de drawer (`panel-presentation`) ni se añade routing.
- No se rediseña el logo; solo se ajusta el comportamiento responsivo de su tagline.

## Decisions

### Decisión 1: Umbral responsivo en `lg` (1024px) con utilidades de Tailwind

La barra completa se muestra con `hidden lg:flex` y la barra compacta con `flex lg:hidden`. Se eligió `lg` (y no `md`) para cubrir tablets en horizontal (hasta ~1024px), según la intención de "tablets y móviles". No se usa detección por JS (userAgent/resize) para evitar parpadeos y estado extra; las media queries de Tailwind son suficientes y SSR-safe.

**Alternativa considerada:** un único set de botones con overflow/scroll horizontal. Se descarta: no resuelve el apiñamiento ni la interferencia del logo, y empeora la ergonomía táctil.

### Decisión 2: El menú de herramientas es un `Drawer` reutilizado

Se crea un componente `ToolsMenu` (o equivalente) que usa `Drawer` con `title="Herramientas"` y lista tres ítems (Guía, Historial, Configuración) como filas accionables. Seleccionar un ítem cierra el menú y abre el panel correspondiente. Para coordinar "cerrar menú → abrir panel", el estado de los paneles permanece en `Header`; el menú recibe callbacks (`onOpenGuide`, `onOpenHistory`, `onOpenSettings`) que primero cierran el menú y luego setean el panel destino.

**Alternativa considerada:** dropdown/popover anclado al botón. Se descarta a favor del drawer por consistencia con el resto de la app (mismo scrim, cierre y animación) y por evitar lógica de posicionamiento/*click-outside* propia. Trade-off: el drawer es visualmente más pesado que un popover para un menú corto; se acepta por coherencia.

### Decisión 3: Controles siempre visibles = Idioma + Modo claro/oscuro

En la barra compacta se mantienen Idioma y Modo claro/oscuro como acciones directas (uso frecuente, un toque), y el botón de menú agrupa el resto. El botón de menú usa un icono de menú (p. ej. `IconMenu2` de Tabler) con `aria-label` y `title` traducibles.

### Decisión 4: Logo no invasivo en móvil

El contenedor del logo usa `min-w-0` y el encabezado mantiene `justify-between`, de modo que los controles conserven su ancho y el logo no los empuje. El tagline del logo se oculta en anchos reducidos (`hidden min-[380px]:block` o `truncate` con `max-w`), preservando el título principal. Así el logo conserva su ubicación (izquierda) sin solaparse ni provocar desbordamiento horizontal.

## Risks / Trade-offs

- **Duplicación de la lista de acciones** (barra de escritorio y menú) → Extraer la definición de cada herramienta (icono, label, handler) a una estructura compartida dentro de `Header` para renderizar ambas vistas desde una sola fuente y evitar divergencias.
- **Doble drawer momentáneo** (menú abierto y luego panel) → Al seleccionar un ítem, cerrar el menú antes (o en el mismo tick) de abrir el panel para no apilar dos scrims; verificar que solo un drawer quede montado.
- **Foco y accesibilidad del menú** → Al reutilizar `Drawer` se heredan scrim/Escape/`aria-modal`; asegurar `aria-label`/`title` traducibles en el botón de menú y en los ítems.
- **Tagline oculto en móvil** → Se pierde el subtítulo en pantallas muy pequeñas; es una concesión deliberada para no interferir con los controles y evitar desbordamiento.
