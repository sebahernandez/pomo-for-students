## Context

Ver `proposal.md` (Why) para la motivación.

La tarjeta del Kanban se renderiza en `src/components/Card.tsx`. Ya existe la noción de tarjeta activa: `isActive = task.id === activeTaskId` (store `activeTaskId` en `src/context/AppContext.tsx`) e `isRunning = isActive && timerStatus === 'running'`. Hoy la tarjeta activa ya recibe un tratamiento propio calculado en línea a partir de los tokens del tema (`useThemeColors` → `src/themes/index.ts`):

```ts
const cardSurface = isActive ? tint(primary, base, ...) : tint(secondary, base, ...)
const cardBorder  = isActive ? themeColors.primary : `${themeColors.secondary}40`
const cardShadow  = isActive ? `0 0 0 1.5px ${primary}, 0 6px 16px ${primary}22` : 'none'
```

El problema no es que falte estilo activo, sino que **no destaca lo suficiente** frente al resto y no se lee como un realce intencional/profesional. El estilado de tarjetas es inline (colores derivados del tema) + utilidades Tailwind v4; el tema se aplica por `data-theme` + clase `.dark` en `document.documentElement`. Tokens disponibles por tema/light-dark: `primary`, `primaryHover`, `secondary`, `accent`, `accentGlow`, `glassBg`, etc.

## Goals / Non-Goals

**Goals:**
- Elevar el tratamiento visual de la tarjeta activa a un realce de acento claramente distintivo y "profesional", reutilizando los tokens del tema activo.
- Mantener exactamente una tarjeta destacada, coherente con el estado `activeTaskId` ya existente.
- Degradar de forma accesible con `prefers-reduced-motion`.

**Non-Goals:**
- No cambiar la lógica de selección/persistencia de la tarea activa ni el temporizador.
- No introducir librerías nuevas ni un sistema de tokens nuevo (se usan los existentes).
- No rediseñar toda la tarjeta ni las columnas; solo el estado "activa".

## Decisions

- **Reforzar el estado activo en `Card.tsx`, no crear componente nuevo.** El estado ya vive ahí y es puramente presentacional. Alternativa (componente `ActiveCardHighlight` envolvente) descartada por sobre-ingeniería para un cambio de estilo.

- **Realce = anillo de acento + elevación/halo con color del tema.** Sustituir el `cardShadow` actual por un realce más marcado: anillo de acento (`ring`/box-shadow de ~2px con `themeColors.primary`) + halo suave usando `accentGlow`/`accent` para la sensación de elevación, y un `cardSurface` con tinte algo más presente que el actual. Se prioriza `box-shadow`/borde por encima de cambiar el layout para evitar "saltos" de tamaño respecto a las tarjetas inactivas. Alternativa (solo cambiar color de fondo) descartada: poco visible sobre el fondo translúcido del board.

- **Indicador de "en foco" distinto de "en marcha".** `isActive` aplica el realce estático; `isRunning` añade un énfasis extra (p. ej. un pulso sutil del anillo/halo). Así el usuario distingue tarea activa de sesión efectivamente corriendo. Alternativa (mismo estilo para ambos) descartada por perder información ya disponible.

- **Animación gestionada con `prefers-reduced-motion`.** Cualquier pulso/transición se define de forma que con `@media (prefers-reduced-motion: reduce)` degrade a estático. Como el realce base es color+anillo estáticos, la tarjeta sigue siendo inequívocamente distinguible sin movimiento. Se implementa vía clase CSS en `index.css` (donde ya viven keyframes y la media query es natural) en lugar de animación inline, para respetar la preferencia de forma robusta.

- **Derivar todo del tema activo.** Reutilizar `themeColors.primary` / `accent` / `accentGlow` para que el realce cambie con el tema y conserve contraste en claro/oscuro, coherente con el resto de la app.

## Risks / Trade-offs

- **Realce demasiado llamativo / ruidoso** → Mantener el efecto contenido (un anillo + halo suave, pulso de baja amplitud) y validar visualmente en los seis temas en claro y oscuro.
- **Contraste insuficiente en algún tema** (p. ej. `neutral`) → Verificar legibilidad del texto sobre el `cardSurface` reforzado en cada tema; ajustar la opacidad del tinte si hace falta.
- **Desalineación entre tarjetas activa/inactiva** si el realce cambia el tamaño → Usar `box-shadow`/`ring` (no `border-width` variable ni padding) para no alterar el flujo del layout.
- **Doble fuente de estilo activo** (inline vs. clase CSS del pulso) → Mantener el color/anillo estático inline (ya derivado del tema) y limitar la clase CSS al pulso animado, documentando la relación para evitar divergencias.
