## Context

Ver `proposal.md` — Why. La app ya tiene una capa de theming basada en:
- El atributo `data-theme="<tema>"` en `<html>` y la clase `.dark` (togglada por `DarkModeInit` / `AppContext`).
- Variables CSS por tema en `src/index.css`: `--theme-primary`, `--theme-primary-hover`, `--theme-secondary`, `--theme-accent`, `--theme-glow`, `--theme-gradientEnd`, definidas en bloques `html[data-theme="X"]` y `html[data-theme="X"].dark`.
- El hook `useThemeColors()` que devuelve el objeto de color activo desde `src/themes/index.ts`.

El texto secundario/atenuado, en cambio, se pinta con clases fijas de Tailwind como `text-neutral-500 dark:text-neutral-400`. Estas no dependen de `data-theme`, así que son idénticas para los seis temas. Ya existe precedente de tematizar por CSS vars: los requisitos "Footer tematizado" y "Tarjetas Kanban tematizadas" en `user-preferences`.

## Goals / Non-Goals

**Goals:**
- Que el texto secundario/atenuado tome un tinte del tema activo y la variante correcta según claro/oscuro, con contraste AA garantizado.
- Reutilizar el mecanismo existente de variables CSS por `data-theme`/`.dark` en vez de introducir un sistema nuevo.
- Cambio localizado y mecánico por componente, sin tocar lógica de estado.

**Non-Goals:**
- No se retematiza el texto **primario** (títulos, valores fuertes) ni los acentos; solo el texto secundario/atenuado que hoy es gris neutro.
- No se cambian iconos decorativos salvo cuando comparten la misma clase de color que un texto atenuado adyacente y conviene alinearlos.
- No se rediseña la paleta de temas ni se añaden temas nuevos.

## Decisions

### Decisión 1: Dos variables CSS nuevas por tema — `--theme-text-secondary` y `--theme-text-muted`

Se añaden dos niveles de texto tematizado, para cubrir los dos grados de gris que hoy se usan:
- `--theme-text-secondary`: texto secundario legible (equivalente a los `text-neutral-600/700` actuales) — para subtítulos y labels con algo de peso.
- `--theme-text-muted`: texto atenuado / terciario (equivalente a `text-neutral-400/500`) — para metadatos, placeholders de estado vacío y ayudas.

Se definen en cada bloque `html[data-theme="X"]` (modo claro) y `html[data-theme="X"].dark` (modo oscuro) de `src/index.css`, más un valor por defecto en `@theme`. Los valores se derivan mezclando gris neutro con el color del tema (tinte sutil, ~8–15% de saturación del tema) y ajustando la luminosidad por modo:
- Modo claro: tono oscuro tenue sobre fondo claro (p.ej. base `#6b7280`/`#9ca3af` desviado hacia el matiz del tema).
- Modo oscuro: tono claro tenue sobre fondo oscuro (base `#a3a3a3`/`#737373` desviado hacia el matiz del tema).

**Alternativa considerada:** reutilizar directamente `--theme-secondary`. Se descarta porque `--theme-secondary` es un color de acento saturado (p.ej. Ocean `#3282b8`, Rose `#e11d48`) pensado para degradados y realces; usarlo como color de texto de párrafo daría un contraste y una saturación inapropiados para texto atenuado.

**Alternativa considerada:** usar `color-mix()` en CSS para derivar el tinte en tiempo de ejecución desde `--theme-secondary`. Viable, pero se prefiere valores explícitos por tema/modo para poder verificar el contraste AA caso por caso y mantener el patrón ya usado por el resto de variables `--theme-*`.

### Decisión 2: Aplicación vía utilidades/clase, no estilos inline

