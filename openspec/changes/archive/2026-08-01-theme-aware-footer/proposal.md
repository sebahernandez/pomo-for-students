## Why

Al seleccionar un tema de color, los paneles principales (temporizador, tablero) actualizan sus colores mediante `useThemeColors()`, pero el **footer** conserva colores neutrales fijos. El resultado es una interfaz visualmente inconsistente: el pie de página "rompe" el tema activo. La spec de `user-preferences` ya promete que las superficies y acentos de la interfaz reflejan el tema seleccionado, y el footer es hoy la excepción.

## What Changes

- El footer SHALL aplicar los colores del tema seleccionado (fondo/superficie, borde, texto y acentos) igual que el resto de la interfaz, respetando además el modo claro/oscuro.
- Se reemplazan las clases neutrales fijas del footer por los valores del tema activo, manteniendo legibilidad (contraste) en los seis temas y en ambos modos.
- Sin cambios de contenido, enlaces ni estructura del footer. Sin cambios de API ni dependencias. No hay cambios **BREAKING**.

## Capabilities

### New Capabilities
<!-- Ninguna. -->

### Modified Capabilities
- `user-preferences`: Se añade un requisito explícito de que el footer refleje el tema de color seleccionado (antes su comportamiento contradecía el requisito general de tematización de la interfaz).

## Impact

- **Código afectado**: `src/components/Footer.tsx` (consumirá `useThemeColors()`); posible uso del hook existente `src/hooks/useThemeColors.ts` sin modificarlo.
- **Comportamiento observable**: los colores del footer cambian al cambiar de tema y de modo claro/oscuro.
- **Sin impacto** en API, datos, dependencias ni persistencia.
