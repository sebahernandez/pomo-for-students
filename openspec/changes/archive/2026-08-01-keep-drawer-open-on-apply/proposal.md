## Why

Hoy, al guardar la configuración, el drawer se cierra automáticamente (`SettingsPanel` llama a `onClose` tras `updateSettings`). Esto interrumpe el flujo: el usuario no puede confirmar visualmente que su cambio se aplicó ni seguir ajustando otras opciones sin reabrir el panel. El cierre debe ser una acción explícita del usuario, no un efecto secundario de aplicar un cambio.

## What Changes

- Al **aplicar/guardar** un cambio dentro de un drawer (p. ej. Guardar en Configuración), el drawer **NO** se cierra: permanece abierto con el cambio ya aplicado.
- El drawer se cierra **solo** mediante afordancias explícitas de cierre: clic/tap en el scrim (fuera del panel), el botón de cerrar (X) de la esquina superior, la tecla Escape y los botones de cierre del pie (Cancelar / Cerrar) que ya existen.
- No se elimina ninguna vía de cierre existente (Escape y botones del pie se conservan); solo se desacopla "guardar" de "cerrar".

## Capabilities

### New Capabilities
<!-- Ninguna -->

### Modified Capabilities
- `panel-presentation`: Se añade el principio de que aplicar/guardar cambios dentro de un drawer no lo cierra; el cierre ocurre únicamente por afordancias explícitas.
- `user-preferences`: Guardar nuevas duraciones ya no cierra el panel de Configuración; el panel permanece abierto tras guardar.

## Impact

- **Componentes**: `src/components/SettingsPanel.tsx` — `handleSubmit` deja de llamar a `onClose`.
- **Sin cambios** en `Drawer.tsx` (sus vías de cierre ya son explícitas), ni en `SessionHistory`/`GuideModal` (no tienen una acción de "aplicar").
- **Tests**: Añadir prueba de que guardar en Configuración mantiene el drawer abierto y aplica el cambio; conservar las pruebas de cierre por scrim, X y Escape.
