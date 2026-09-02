## Why

Con la meta diaria de 5 sesiones de Enfoque, un usuario que trabaja moviendo tareas a "Hecho" no veía avanzar su racha: solo contaba el temporizador de pomodoro. Eso resultaba confuso (6 tareas hechas y racha en 0). Contar también la finalización de tareas hace que el progreso diario refleje el trabajo real del usuario.

## What Changes

- Completar una tarea (moverla a "Hecho" desde otro estado) SHALL contar como una actividad de progreso hacia la meta diaria de 5, igual que completar un pomodoro de Enfoque.
- Solo cuenta la **transición entrante** a "Hecho"; re-marcar o re-arrastrar una tarea ya "Hecha" no vuelve a contar (evita inflar el conteo).
- No es retroactivo: tareas que ya estaban en "Hecho" antes del cambio no se cuentan.

## Capabilities

### New Capabilities
<!-- Ninguna. -->

### Modified Capabilities
- `weekly-streak`: la "actividad de progreso" que suma al conteo diario pasa a incluir la finalización de tareas, no solo las sesiones de Enfoque.

## Impact

- **Código modificado:** `src/context/AppContext.tsx` (`moveTask` llama a `recordActivity`/`saveStreak` en la transición a "Hecho").
- **Tests:** `src/test/store.test.ts` (3 casos: mover a Hecho suma; re-marcar no; 5 tareas Hechas = racha 1).
- **Spec:** requisito "Registro de día activo" de `weekly-streak` actualizado.
- **Sin cambios de almacenamiento ni dependencias nuevas.**
