## 1. Refactor del estado del formulario

- [x] 1.1 En `SettingsPanel.tsx`, definir una tabla local de campos `[{ key: 'work', min: 1, max: 60 }, { key: 'shortBreak', min: 1, max: 30 }, { key: 'longBreak', min: 1, max: 60 }]` como fuente única de rangos.
- [x] 1.2 Cambiar el estado del formulario de `useState<Settings>` a un estado de strings por campo, inicializado desde `settings` con `String(settings[key])`.
- [x] 1.3 Actualizar cada `onChange` para guardar `e.target.value` sin transformar (sin `Number(...)`).

## 2. Validación y guardado

- [x] 2.1 Añadir un helper puro `normalize(value: string, min: number, max: number, fallback: number): number` que parsee en base 10, use `fallback` si es `NaN`, y aplique clamp al rango.
- [x] 2.2 En `handleSubmit`, construir el `Settings` numérico aplicando `normalize` por campo con `settings[key]` como fallback, llamar `updateSettings(normalized)` y re-sincronizar el estado de strings con los valores normalizados.
- [x] 2.3 Verificar que el panel sigue sin cerrarse al guardar (no se llama `onClose` en el submit) y que el temporizador se recarga vía `updateSettings`.

## 3. Render

- [x] 3.1 Renderizar los tres campos mapeando la tabla de campos (etiqueta/icono por campo) en lugar de bloques JSX duplicados. Nota: se usó `type="text"` + `inputMode="numeric"` en vez de `type="number"` con `min`/`max` HTML, porque la validación nativa del navegador bloqueaba el submit para valores fuera de rango e impedía que corriera el clamp (ver design.md, decisión "Input de texto con teclado numérico"). Los límites viven solo en la tabla de campos. Se añadió `htmlFor`/`id` para asociar etiqueta e input.

## 4. Pruebas

- [x] 4.1 En `src/test/Drawer.test.tsx`, añadir caso: guardar con un campo vacío conserva el valor previo (no persiste `0`).
- [x] 4.2 Añadir caso: guardar un valor fuera de rango recorta al límite y el campo muestra el valor recortado.
- [x] 4.3 Añadir caso: guardar valores válidos actualiza el temporizador y mantiene el drawer abierto.
- [x] 4.4 Ejecutar `npm test` y asegurar que toda la suite pasa.
