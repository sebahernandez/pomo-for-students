## 1. Lógica

- [x] 1.1 En `src/context/AppContext.tsx`, en `moveTask`, detectar la transición entrante a "Hecho" (`status === 'done' && !wasDone`) y llamar a `recordActivity` + `saveStreak`, devolviendo `streak` en el estado.

## 2. Spec

- [x] 2.1 Actualizar el requisito "Registro de día activo" de `weekly-streak` para incluir la finalización de tareas como actividad de progreso y la regla de transición entrante.

## 3. Tests y verificación

- [x] 3.1 Añadir a `src/test/store.test.ts`: mover a Hecho suma al conteo; re-marcar una tarea ya Hecha no cuenta; 5 tareas Hechas en un día dan racha 1.
- [x] 3.2 Ejecutar suite completa, lint y build; todo en verde.
