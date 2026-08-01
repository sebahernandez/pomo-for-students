## Why

Los textos secundarios y atenuados de la interfaz (etiquetas, subtítulos, metadatos, ayudas) usan grises fijos de Tailwind (`text-neutral-400`, `text-neutral-500`, etc.) que no siguen al tema de color seleccionado. Mientras el footer y las tarjetas Kanban ya están tematizados, estos textos grises se ven desconectados del tema activo (Ocean, Forest, Sunset, Rose, Midnight) y su ajuste claro/oscuro es manual e inconsistente entre componentes. El resultado es una apariencia incoherente y, en algunos casos, contraste pobre.

## What Changes

- Introducir variables CSS de texto tematizado —`--theme-text-secondary` y `--theme-text-muted`— definidas por tema y por modo claro/oscuro, con un tinte sutil derivado del color del tema en lugar de gris neutro.
- Reemplazar los grises fijos `text-neutral-*` (y sus pares `dark:text-neutral-*`) usados para texto secundario/atenuado por las variables tematizadas, en los componentes afectados: `ThemeSelector`, `SettingsPanel`, `SessionHistory`, `OnboardingWizard`, `GuideModal`, `DroppableColumn`, `Drawer`, `CookieConsentBanner` y `Logo`.
- Tematizar el texto de los controles de formulario: texto ingresado y placeholder de `.input-glass`, y la etiqueta de `.btn-secondary`, reemplazando sus grises fijos por las variables tematizadas. En particular, corregir el placeholder oscuro casi invisible en modo oscuro (`#525252`).
- Garantizar que cada texto tematizado mantenga contraste legible (mínimo WCAG AA, 4.5:1 para texto normal) contra su fondo en los seis temas y en ambos modos.
- No se altera el contenido, la estructura ni el comportamiento de los componentes; solo su presentación de color de texto.

## Capabilities

### New Capabilities
<!-- Ninguna capacidad nueva; esto extiende preferencias de usuario existentes. -->

### Modified Capabilities
- `user-preferences`: Se añade el requisito de que el texto secundario/atenuado de la interfaz siga al tema seleccionado y respete el modo claro/oscuro, manteniendo contraste legible — en línea con los requisitos ya existentes de "Footer tematizado" y "Tarjetas Kanban tematizadas".

## Impact

- **CSS**: `src/index.css` — nuevas variables `--theme-text-secondary` / `--theme-text-muted` por bloque de tema (claro y oscuro) y en `@theme`; reutilizadas en `.input-glass` (texto y placeholder) y `.btn-secondary` (etiqueta), eliminando sus grises fijos y los overrides de color en modo oscuro.
- **Componentes**: `src/components/ThemeSelector.tsx`, `SettingsPanel.tsx`, `SessionHistory.tsx`, `OnboardingWizard.tsx`, `GuideModal.tsx`, `DroppableColumn.tsx`, `Drawer.tsx`, `CookieConsentBanner.tsx`, `Logo.tsx`.
- **Sin cambios** en lógica de estado, persistencia ni API. Cambio puramente visual sobre la capa de theming ya existente (`useThemeColors`, `data-theme`, clase `.dark`).
