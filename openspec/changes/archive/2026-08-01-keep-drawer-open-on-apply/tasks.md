## 1. Desacoplar guardar de cerrar

- [x] 1.1 En `src/components/SettingsPanel.tsx`, quitar la llamada a `onClose()` dentro de `handleSubmit` para que guardar aplique los cambios sin cerrar el drawer
- [x] 1.2 Verificar que el botón Cancelar sigue cerrando el drawer y que Guardar ya no lo hace

## 2. Pruebas

- [x] 2.1 Añadir prueba de que guardar en Configuración aplica el cambio y el drawer permanece abierto
- [x] 2.2 Confirmar que las pruebas existentes de cierre por scrim, botón de cerrar (X) y Escape siguen en verde

## 3. Verificación final

- [x] 3.1 Ejecutar `npm run lint` y `npm run test:run` y dejarlos en verde
- [x] 3.2 Ejecutar `npx openspec validate keep-drawer-open-on-apply --strict` y corregir hallazgos
