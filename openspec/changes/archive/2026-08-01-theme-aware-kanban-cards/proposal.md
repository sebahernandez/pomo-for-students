## Why

Tras tematizar el footer, las **tarjetas del tablero Kanban** siguen usando colores fijos que ignoran el tema seleccionado, rompiendo la coherencia visual. Peor aún, sus colores actuales tienen problemas de contraste: las tarjetas inactivas usan fondo negro en modo claro (con texto oscuro) y fondo blanco en modo oscuro (con texto claro), lo que deja el texto casi ilegible. Este cambio hace que las tarjetas adapten su estilo al tema activo y garantiza contrastes de texto legibles en los seis temas y en ambos modos, validados con la guía de UX/UI.

## What Changes

- Las tarjetas de tarea (estados activo e inactivo) SHALL aplicar los colores del tema seleccionado (superficie, borde, texto y acentos), de forma coherente con los paneles y el footer, respetando el modo claro/oscuro.
- Se corrige el contraste del texto de las tarjetas para cumplir un mínimo legible (WCAG AA) en los 6 temas × 2 modos, reemplazando los colores fijos invertidos actuales.
- Verificación de contraste apoyada en la skill de UX/UI (`frontend-design`) y en medición de contraste WCAG.
- Sin cambios en contenido, acciones, drag & drop ni estructura de las tarjetas. Sin cambios de API ni dependencias. No hay cambios **BREAKING**.

## Capabilities

### New Capabilities
<!-- Ninguna. -->

### Modified Capabilities
- `user-preferences`: Se añade un requisito de que las tarjetas del tablero Kanban reflejen el tema seleccionado con contraste de texto legible (extiende la cobertura de tematización de la interfaz, en línea con el footer).

## Impact

- **Código afectado**: `src/components/Card.tsx` (consumirá `useThemeColors()` para superficie/borde/texto/acentos en vez de clases fijas). `SortableCard.tsx`/`DroppableColumn.tsx` sin cambios funcionales.
- **Comportamiento observable**: los colores de las tarjetas cambian con el tema y el modo claro/oscuro, con texto legible.
- **Sin impacto** en API, datos, persistencia ni dependencias.
