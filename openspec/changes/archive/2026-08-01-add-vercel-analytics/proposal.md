## Why

We currently have no visibility into how visitors use the app (page views, traffic volume, or trends over time). Adding lightweight, privacy-friendly web analytics gives us that visibility without building or maintaining any tracking infrastructure.

## What Changes

- Add the `@vercel/analytics` package as a runtime dependency.
- Mount the Vercel Analytics component in the app's main layout (`src/main.tsx`) so page views are collected across the whole app.
- Establish a `usage-analytics` capability describing the behavior: analytics is loaded once at the app root and collects anonymous usage data.

## Capabilities

### New Capabilities
- `usage-analytics`: Collection of anonymous, aggregate usage data (page views / traffic) via Vercel Analytics, loaded once at the application root.

### Modified Capabilities
<!-- None: no existing capability's requirements change. -->

## Impact

- **Dependencies**: adds `@vercel/analytics` to `package.json`.
- **Code**: modifies `src/main.tsx` to render the `<Analytics />` component inside the root tree.
- **Runtime**: analytics data is reported only when the app is deployed on Vercel; local/dev builds are effectively no-ops. No PII is collected.