Se reemplazan los pares `text-neutral-X dark:text-neutral-Y` por texto tematizado usando el mismo estilo que el resto del código. Dado que Tailwind v4 está en uso (`@import "tailwindcss"`), se aplican con `text-[var(--theme-text-secondary)]` / `text-[var(--theme-text-muted)]` (arbitrary value) o mediante clases utilitarias equivalentes definidas en `index.css`. Se elimina la variante `dark:` porque la propia variable ya cambia con `.dark`, evitando la doble fuente de verdad.

**Alternativa considerada:** `style={{ color: colors.textMuted }}` con `useThemeColors()`. Se descarta para no acoplar cada componente al hook ni ampliar el objeto `ThemeColors`; el enfoque CSS mantiene el cambio en la capa de estilos y funciona igual en SSR/estado inicial.

### Decisión 3: Alcance de reemplazo por semántica, no por número de gris

El mapeo de cada gris fijo a `secondary` vs `muted` se decide por **rol** del texto, no mecánicamente por el número Tailwind:
- Títulos/valores fuertes que hoy son `text-neutral-900/100` → se dejan como texto primario (fuera de alcance) salvo que se vean claramente como "gris".
- `text-neutral-600/700` (con su par oscuro) → `--theme-text-secondary`.
- `text-neutral-400/500` (con su par oscuro) → `--theme-text-muted`.
- `text-neutral-200/300` muy tenues (líneas de ayuda, iconos de estado vacío) → `--theme-text-muted` (aceptando que algunos iconos puramente decorativos pueden quedarse).

### Decisión 4: Controles de formulario reutilizan las variables tematizadas

`.input-glass` y `.btn-secondary` tenían color de texto y placeholder con grises fijos y overrides separados en `html.dark`. El problema más grave era el placeholder oscuro `#525252` sobre fondo oscuro, casi invisible. Se resuelve reutilizando las mismas variables:
- Texto de input y etiqueta de `.btn-secondary` → `var(--theme-text-secondary)` (contraste fuerte, tinte sutil del tema).
- Placeholder de input → `var(--theme-text-muted)` (más el reset `opacity: 1` para neutralizar la atenuación por defecto de Firefox).

Como cada variable ya cambia con `.dark`, se **eliminan** los overrides `html.dark .input-glass { color }`, `html.dark .input-glass::placeholder` y `html.dark .btn-secondary { color }`: una sola fuente de verdad por variable.

Sobre el hover de `.btn-secondary`: se evaluó usar `var(--theme-primary)` para dar un "pop" de marca, pero en el tema Midnight en modo claro el índigo primario cae a ~3.58:1 sobre el fondo de hover, por debajo de AA. Para no introducir un caso inaccesible, el hover conserva el texto en `--theme-text-secondary` (7:1+) y comunica el estado solo con fondo/borde.

`.btn-danger` se deja con su degradado gris intencional (acción destructiva atenuada); su etiqueta blanca/`#d4d4d4` ya cumple contraste y tematizarla a un color cambiaría su semántica. Los inputs de `Card.tsx` y `TimerCard.tsx` ya tematizan su texto/borde por estilo inline y quedan fuera de este cambio de CSS compartido.

## Risks / Trade-offs

- **Contraste insuficiente en algún tema/modo** → Se define cada variable con un valor verificado y se valida el ratio ≥ 4.5:1 sobre el fondo real (superficies glass y fondos elevados) para los seis temas × dos modos antes de cerrar la tarea.
- **Regresión visual sutil en textos que no eran "gris de tema"** (p.ej. estados de error o disabled que casualmente usan neutral) → Revisar cada reemplazo en contexto; no tocar textos con semántica de estado (error/success/danger).
- **Doble fuente de verdad si queda algún `dark:text-neutral-*` sin migrar** → Al migrar, eliminar siempre el par claro+oscuro juntos; un grep final confirma que no quedan `text-neutral-*` de texto secundario en los componentes afectados.
- **Divergencia entre `src/themes/index.ts` y `src/index.css`** → Si en el futuro se expone el muted vía `useThemeColors`, habrá que mantener ambos. Por ahora la fuente de verdad para texto es `index.css`.
