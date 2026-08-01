## Why

En el panel de Configuración, cerrar el drawer con el scrim, la tecla Escape o el botón X descarta silenciosamente cualquier edición no guardada. El usuario puede perder los ajustes que estaba escribiendo sin darse cuenta. Se quiere proteger los cambios sin guardar: mientras haya ediciones pendientes, esos cierres pasivos no deben descartar los cambios de golpe, sino avisar que primero hay que guardar o cancelar.

## What Changes

- El panel de **Configuración** rastrea si hay cambios sin guardar: cuando los campos de duración difieren de la configuración persistida, o cuando el **tema de color** seleccionado difiere del que estaba activo al abrir el panel (el tema se aplica como vista previa en vivo).
- **Guardar** mantiene el tema previsualizado; **Cancelar** revierte el tema al que estaba activo al abrir.
- **Sin** cambios pendientes: cerrar con scrim, Escape o el botón X funciona como hoy (el drawer se cierra).
- **Con** cambios pendientes: intentar cerrar con scrim, Escape o el botón X **no cierra** el drawer; en su lugar se muestra un mensaje indicando que debe **Guardar** los cambios o **Cancelar** para salir.
- **Guardar** aplica los cambios y cierra el drawer (comportamiento vigente).
- **Cancelar** sale del panel descartando los cambios pendientes (salida explícita).
- Alcance: solo el panel de Configuración. Historial y Guía son de solo lectura (sin acción de guardar) y conservan su cierre normal sin cambios.

## Capabilities

### New Capabilities
<!-- Ninguna: se ajusta el comportamiento de capacidades existentes. -->

### Modified Capabilities
- `user-preferences`: el panel de Configuración protege los cambios sin guardar (campos de duración y cambio de tema); los cierres pasivos (scrim, Escape, X) se interceptan con un aviso mientras haya ediciones pendientes, y solo Guardar (aplica y mantiene el tema) o Cancelar (descarta y revierte el tema) permiten salir.
- `panel-presentation`: los mecanismos de cierre (scrim, X, Escape) cierran el drawer solo cuando el panel no tiene cambios sin guardar; un panel con ediciones pendientes puede interceptar esos cierres y avisar en lugar de descartar.

## Impact

- `src/components/SettingsPanel.tsx`: detección de estado "sucio" (dirty), handler de cierre protegido y mensaje de aviso; Cancelar sale descartando.
- `src/components/ThemeSelector.tsx`: los botones de swatch se marcan `type="button"` para que seleccionar un tema no envíe el formulario de Configuración (bug que el guard dejó al descubierto).
- `src/i18n/translations.ts`: nuevas cadenas para el mensaje de aviso (en/es).
- `src/test/Drawer.test.tsx`: pruebas del guard (cierre libre sin cambios; aviso y no cierre con cambios; Guardar/Cancelar salen).
- Specs: `openspec/specs/user-preferences/spec.md` y `openspec/specs/panel-presentation/spec.md`.
