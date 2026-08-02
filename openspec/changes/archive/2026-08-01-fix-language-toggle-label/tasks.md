## 1. Corregir la etiqueta del conmutador de idioma

- [x] 1.1 En `src/components/Header.tsx`, cambiar la etiqueta del botón de idioma para que muestre el idioma de destino en lugar del activo: reemplazar `{language.toUpperCase()}` por la expresión que renderiza el opuesto (`en` → "ES", `es` → "EN").
- [x] 1.2 Verificar que el botón reutilizado en los layouts de escritorio y tablet/móvil refleje la misma etiqueta corregida.

## 2. Verificación

- [x] 2.1 Con la app en inglés, confirmar que el botón muestra "ES"; con la app en español, confirmar que muestra "EN".
- [x] 2.2 Confirmar que al pulsar el botón el idioma cambia correctamente y la etiqueta se actualiza al nuevo idioma de destino.
