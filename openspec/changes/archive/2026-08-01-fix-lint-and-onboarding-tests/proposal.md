## Why

Tras renombrar el proyecto a "POMO FOR STUDY", quedaron fallos preexistentes que ensucian la señal de calidad: 3 tests de `OnboardingWizard` fallan porque esperan el título antiguo, y `npm run lint` reporta 2 errores. Ninguno cambia el comportamiento de la app, pero impiden tener una base verde antes de adoptar SDD.

## What Changes

- **Tests**: Actualizar `OnboardingWizard.test.tsx` para que coincida con el título actual del asistente ("Bienvenido a POMO FOR STUDY") en lugar del obsoleto "Bienvenido a Pomodoro".
- **Lint (`set-state-in-effect`)**: En `OnboardingWizard.tsx` y `CookieConsentBanner.tsx`, calcular la visibilidad inicial con un inicializador perezoso de estado en vez de `setState` dentro de un `useEffect`. El comportamiento observable (mostrarse solo en la primera visita / hasta registrar consentimiento) se mantiene idéntico.
- **Lint (`only-export-components`)**: Extraer el componente `DarkModeInit` de `main.tsx` a su propio archivo para que el punto de entrada no mezcle componente y efectos.
- Sin cambios de comportamiento observable, de API ni de dependencias. No hay cambios **BREAKING**.

## Capabilities

Este cambio no altera comportamiento a nivel de especificación (corrección de tests y de reglas de lint). Declara `skip_specs: true` en su `.openspec.yaml`; no crea ni modifica specs.

## Impact

- **Archivos afectados**: `src/test/OnboardingWizard.test.tsx`, `src/components/OnboardingWizard.tsx`, `src/components/CookieConsentBanner.tsx`, `src/main.tsx`, y un archivo nuevo para `DarkModeInit`.
- **Comportamiento en runtime**: sin cambios.
- **Verificación**: `npm run test:run` y `npm run lint` deben quedar en verde.
