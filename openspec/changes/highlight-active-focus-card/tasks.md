## 1. Realce estático de la tarjeta activa

- [x] 1.1 En `src/components/Card.tsx`, reforzar el tratamiento de `isActive`: anillo de acento (~2px con `themeColors.primary`) + halo/elevación suave usando `themeColors.accentGlow`/`accent`, reemplazando el `cardShadow` actual por el realce más marcado.
- [x] 1.2 Ajustar `cardSurface` de la tarjeta activa para un tinte algo más presente (derivado del tema) sin comprometer el contraste del texto.
- [x] 1.3 Garantizar que el realce use `box-shadow`/anillo (no `border-width`/padding variable) para no alterar el tamaño ni el alineamiento respecto a las tarjetas inactivas.
- [x] 1.4 Confirmar que solo la tarjeta cuyo `task.id === activeTaskId` recibe el realce y que las inactivas conservan su estilo normal.

## 2. Énfasis de sesión en marcha y accesibilidad

- [x] 2.1 Añadir en `src/index.css` una clase de realce animado (pulso sutil del anillo/halo) con sus keyframes.
- [x] 2.2 Aplicar esa clase en `Card.tsx` solo cuando `isRunning` (tarea activa + `timerStatus === 'running'`), dejando el realce estático para `isActive` en reposo.
- [x] 2.3 En `src/index.css`, degradar la animación a estático bajo `@media (prefers-reduced-motion: reduce)`, verificando que la tarjeta activa siga siendo distinguible por color/anillo estático.

## 3. Verificación por temas

- [x] 3.1 Revisar visualmente el realce en los seis temas (`neutral`, `ocean`, `forest`, `sunset`, `rose`, `midnight`) en modo claro y oscuro, ajustando opacidad del tinte si algún tema pierde contraste.
- [x] 3.2 Comprobar los cambios de estado: seleccionar/cambiar tarea activa traslada el realce; deseleccionar o mover la tarea activa a Hecho/Por Hacer lo retira.
- [x] 3.3 Ejecutar la verificación del proyecto (`npm run build` y/o pruebas relevantes) y confirmar que no hay regresiones en el Kanban.
