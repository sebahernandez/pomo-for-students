## 1. Variables CSS de texto tematizado

- [x] 1.1 Añadir `--theme-text-secondary` y `--theme-text-muted` con valores por defecto en el bloque `@theme` de `src/index.css`
- [x] 1.2 Definir `--theme-text-secondary` y `--theme-text-muted` (variante clara) en cada bloque `html[data-theme="X"]` para los seis temas (neutral, ocean, forest, sunset, rose, midnight), con tinte sutil del tema
- [x] 1.3 Definir ambas variables (variante oscura) en cada bloque `html[data-theme="X"].dark` para los seis temas
- [x] 1.4 (Opcional) Añadir clases utilitarias `.text-theme-secondary` / `.text-theme-muted` en `index.css` para simplificar el uso en los componentes

## 2. Migración de componentes de texto secundario

- [x] 2.1 `ThemeSelector.tsx`: reemplazar `text-neutral-500 dark:text-neutral-400` del label por texto tematizado
- [x] 2.2 `SessionHistory.tsx`: migrar labels, metadatos, estado vacío e iconos atenuados a `--theme-text-secondary` / `--theme-text-muted` según rol
- [x] 2.3 `SettingsPanel.tsx`: migrar los textos grises de ayuda/labels a las variables tematizadas
- [x] 2.4 `OnboardingWizard.tsx`: migrar subtítulos, descripciones y ayudas grises a las variables tematizadas (dejar títulos primarios intactos)
- [x] 2.5 `GuideModal.tsx`: migrar subtítulos y textos atenuados a las variables tematizadas
- [x] 2.6 `DroppableColumn.tsx`: migrar el texto gris de columna a `--theme-text-muted`
- [x] 2.7 `Drawer.tsx`: migrar el texto/icono gris del encabezado a las variables tematizadas
- [x] 2.8 `CookieConsentBanner.tsx`: migrar los textos secundarios grises a las variables tematizadas (respetar textos primarios y de acción)
- [x] 2.9 `Logo.tsx`: revisar los grises (`text-neutral-200`) y migrar los que actúen como texto atenuado, dejando el texto primario del logo

## 3. Verificación

- [x] 3.1 Grep de confirmación: no quedan pares `text-neutral-*` / `dark:text-neutral-*` usados como texto secundario en los componentes afectados
- [x] 3.2 Verificar contraste ≥ 4.5:1 del texto secundario/atenuado sobre su fondo real en los seis temas y en modo claro y oscuro
- [x] 3.3 Revisión visual: recorrer paneles (historial, ajustes, onboarding, guía, kanban, cookies) alternando temas y modo claro/oscuro para confirmar coherencia y legibilidad
- [x] 3.4 Ejecutar la suite de tests y el typecheck/lint para asegurar que no hay regresiones

## 4. Controles de formulario tematizados

- [x] 4.1 `.input-glass`: texto ingresado → `var(--theme-text-secondary)`, eliminando el override de color en `html.dark`
- [x] 4.2 `.input-glass::placeholder`: → `var(--theme-text-muted)` con `opacity: 1`, eliminando el placeholder oscuro `#525252` de `html.dark`
- [x] 4.3 `.btn-secondary`: etiqueta → `var(--theme-text-secondary)` en reposo y hover, eliminando los grises fijos y los overrides de color en `html.dark`
- [x] 4.4 Verificar contraste ≥ 4.5:1 del texto de input y ≥ 4.5:1 (o cerca) del placeholder y etiqueta de botón, en los seis temas y ambos modos
- [x] 4.5 Ejecutar build, lint y tests para confirmar que no hay regresiones
