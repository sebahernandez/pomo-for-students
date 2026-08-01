## 1. Barra de pestañas en TimerCard

- [x] 1.1 En `src/components/TimerCard.tsx`, definir el arreglo de modos (`work`/`shortBreak`/`longBreak`) con sus etiquetas i18n (`t.focus`, `t.shortBreak`, `t.longBreak`) reutilizando `setTimerMode` y `timerMode` del store.
- [x] 1.2 Renderizar una barra de pestañas en la parte superior de la tarjeta, marcando la pestaña activa (destacada) y las inactivas (atenuadas, accionables) según `timerMode`.
- [x] 1.3 Reemplazar el badge estático de modo (`modeLabel`) por la barra de pestañas como única indicación de modo.

## 2. Animación de transición al cambiar de modo

- [x] 2.1 Envolver el contenido presentacional del temporizador (display de tiempo/zona central) en un contenedor con `key={timerMode}` para forzar el remount y reejecutar la animación al cambiar de modo.
- [x] 2.2 Aplicar la utilidad de animación (reutilizar `animate-fade-in` o agregar un keyframe/utilidad dedicada `mode-switch` en `src/index.css`) al contenedor con `key`.
- [x] 2.3 Verificar que el `key` no envuelva el input de edición de minutos ni los controles, para no perder foco ni estado en vivo.
- [x] 2.4 Asegurar que la animación degrade correctamente bajo `@media (prefers-reduced-motion: reduce)` en `src/index.css`.

## 3. Limpieza de layout en App

- [x] 3.1 En `src/App.tsx`, eliminar la fila de botones de modo (`modes.map`) y las variables/estilos asociados que queden sin uso.
- [x] 3.2 Ajustar el espaciado/márgenes del contenedor en `App.tsx` tras retirar la fila superior.

## 4. Verificación

- [x] 4.1 Actualizar/añadir pruebas relevantes (p. ej. selección de pestaña cambia el modo y deja el temporizador en `idle`) y ejecutar la suite de tests.
- [x] 4.2 Verificar manualmente en la app: cambiar entre las tres pestañas dispara la animación, la duración se ajusta y el fondo refleja el modo de descanso.
