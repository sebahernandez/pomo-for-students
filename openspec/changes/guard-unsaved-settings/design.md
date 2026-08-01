## Context

Ver `proposal.md` — Why. Estado actual relevante:

- `Drawer` (`src/components/Drawer.tsx`) invoca su prop `onClose` en los tres cierres pasivos: clic en el scrim, tecla Escape y botón X. Es un componente compartido por Configuración, Historial y Guía.
- `SettingsPanel` (`src/components/SettingsPanel.tsx`) recibe `onClose` desde el padre (que desmonta el drawer). Mantiene `form: FormState` (valores string por campo) y `settings` persistido en el store. `handleSubmit` normaliza, llama `updateSettings`, refleja los valores y cierra. El botón Cancelar llama `onClose` directamente.

## Goals / Non-Goals

**Goals:**
- Interceptar los cierres pasivos (scrim, Escape, X) del panel de Configuración cuando hay cambios sin guardar, mostrando un aviso en lugar de descartar.
- Mantener el cierre normal cuando no hay cambios pendientes, y las salidas explícitas Guardar (aplica) y Cancelar (descarta).

**Non-Goals:**
- No cambiar el comportamiento de Historial ni Guía (solo lectura).
- No añadir un modal de confirmación separado; el aviso es inline dentro del panel.
- No tratar cambios de idioma/apariencia como "sin guardar" (fuera del panel de Configuración o aplicados globalmente).

## Decisions

**1. El guard vive en `SettingsPanel`, envolviendo el `onClose` que pasa a `Drawer` — sin modificar `Drawer`.**
`SettingsPanel` define `attemptClose()`: si hay cambios sin guardar, muestra el aviso y no cierra; si no, llama al `onClose` real. Ese `attemptClose` se pasa como `onClose` al `Drawer`, por lo que scrim, Escape y X quedan protegidos automáticamente (los tres usan la misma prop). Guardar y Cancelar siguen llamando al `onClose` real (saltan el guard).
Alternativa descartada: añadir una prop `canClose?/onRequestClose` a `Drawer`. Es innecesaria: como los tres cierres ya delegan en `onClose`, envolver esa función en el panel logra lo mismo sin tocar el componente compartido ni arriesgar a Historial/Guía.

**2. Detección de "sucio" (dirty): comparación del formulario contra lo persistido.**
`isDirty = FIELDS.some(({ key }) => form[key] !== String(settings[key]))`. Reutiliza `FIELDS`, `form` y `settings` existentes; no requiere estado adicional de seguimiento. Tras Guardar (que hace `setForm(toFormState(normalized))`) el panel deja de estar sucio.

**3. El cambio de tema cuenta como edición pendiente, con reversión en Cancelar.**
El tema se aplica en vivo (vista previa) vía `setTheme`. Al abrir el panel se snapshotea `baselineTheme = useState(theme)`. `isDirty` incluye `theme !== baselineTheme`, de modo que scrim/Escape/X avisan si se cambió el tema. Guardar mantiene el tema previsualizado (ya aplicado y persistido); Cancelar llama `setTheme(baselineTheme)` para revertir antes de cerrar. Como `SettingsPanel` se monta de nuevo en cada apertura (`Header.tsx`), el snapshot captura el tema correcto al abrir.
Alternativa descartada: solo avisar sin revertir — deja "Cancelar" sin descartar realmente el tema, incoherente con la semántica del guard.

**4. Aviso inline con estado local `showWarning`.**
Un `useState(false)` que `attemptClose` pone en `true` al bloquear un cierre con cambios pendientes. El mensaje se renderiza junto al pie de acciones (Guardar/Cancelar), usando una nueva cadena i18n en `en` y `es`. El aviso puede limpiarse al editar de nuevo, al guardar o al cancelar (se desmonta el panel).

## Risks / Trade-offs

- [Cancelar con cambios descarta sin confirmar] → Es la salida explícita esperada ("Cancelar para salir"); el aviso ya orienta al usuario a Guardar o Cancelar, así que Cancelar como descarte directo es coherente.
- [El guard aplica a la instancia de `Drawer` de Configuración únicamente] → Correcto por diseño: Historial y Guía usan su propio `onClose` sin envolver, conservando el cierre normal.
- [Comparación string vs. número] → `form` guarda strings y `settings` números; se normaliza con `String(settings[key])`. Un valor en edición como `"05"` vs `"5"` marcaría dirty aunque sea equivalente; es aceptable (el usuario tiene cambios en el campo) y se resuelve al guardar o cancelar.
