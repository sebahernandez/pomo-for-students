## Why

Las tres superficies que hoy se abren como modales centrados (Configuración, Historial de sesiones y Guía de uso) interrumpen el flujo tapando el centro de la pantalla y compitiendo con el temporizador y el tablero. Un patrón de drawer lateral es menos intrusivo, se ancla a un borde estable y ofrece una experiencia coherente y predecible tanto en móvil como en escritorio.

## What Changes

- Reemplazar la presentación de modal centrado (`modal-overlay` + `modal-glass` con `animate-slide-down`) por un **drawer lateral** que se desliza desde el borde derecho de la pantalla.
- Aplicar el patrón de drawer a los tres paneles existentes: **Configuración** (`SettingsPanel`), **Historial** (`SessionHistory`) y **Guía de uso** (`GuideModal`).
- El drawer se comporta igual en **móvil y escritorio**: ocupa el alto completo de la ventana, ancho fijo/acotado en escritorio y ancho casi completo en móvil, con scroll interno cuando el contenido excede el alto.
- Mantener el scrim/overlay oscuro detrás del drawer y todos los mecanismos de cierre: clic en el scrim, botón de cerrar y tecla **Escape**.
- Introducir un componente/estilo de drawer reutilizable (shell común) para que los tres paneles compartan estructura, animación y comportamiento de cierre.
- Sin cambios en la lógica de dominio: guardar duraciones, borrar historial, contenido de la guía y persistencia de preferencias permanecen idénticos.

## Capabilities

### New Capabilities
- `panel-presentation`: Define cómo se presentan los paneles bajo demanda (configuración, historial, guía) como drawers laterales con scrim, animación de deslizamiento desde el borde y comportamiento de cierre uniforme en todos los tamaños de viewport.

### Modified Capabilities
- `onboarding-and-guidance`: La Guía consultable a demanda se abre como drawer lateral en lugar de modal centrado (único escenario de apertura descrito explícitamente en specs existentes).

  El resto de la presentación de Configuración e Historial no altera su comportamiento de dominio (guardar duraciones, borrar historial): su nueva presentación como drawer queda cubierta por la capacidad `panel-presentation`, por lo que `user-preferences` y `session-history` no requieren delta.

## Impact

- **Componentes**: `src/components/SettingsPanel.tsx`, `src/components/SessionHistory.tsx`, `src/components/GuideModal.tsx` (contenedor de presentación), `src/components/Header.tsx` (montaje de los paneles). Probable nuevo componente `src/components/Drawer.tsx`.
- **Estilos**: `src/index.css` — nuevas clases de drawer y keyframes de deslizamiento lateral; las clases `modal-overlay`/`modal-glass` pueden reutilizarse o retirarse.
- **Sin cambios** en el store (`AppContext`), i18n ni en la lógica de negocio.
- **Tests**: Ajustar/añadir pruebas que verifiquen apertura, cierre (scrim, botón, Escape) y presencia del contenido en el nuevo contenedor.
