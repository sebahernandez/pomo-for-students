## Context

Ver `proposal.md` — Why. El comportamiento de Pomo Study solo existe hoy en `src/` (store Zustand en `AppContext.tsx` + componentes React) y en un README descriptivo. Este cambio hace ingeniería inversa de ese comportamiento observable para producir specs OpenSpec que sirvan de línea base. Restricción clave: **no se toca código de la aplicación**; el riesgo es que las specs se desvíen del comportamiento real o describan implementación en lugar de comportamiento.

## Goals / Non-Goals

**Goals:**
- Capturar el comportamiento observable actual como specs verificables (WHEN/THEN), agrupado en capacidades cohesivas.
- Dejar la línea base lista para archivarse y pasar a `openspec/specs/` como fuente de la verdad.
- Que cada requisito sea rastreable a código real existente (sin inventar comportamiento).

**Non-Goals:**
- No introducir ni modificar funcionalidad de la app.
- No especificar detalles de implementación (Zustand, dnd-kit, Web Audio, claves de `localStorage`) dentro de las specs.
- No cubrir aspectos puramente visuales (paletas exactas, animaciones) más allá de comportamiento observable.

## Decisions

- **Trazado de capacidades por dominio de usuario, no por archivo.** Se definieron 6 capacidades (`pomodoro-timer`, `task-management`, `session-history`, `user-preferences`, `onboarding-and-guidance`, `cookie-consent`).
  - *Alternativa descartada:* una spec por componente React → produciría specs acopladas a la implementación y difíciles de mantener.
  - *Alternativa descartada:* una única spec monolítica → dificultaría proponer deltas acotados por área.
- **La persistencia se trata como comportamiento observable, no como detalle.** Las specs afirman "se restaura tras recargar" sin nombrar `localStorage`/cookies ni las claves concretas, que quedan en design/código.
- **`user-preferences` agrupa duraciones, apariencia, tema e idioma.** Comparten el mismo patrón (elección persistida que reconfigura la UI); mantenerlas juntas evita cuatro specs casi idénticas.
- **Onboarding y guía se unifican** por ser dos caras de la misma necesidad (aprender a usar la app), aunque uno sea automático-una-vez y el otro a demanda.
- **Derivación desde la fuente de verdad del estado.** El store (`AppContext.tsx`) fue la referencia primaria por concentrar acciones y transiciones; los componentes aportaron detalles de interacción (rango 1–120 min, drag & drop, activación por distancia).

## Risks / Trade-offs

- **Deriva spec ↔ código** → Se redactó cada requisito contra código leído directamente; el paso de validación (`openspec validate`) y la revisión humana antes de archivar actúan como control.
- **Sobre-especificar detalles frágiles** (colores, textos exactos) → Se limitó el alcance a comportamiento observable y estable; los valores concretos viven en `themes/` e `i18n/`.
- **Capacidades mal trazadas dificultarían deltas futuros** → Se priorizó cohesión por dominio de usuario; si un área crece, puede dividirse en un cambio posterior.

## Migration Plan

1. Revisar las 6 specs contra el comportamiento real de la app en ejecución.
2. Ejecutar `openspec validate --strict` sobre el cambio y corregir hallazgos.
3. Al aprobar, `/opsx:apply` marca las tareas de verificación; luego `/opsx:archive` promueve las specs a `openspec/specs/` como fuente de la verdad.
4. *Rollback:* al no tocar código de la app, revertir es eliminar el directorio del cambio; no hay impacto en runtime.
