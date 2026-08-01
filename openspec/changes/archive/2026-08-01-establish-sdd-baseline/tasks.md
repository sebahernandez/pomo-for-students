## 1. Verificar specs contra el comportamiento real

- [x] 1.1 Ejecutar la app (`npm run dev`) y confirmar `pomodoro-timer`: modos, cuenta regresiva, edición 1–120 min, transición automática, sonido, anillo de progreso y contador de sesiones
- [x] 1.2 Confirmar `task-management`: crear/mover (drag & drop)/eliminar tareas, tarea activa, tiempo de enfoque por tarea y persistencia de tiempo restante
- [x] 1.3 Confirmar `session-history`: registro de sesión completada (con y sin tarea activa), estadísticas, estado vacío y limpiar historial
- [x] 1.4 Confirmar `user-preferences`: duraciones, modo oscuro/claro, 6 temas, idioma EN/ES y persistencia tras recargar
- [x] 1.5 Confirmar `onboarding-and-guidance`: asistente en primera visita, no reaparición posterior, navegación y guía a demanda
- [x] 1.6 Confirmar `cookie-consent`: banner sin decisión previa, ocultamiento con decisión registrada, aceptar y rechazar

## 2. Ajustar y validar la línea base

- [x] 2.1 Corregir cualquier requisito o escenario que no coincida con el comportamiento observado en la sección 1
- [x] 2.2 Ejecutar `npx openspec validate --strict --change establish-sdd-baseline` y resolver todos los hallazgos
- [x] 2.3 Revisar que ninguna spec incluya detalles de implementación (nombres de librerías, claves de `localStorage`, etc.)

## 3. Promover a fuente de la verdad

- [x] 3.1 Obtener aprobación del equipo sobre las 6 specs de línea base
- [x] 3.2 Archivar el cambio (`/opsx:archive`) para promover las specs a `openspec/specs/`
- [x] 3.3 Verificar que `openspec/specs/` contiene las 6 capacidades y que `openspec list` las refleja como fuente de la verdad
