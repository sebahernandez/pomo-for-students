## Context

Ver `proposal.md` — Why. Hoy `SettingsPanel`, `SessionHistory` y `GuideModal` repiten el mismo andamiaje: un contenedor `modal-overlay fixed inset-0 flex items-center justify-center z-50` con un hijo `modal-glass ... animate-slide-down` que detiene la propagación del clic. Cada uno maneja su cierre por su cuenta (clic en overlay + botón X), pero **ninguno soporta la tecla Escape** actualmente. Los estilos viven en `src/index.css` (`.modal-overlay`, `.modal-glass`, keyframes `fade-in`/`slide-down`). El montaje ocurre en `Header.tsx` mediante flags de estado (`settingsOpen`, `historyOpen`, `guideOpen`). Stack: React 19, Tailwind v4, sin librería de UI.

## Goals / Non-Goals

**Goals:**
- Un shell de drawer reutilizable que encapsule scrim, animación lateral, alto completo y los tres mecanismos de cierre (scrim, botón, Escape).
- Presentación idéntica en móvil y escritorio (drawer derecho a alto completo; ancho acotado en escritorio, casi total en móvil).
- Migrar los tres paneles a ese shell tocando lo mínimo de su contenido interno.

**Non-Goals:**
- No se cambia la lógica de dominio (guardar duraciones, borrar historial, contenido de la guía, persistencia).
- No se introduce ninguna dependencia nueva; el drawer se implementa con React + Tailwind + CSS existente.
- No se rediseña el contenido interno de los paneles más allá de adaptarlo al ancho/scroll del drawer.

## Decisions

- **Componente `Drawer` reutilizable** en `src/components/Drawer.tsx` con props `{ isOpen? , onClose, title?, icon?, children }`. Renderiza el scrim + el panel deslizante y centraliza el manejo de cierre. Los paneles existentes pasan a envolver su contenido con `<Drawer>` en lugar de duplicar el andamiaje.
  - *Alternativa descartada:* dejar cada panel con su propio contenedor y solo cambiar clases CSS. Se descarta porque duplicaría el manejo de Escape/scroll/foco en tres sitios.

- **Anclaje al borde derecho** con `fixed top-0 right-0 h-full`. En escritorio ancho acotado (p. ej. `w-full max-w-sm`/`max-w-md`/`max-w-lg` según panel, respetando los anchos actuales de cada modal); en móvil el `w-full` domina hasta el `max-w`. Un solo conjunto de clases responsivas cubre ambos casos, cumpliendo "mismo comportamiento en móvil y desktop".
  - *Alternativa descartada:* drawer inferior (bottom sheet) en móvil y lateral en desktop. Se descarta porque el requerimiento pide el mismo patrón lateral en ambos.

- **Animación**: nuevos keyframes `slide-in-right` (de `translateX(100%)` a `0`) para el panel y reutilizar `fade-in`/scrim para el overlay, definidos en `src/index.css`. Se añaden clases utilitarias (`.drawer-panel`, `.drawer-overlay`) o se reutilizan `modal-overlay`/`modal-glass` ajustando el borde/redondeo para el borde derecho.

- **Cierre por Escape**: `Drawer` registra un listener de `keydown` en `document` mientras está montado y llama `onClose` en `Escape`, limpiándolo al desmontar. Esto añade un mecanismo de cierre que hoy no existe y satisface `panel-presentation`.

- **Cierre por scrim**: se conserva el patrón actual (`onClick={onClose}` en el scrim y `stopPropagation` en el panel).

- **Montaje sin cambios estructurales** en `Header.tsx`: se mantienen los flags `settingsOpen/historyOpen/guideOpen`; solo cambia la presentación interna de cada panel. Se puede montar un único drawer a la vez (los tres flags son independientes pero mutuamente excluyentes en la práctica del usuario).

- **`GuideModal`**: se conserva el nombre de archivo/exportación para minimizar el diff en `Header.tsx`, aunque conceptualmente ya no sea un "modal". (Renombrar es opcional y queda fuera de alcance.)

## Risks / Trade-offs

- **Scroll interno vs. alto completo** → El drawer usa `h-full` con `flex flex-col` y una región `overflow-y-auto`, replicando el patrón `max-h` actual de historial/guía para que encabezado y acciones queden fijos.
- **Listener global de Escape con varios paneles** → Solo hay un drawer abierto a la vez; el listener se monta/desmonta con el `Drawer`, evitando fugas o cierres cruzados.
- **Reutilizar `modal-glass` con bordes redondeados en las 4 esquinas** → Para el borde derecho conviene aplanar las esquinas del lado anclado; se ajusta vía clase específica del drawer para no romper otros usos de `modal-glass`.
- **Tests existentes que asumen modal centrado** → Revisar selectores; los tests deben apuntar a rol/contenido y a los tres mecanismos de cierre, no a clases de layout.
- **`prefers-reduced-motion`** → La animación de deslizamiento debe degradar a aparición simple para usuarios con movimiento reducido (buenas prácticas ya presentes en el proyecto).
