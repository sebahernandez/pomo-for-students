## Why

El botón Guardar del panel de Configuración aplica los cambios pero deja el drawer abierto. Para el usuario esto se percibe como que "Guardar no funciona": pulsa Guardar y no pasa nada visible, ya que el panel no se cierra. El comportamiento actual (dejar el drawer abierto al guardar) fue una decisión de diseño previa (commit `542b997`), pero produce fricción y confusión. Se revierte para que Guardar aplique los cambios y cierre el drawer, dando una confirmación clara de que la acción se completó.

## What Changes

- Al pulsar **Guardar** en el panel de Configuración, tras aplicar y normalizar las duraciones, el drawer SHALL cerrarse. **BREAKING** (revierte el comportamiento especificado actual de "aplicar no cierra el drawer").
- Se retira la regla general de que aplicar/guardar dentro de un drawer nunca lo cierra. El drawer sigue cerrándose por sus afordancias explícitas (scrim, botón cerrar, Escape, botón Cancelar), y ahora además por la acción Guardar.
- Los paneles de solo lectura (Historial, Guía) no tienen acción de guardar y no cambian su comportamiento.

## Capabilities

### New Capabilities
<!-- Ninguna: se ajusta comportamiento de capacidades existentes. -->

### Modified Capabilities
- `user-preferences`: al guardar nuevas duraciones, el panel de Configuración ahora se cierra tras aplicar los cambios (antes permanecía abierto).
- `panel-presentation`: se elimina el requisito de que aplicar/guardar cambios no cierre el drawer; una acción de guardar explícita puede cerrarlo.

## Impact

- `src/components/SettingsPanel.tsx`: `handleSubmit` llama a `onClose()` tras `updateSettings(...)`.
- `src/test/Drawer.test.tsx`: las pruebas que afirman que el drawer permanece abierto tras Guardar deben actualizarse para afirmar que se cierra.
- Specs afectadas: `openspec/specs/user-preferences/spec.md` y `openspec/specs/panel-presentation/spec.md`.
- Sin cambios en el store ni en el componente `Drawer`.
