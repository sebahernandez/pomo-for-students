## 1. Store: modo y configuración únicos de descanso

- [x] 1.1 En `AppContext`, cambiar `TimerMode` a `'work' | 'break'` y `Settings` a `{ work: number; break: number }`; actualizar `DEFAULT_SETTINGS = { work: 25, break: 5 }` y `getDurations` para devolver `{ work, break }`.
- [x] 1.2 En `loadSettings`, migrar la forma antigua: `break = stored.break ?? stored.shortBreak ?? DEFAULT_SETTINGS.break`, conservando `work`; devolver siempre la forma nueva.
- [x] 1.3 Consolidar las clases de fondo: `applyModeClasses` aplica/remueve una sola clase `mode-break` (en lugar de `mode-shortBreak`/`mode-longBreak`).
- [x] 1.4 Renombrar `takeShortBreak` → `takeBreak` (modo `break`, `breakTimeLeft = d.break`, `running`); actualizar la interfaz y su uso.
- [x] 1.5 Ajustar `setTimerMode`, `resetTimer`, la inicialización de `breakTimeLeft` y la transición de completado (`work → break`, `break → work`) al modo único.

## 2. Store: aviso de fin de tarea

- [x] 2.1 Añadir estado `finishPromptOpen: boolean` (inicial `false`) y acción `closeFinishPrompt()` a `AppState`.
- [x] 2.2 En `moveTask`, cuando `id === activeTaskId && status === 'done'`, marcar `finishPromptOpen: true`.

## 3. UI: temporizador, ajustes y aviso

- [x] 3.1 `TimerCard`: `modes` con dos pestañas (Enfoque/Descanso); `totalSeconds` de descanso usa `settings.break*60`; usar `takeBreak` donde corresponda.
- [x] 3.2 `SettingsPanel`: reemplazar los dos campos de descanso por un único campo "Descanso (min)" ligado a `settings.break`.
- [x] 3.3 Crear `FinishTaskPrompt` (modal tematizado) con las tres opciones: Tomar descanso (`takeBreak` + cerrar), Continuar con otra tarea (cerrar), No hacer nada (cerrar); cierre con `Escape`. Montarlo en `App`.
- [x] 3.4 `Card`: el botón "Tomar descanso" invoca `takeBreak` (descanso general).

## 4. Estilos e i18n

- [x] 4.1 `index.css`: consolidar `mode-shortBreak`/`mode-longBreak` en una única variación `mode-break`.
- [x] 4.2 i18n (es/en): etiqueta de modo `break: 'Descanso' / 'Break'`; campo `breakMin`; textos del aviso: título, `continueOtherTask`, `doNothing` (reutilizar `takeBreak`). Quitar el uso de `shortBreak`/`longBreak`/`shortBreakMin`/`longBreakMin`.

## 5. Pruebas y verificación

- [x] 5.1 Actualizar `src/test/TimerCard.test.tsx` y `src/test/Drawer.test.tsx` para el modo/config único.
- [x] 5.2 Verificar en la app: dos pestañas (Enfoque/Descanso); el descanso general corre aislado; el botón de la tarjeta lo inicia.
- [x] 5.3 Verificar el aviso: mover la tarea activa a Hecho muestra las tres opciones y cada una se comporta según lo definido; mover una tarea no activa a Hecho no muestra aviso.
- [x] 5.4 Verificar la migración: una configuración previa con corto/largo carga con un único Descanso sin perder Enfoque.
- [x] 5.5 Ejecutar lint/typecheck, build y `vitest run`.
