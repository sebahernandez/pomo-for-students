## Context

Ver `proposal.md` — Why. Hoy `Footer.tsx` usa clases Tailwind neutrales fijas (`bg-neutral-50`, `text-neutral-700`, etc.). Los paneles ya tematizados (`TimerCard`, `KanbanBoard`) obtienen sus colores de `useThemeColors()`, que devuelve `ThemeColors` (`primary`, `secondary`, `accent`, `glassBg`, gradientes…) para el tema y modo activos. El footer debe seguir el mismo patrón.

## Goals / Non-Goals

**Goals:**
- El footer refleja el tema y el modo claro/oscuro reutilizando `useThemeColors()`.
- Mantener legibilidad del texto en los 6 temas × 2 modos.

**Non-Goals:**
- No cambiar contenido, enlaces, estructura ni layout del footer.
- No introducir nuevos campos en `ThemeColors` ni tokens nuevos.
- No rediseñar los demás paneles.

## Decisions

- **Reutilizar `useThemeColors()`** en lugar de clases fijas; mismo patrón que `TimerCard`/`KanbanBoard`, aplicado vía `style` en línea con los valores del tema.
  - *Alternativa descartada:* variables CSS globales nuevas → mayor alcance, innecesario para un componente.
- **Mapeo de color propuesto:**
  - Fondo/superficie del footer → `glassBg` (misma superficie que los paneles) o un fondo derivado del gradiente del tema.
  - Borde superior → `secondary`/`accent` con baja opacidad, para separar sin dominar.
  - Texto principal → color de alto contraste según modo (blanco en oscuro / casi negro en claro), NO un color de acento saturado, para preservar legibilidad; los acentos (ícono de corazón, badge de versión) sí pueden usar `secondary`/`accent`.
  - *Rationale:* usar `primary`/`accent` como color de texto de cuerpo daría contraste insuficiente en varios temas; el texto sigue al modo y los acentos siguen al tema.
- **Sin lógica nueva de estado:** el footer solo lee del store vía el hook; no despacha acciones.

## Risks / Trade-offs

- **Contraste insuficiente en algún tema/modo** → Se fija el texto de cuerpo al color de alto contraste del modo (no al acento); verificación visual en los 6 temas × claro/oscuro durante la implementación.
- **Deriva respecto al estilo de los paneles** → Reutilizar `glassBg` y el mismo hook mantiene consistencia por construcción.
