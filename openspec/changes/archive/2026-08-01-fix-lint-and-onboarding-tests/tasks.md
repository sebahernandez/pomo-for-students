## 1. Arreglar tests de OnboardingWizard

- [x] 1.1 Actualizar los matchers de `src/test/OnboardingWizard.test.tsx` para el título actual ("Bienvenido a POMO FOR STUDY")
- [x] 1.2 Ejecutar `npm run test:run` y confirmar que los 12 tests pasan

## 2. Arreglar errores de lint

- [x] 2.1 Reemplazar el `setState` dentro de `useEffect` por un inicializador perezoso de `useState` en `OnboardingWizard.tsx` y `CookieConsentBanner.tsx`, conservando su comportamiento observable
- [x] 2.2 Extraer `DarkModeInit` de `main.tsx` a su propio archivo e importarlo
- [x] 2.3 Ejecutar `npm run lint` y confirmar 0 errores

## 3. Verificación final

- [x] 3.1 Ejecutar `npm run build` y confirmar que compila sin errores
