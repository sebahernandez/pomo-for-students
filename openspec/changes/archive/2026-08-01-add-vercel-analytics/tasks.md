## 1. Dependency

- [x] 1.1 Run `npm i @vercel/analytics` and confirm it is added to `package.json` dependencies
- [x] 1.2 Confirm `package-lock.json` is updated accordingly

## 2. Integration

- [x] 2.1 Import `{ Analytics }` from `@vercel/analytics/react` in `src/main.tsx`
- [x] 2.2 Render `<Analytics />` once at the root inside the `<StrictMode>` tree (sibling of the layout wrapper)

## 3. Verification

- [x] 3.1 Run `npm run build` and confirm it compiles with no type errors
- [x] 3.2 Run `npm run dev` and confirm the app renders normally with the analytics script injected and no console errors
