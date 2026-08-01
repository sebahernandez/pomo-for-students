## Context

Ver `proposal.md` — Why. Hoy `Card.tsx` usa clases fijas: la tarjeta inactiva es `bg-black dark:bg-white` con texto `text-neutral-800`/`text-neutral-200`, lo que produce texto oscuro sobre negro (claro) y claro sobre blanco (oscuro) — contraste roto — y no sigue el tema. Los paneles, el footer y algunos acentos de la propia tarjeta (botón activo, botón ✓) ya usan `useThemeColors()`. El reto es distinguir la tarjeta **activa** de la **inactiva** siguiendo el tema, sin sacrificar la legibilidad del texto en ninguno de los 6 temas × 2 modos.

## Goals / Non-Goals

**Goals:**
- Tarjetas (activa e inactiva) siguen el tema y el modo claro/oscuro reutilizando `useThemeColors()`.
- Texto de tarjeta con contraste ≥ 4.5:1 (WCAG AA) en las 12 combinaciones.
- Distinción visual clara entre tarjeta activa e inactiva.

**Non-Goals:**
- No cambiar contenido, acciones, botones, drag & drop ni layout de la tarjeta.
- No introducir nuevos campos en `ThemeColors` ni tokens nuevos.
- No rediseñar columnas ni el tablero.

## Decisions

- **El texto de cuerpo sigue al modo, no al acento** (mismo principio que el footer): título en color de alto contraste según claro/oscuro; los acentos del tema se usan en bordes, íconos de estado y resaltado, no como color del texto principal. Esto es lo que garantiza el contraste con independencia del hue del tema.
- **Superficie de la tarjeta derivada del modo, teñida por el tema**, en lugar del `bg-black`/`bg-white` fijo actual:
  - Inactiva → superficie sutil de bajo contraste (p. ej. `glassBg` o tinte de tema a baja opacidad sobre la superficie del panel) con borde `secondary`/`accent` tenue.
  - Activa → misma familia de superficie con **realce**: borde/anillo más marcado con `primary`/`accent` del tema y un fondo levemente más teñido; el texto permanece sobre una superficie clara/oscura según el modo.
  - *Alternativa descartada:* rellenar la tarjeta activa con `primary` saturado y poner el texto encima → contraste frágil según el tema; solo se mantiene para elementos pequeños/acentos (como el botón activo, que ya usa `primary`).
- **Texto secundario/mudo** (contador de pomodoros, tiempo) también debe alcanzar ≥ 4.5:1; se elige el nivel de opacidad/color que lo cumpla, no el mínimo estético.
- **Reutilizar `useThemeColors()` + `darkMode`** ya presentes en `Card.tsx`; no se añade estado ni lógica nueva.
- **Validación UX/UI:** se consulta la skill `frontend-design` para la dirección estética (elevación, tintes sutiles, jerarquía) y se verifica el contraste midiendo WCAG del texto contra el fondo real de la tarjeta en los 6 temas × 2 modos (mismo método usado para el footer).

## Risks / Trade-offs

- **Contraste insuficiente en algún tema/modo** (sobre todo tarjeta activa realzada) → Texto atado al modo + medición WCAG de las 12 combinaciones antes de dar por hecho; ajustar superficie/opacidad hasta pasar AA.
- **Activa e inactiva poco distinguibles** al no usar relleno saturado → Se refuerza la distinción con borde/anillo de acento y tinte, no con el color del texto; validación visual con la guía de UX/UI.
- **Deriva respecto a paneles/footer** → Reutilizar el mismo hook y familia de superficies mantiene coherencia por construcción.
