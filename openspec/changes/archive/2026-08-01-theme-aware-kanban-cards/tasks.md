## 1. Dirección de UX/UI

- [x] 1.1 Consultar la skill `frontend-design` para la dirección estética de las tarjetas (superficie/elevación, tinte de tema, jerarquía de texto, distinción activa vs inactiva) manteniendo contraste

## 2. Tematizar las tarjetas

- [x] 2.1 En `Card.tsx`, reemplazar la superficie fija de la tarjeta inactiva (`bg-black`/`dark:bg-white`) por una superficie derivada del modo y teñida por el tema vía `useThemeColors()`, con borde de acento tenue
- [x] 2.2 Realzar la tarjeta activa con borde/anillo y tinte de acento del tema, conservando el texto sobre una superficie legible (no relleno saturado bajo el texto)
- [x] 2.3 Fijar el texto de título al color de alto contraste según el modo; ajustar texto secundario/mudo (pomodoros, tiempo) para que también cumpla contraste; aplicar acentos del tema a íconos de estado
- [x] 2.4 Conservar contenido, acciones, botones, drag & drop y layout de la tarjeta sin cambios

## 3. Verificación de contraste

- [x] 3.1 Medir el contraste WCAG del texto de tarjeta (título y secundario, estados activo e inactivo) contra su fondo real en los 6 temas × 2 modos; confirmar ≥ 4.5:1 en todas las combinaciones
- [x] 3.2 Revisar visualmente (render real) al menos un tema no-neutral en claro y oscuro con una tarjeta activa y una inactiva
- [x] 3.3 Ejecutar `npm run lint` (0 errores) y `npm run build` (compila)