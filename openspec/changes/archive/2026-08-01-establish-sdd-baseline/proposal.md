## Why

El proyecto **Pomo Study** existe desde hace varios meses y su comportamiento vive únicamente en el código (`src/`) y en un README descriptivo. No hay una fuente de la verdad que declare *qué debe hacer* el sistema, independiente de *cómo* está implementado. Sin esa base, adoptar Spec-Driven Development (SDD) con OpenSpec es imposible: cada cambio futuro necesita un contrato contra el cual proponer deltas.

Este cambio establece esa **línea base (baseline)**: captura el comportamiento actual y observable de la aplicación como especificaciones OpenSpec, para que a partir de aquí todo cambio se proponga y valide contra ellas.

## What Changes

- Se documenta el comportamiento **ya existente** de la app como especificaciones OpenSpec, sin modificar código de la aplicación.
- Se crean specs de línea base para cada capacidad observable en el código actual: temporizador Pomodoro, gestión de tareas Kanban, historial de sesiones, preferencias del usuario, onboarding/guía y consentimiento de cookies.
- Estas specs quedan como la **fuente de la verdad** de referencia; al archivar este cambio pasarán a `openspec/specs/` y futuros cambios propondrán deltas sobre ellas.
- No hay cambios funcionales, de API ni de dependencias. No hay cambios **BREAKING**.

## Capabilities

### New Capabilities
- `pomodoro-timer`: Temporizador con modos Enfoque / Descanso Corto / Descanso Largo, cuenta regresiva por segundo, duración editable en vivo, transición automática al completar, sonido de finalización y anillo de progreso.
- `task-management`: Tablero Kanban (Por Hacer / En Progreso / Hecho) con crear, mover, eliminar y reordenar tareas mediante drag & drop, tarea activa vinculada al temporizador y tiempo de enfoque por tarea.
- `session-history`: Registro de cada sesión de enfoque completada con marca de tiempo, duración y tarea asociada; panel de estadísticas y opción de limpiar historial.
- `user-preferences`: Ajuste de duraciones, modo oscuro/claro, selección de tema de color (6 temas) e idioma (EN/ES), todo persistido en `localStorage`.
- `onboarding-and-guidance`: Asistente de bienvenida para nuevos usuarios (mostrado una sola vez) y modal de guía accesible en cualquier momento.
- `cookie-consent`: Banner de consentimiento de cookies mostrado hasta que el usuario lo acepta/rechaza, con la decisión persistida.

### Modified Capabilities
<!-- No aplica: no existen specs previas. Este cambio solo introduce specs de línea base. -->

## Impact

- **Código de aplicación**: sin cambios. Este es un cambio de documentación/contrato.
- **Archivos nuevos**: `openspec/changes/establish-sdd-baseline/**` (specs delta, diseño, tareas). Al archivar, las specs pasan a `openspec/specs/`.
- **Fuentes analizadas para derivar el comportamiento**: `src/context/AppContext.tsx` (store Zustand), `src/components/TimerCard.tsx`, `src/components/KanbanBoard.tsx` y componentes de tareas (`Card`, `SortableCard`, `DroppableColumn`), `src/components/SessionHistory.tsx`, `src/components/SettingsPanel.tsx`, `src/components/ThemeSelector.tsx`, `src/components/OnboardingWizard.tsx`, `src/components/GuideModal.tsx`, `src/components/CookieConsentBanner.tsx`, `src/lib/audio.ts`, `src/themes/index.ts`, `src/i18n/translations.ts`.
- **Dependencias / APIs externas**: ninguna nueva. La persistencia sigue siendo `localStorage`; el audio, la Web Audio API.
- **Proceso**: a partir de este baseline, el equipo usa `/opsx:propose` para todo cambio de comportamiento futuro.
