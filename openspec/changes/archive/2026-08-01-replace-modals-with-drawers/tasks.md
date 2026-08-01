## 1. Estilos y animación del drawer

- [x] 1.1 Añadir en `src/index.css` el keyframe `slide-in-right` (de `translateX(100%)` a `translateX(0)`) y su clase utilitaria de animación
- [x] 1.2 Añadir/ajustar clases de drawer (`.drawer-overlay` para el scrim reutilizando el blur actual, y estilos de panel a alto completo anclado a la derecha con esquinas del lado anclado aplanadas), reutilizando `modal-overlay`/`modal-glass` donde aplique
- [x] 1.3 Degradar la animación de deslizamiento a una aparición simple bajo `prefers-reduced-motion`

## 2. Componente Drawer reutilizable

- [x] 2.1 Crear `src/components/Drawer.tsx` con props `{ onClose, title?, icon?, children }` que renderice scrim + panel deslizante desde el borde derecho a alto completo
- [x] 2.2 Implementar cierre por clic/touch en el scrim con `stopPropagation` en el panel
- [x] 2.3 Implementar cierre por tecla Escape con listener de `keydown` en `document`, registrado al montar y limpiado al desmontar
- [x] 2.4 Estructurar el panel como `flex flex-col` con encabezado fijo y región de contenido `overflow-y-auto`; aplicar ancho responsivo (`w-full` con `max-w` configurable para escritorio)

## 3. Migrar los paneles al drawer

- [x] 3.1 Migrar `SettingsPanel` para envolver su formulario en `<Drawer>` (mantener `max-w-sm`), eliminando el andamiaje `modal-overlay`/`modal-glass` propio
- [x] 3.2 Migrar `SessionHistory` a `<Drawer>` (mantener `max-w-md`), conservando estadísticas, lista con scroll y botones Limpiar/Cerrar
- [x] 3.3 Migrar `GuideModal` a `<Drawer>` (mantener `max-w-lg`), conservando la lista de pasos con scroll y el pie con tip + Cerrar
- [x] 3.4 Verificar en `Header.tsx` que el montaje por flags (`settingsOpen`/`historyOpen`/`guideOpen`) siga funcionando sin cambios estructurales

## 4. Pruebas

- [x] 4.1 Actualizar/añadir pruebas de que cada panel se abre como drawer con su contenido en el idioma correcto
- [x] 4.2 Añadir pruebas de cierre por botón de cerrar, clic en scrim y tecla Escape
- [x] 4.3 Actualizar cualquier prueba existente que dependiera del layout de modal centrado

## 5. Verificación final

- [x] 5.1 Ejecutar `npm run lint` y `npm run test:run` y dejarlos en verde
- [x] 5.2 Verificar manualmente apertura/cierre y scroll interno de los tres paneles en anchos móvil y escritorio
- [x] 5.3 Ejecutar `npx openspec validate replace-modals-with-drawers --strict` y corregir hallazgos
