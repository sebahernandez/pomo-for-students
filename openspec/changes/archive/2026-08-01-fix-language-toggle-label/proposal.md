## Why

El botón de cambio de idioma muestra el idioma **actual** en lugar del idioma al que cambiará. Esto invierte la señal esperada: estando la app en inglés muestra "EN" (y en español "ES"), cuando la convención habitual de un conmutador de idioma es indicar el idioma de destino. El usuario percibe la etiqueta como invertida y no comunica la acción que realiza el botón.

## What Changes

- El botón de idioma en el encabezado SHALL mostrar el código del idioma **de destino** (el idioma al que cambiará al pulsarlo), no el idioma activo:
  - Con la app en inglés (`en`) el botón muestra "ES".
  - Con la app en español (`es`) el botón muestra "EN".
- Ajustar la etiqueta en `Header.tsx` para derivarla del idioma opuesto al activo, en lugar de `language.toUpperCase()`.

## Capabilities

### New Capabilities
<!-- Ninguna. -->

### Modified Capabilities
- `user-preferences`: Se precisa el requisito "Idioma de la interfaz" para especificar que la etiqueta del conmutador de idioma indica el idioma de destino (el opuesto al activo), no el idioma actual.

## Impact

- Código: `src/components/Header.tsx` (etiqueta del botón de idioma; el handler `toggleLang` ya alterna correctamente).
- Sin cambios en el estado, la persistencia (`pomo-lang`) ni en las traducciones (`src/i18n/translations.ts`).
- Sin cambios que rompan compatibilidad.
