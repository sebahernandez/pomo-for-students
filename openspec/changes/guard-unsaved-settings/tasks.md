## 1. i18n

- [x] 1.1 En `src/i18n/translations.ts`, agregar una cadena para el aviso de cambios sin guardar (p. ej. `unsavedChanges`) en `en` y `es` (ej.: "Tienes cambios sin guardar. Guarda los cambios o cancela para salir.").

## 2. Guard de cambios sin guardar en Configuración

- [x] 2.1 En `src/components/SettingsPanel.tsx`, calcular `isDirty` comparando `form` contra la configuración persistida (`FIELDS.some(({ key }) => form[key] !== String(settings[key]))`).
- [x] 2.2 Agregar estado local `showWarning` y un handler `attemptClose()`: si `isDirty`, mostrar el aviso y NO cerrar; si no, llamar al `onClose` real.
- [x] 2.3 Pasar `attemptClose` como `onClose` del `Drawer` (protege scrim, Escape y X). Mantener Guardar (aplica + `onClose` real) y Cancelar (`onClose` real, descarta) saltando el guard.
- [x] 2.4 Renderizar el mensaje de aviso (`t.unsavedChanges`) junto al pie de acciones cuando `showWarning` esté activo.

## 3. Cambio de tema como cambio sin guardar

- [x] 3.0a En `src/components/SettingsPanel.tsx`, obtener `theme`/`setTheme` del store y snapshotear el tema al abrir el panel (`baselineTheme`).
- [x] 3.0b Incluir el cambio de tema en `isDirty` (`theme !== baselineTheme`) para que scrim/Escape/X avisen.
- [x] 3.0c Cancelar revierte el tema a `baselineTheme` antes de cerrar; Guardar mantiene el tema previsualizado.
- [x] 3.0d En `src/components/ThemeSelector.tsx`, marcar los botones de swatch como `type="button"` para que no envíen el formulario de Configuración al seleccionarlos.

## 4. Pruebas

- [x] 3.1 En `src/test/Drawer.test.tsx`, agregar prueba: con un campo modificado, intentar cerrar (Escape/scrim/X) NO invoca `onClose` y muestra el aviso.
- [x] 3.2 Agregar prueba: sin cambios, cerrar por Escape/scrim/X invoca `onClose` normalmente.
- [x] 3.3 Agregar/ajustar prueba: con cambios, Cancelar invoca `onClose` (descarta) y Guardar aplica + invoca `onClose`.
- [x] 3.4 Ejecutar la suite completa de tests y el typecheck.
