## 1. Cerrar el drawer al guardar

- [x] 1.1 En `src/components/SettingsPanel.tsx`, en `handleSubmit`, llamar a `onClose()` después de `updateSettings(normalized)` para cerrar el drawer tras aplicar los cambios.
- [x] 1.2 Confirmar que la normalización de valores (clamp/fallback) sigue ocurriendo antes del cierre, de modo que solo se persistan duraciones válidas.

## 2. Pruebas

- [x] 2.1 En `src/test/Drawer.test.tsx`, actualizar las pruebas que afirman que el drawer permanece abierto tras Guardar para que ahora afirmen que se cierra (por ejemplo, que se invoca `onClose`).
- [x] 2.2 Verificar que las pruebas de normalización (valor vacío/inválido/fuera de rango) siguen validando que solo se persisten valores válidos, y que el cierre ocurre igualmente.
- [x] 2.3 Ejecutar la suite completa de tests y el typecheck.
