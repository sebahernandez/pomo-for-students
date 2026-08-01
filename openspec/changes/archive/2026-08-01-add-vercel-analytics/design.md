## Context

The app is a Vite + React 19 SPA (no Next.js). The root tree is assembled in `src/main.tsx`, which renders `<Header>`, `<main><App /></main>`, `<Footer>`, plus a few app-wide siblings (backdrop, onboarding, cookie banner). This is the single mounting point that wraps the whole app, so it is the natural home for an app-wide analytics component. See proposal.md — Why.

## Goals / Non-Goals

**Goals:**
- Collect anonymous page-view/traffic data across the entire app with a single mount point.
- Zero configuration and zero custom backend.

**Non-Goals:**
- Custom event tracking, funnels, or per-feature instrumentation.
- Consent-gating the analytics load (Vercel Analytics is cookieless and anonymous; the existing `cookie-consent` capability is unaffected).
- Server-side or SSR wiring — this is a client-only SPA.

## Decisions

- **Use `@vercel/analytics/react` `<Analytics />` component.** For a Vite/React SPA the React subpath export is the supported entry point (the `/next` subpath is Next.js-specific). It is a self-contained component that injects the analytics script and requires no props for basic page-view tracking. Alternative considered: a third-party analytics library (e.g. Plausible/GA) — rejected as heavier and requiring separate account/config, whereas Vercel Analytics is already aligned with the likely hosting.
- **Mount in `src/main.tsx` at the root, as a sibling of the layout wrapper.** Rendering it once at the root satisfies the "initialized once at the application root" requirement and covers all views. Alternative considered: mounting inside `App.tsx` — rejected because `App` is only the timer/kanban view, not the true app root.

## Risks / Trade-offs

- [Analytics only reports when hosted on Vercel] → Acceptable and intended; in dev/local the component is a no-op, matching the "inert outside production hosting" requirement.
- [Wrong import subpath (`/next` vs `/react`)] → Mitigated by explicitly importing from `@vercel/analytics/react`.
