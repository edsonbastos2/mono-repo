# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Turborepo (npm workspaces) monorepo for a Brazilian tax reform ("reforma tributária") project. Two apps — a NestJS API and a Next.js frontend — plus shared packages. Both apps are still close to their scaffold state and are not yet integrated with each other.

`README.md` is the untouched `create-turbo` starter text (it describes `docs`/`web` apps that do not exist here). Ignore it; this file is the source of truth.

## Commands

Run from the repo root (Turborepo fans out to every workspace):

- `npm run dev` — start all apps in watch mode (`turbo dev`)
- `npm run build` — build all workspaces
- `npm run lint` — lint all workspaces
- `npm run check-types` — only `packages/ui` defines this script, so this effectively type-checks just the UI package
- `npm run format` — Prettier over `**/*.{ts,tsx,md}`
- Scope to one workspace: `npx turbo dev --filter=frontend` (names: `frontend`, `backend`, `@repo/ui`)

### Backend (`apps/backend`, run from that directory)

- `npm run dev` — `nest start --watch`, listens on `PORT` (`.env`, default `4000`)
- `npm test` / `npm run test:watch` — Vitest (not Jest)
- Single test: `npx vitest run src/app.controller.spec.ts` or `npx vitest -t "substring of test name"`
- `npm run test:e2e` — runs `*.e2e-spec.ts` via `vitest.config.e2e.ts`
- `npm run lint` — **oxlint** (config in `oxlint.json`), not ESLint
- `npm run build` — `nest build` → `dist/`; `npm run start:prod` runs `node dist/main`

### Frontend (`apps/frontend`, run from that directory)

- `npm run dev` — `next dev`
- `npm run lint` — ESLint (`eslint-config-next`)
- `npm run build` / `npm start`

## Architecture notes

### apps/backend — NestJS 12, native ESM

- `"type": "module"` with `module`/`moduleResolution: nodenext`: **relative imports must carry the `.js` extension** (`./app.module.js`), even though the source files are `.ts`.
- `main.ts` enables CORS globally and awaits `bootstrap()` at top level.
- `@nestjs/config` `ConfigModule.forRoot({ isGlobal: true })` — env comes from `apps/backend/.env` (see `.env.example`).
- Standard Nest layering: `AppModule` wires controllers + providers; `*.spec.ts` sit next to source and use `@nestjs/testing`. `vite-tsconfig-paths` resolves TS path aliases in tests.

### apps/frontend — Next.js 16 App Router

- React 19, App Router under `src/app/`, path alias `@/*` → `src/*`.
- Tailwind CSS v4 via `@tailwindcss/postcss` (no `tailwind.config.*`; configured in CSS).
- **Standalone**: does not depend on `@repo/ui`, `@repo/eslint-config`, or `@repo/typescript-config` — it carries its own ESLint and tsconfig. Wiring it to the shared packages is still an open task.

### packages/ui — `@repo/ui`

- Shared React components consumed as `@repo/ui/button`, `@repo/ui/card`, etc. `exports` maps `./*` straight to `./src/*.tsx` — **no build step**, consumers import the TSX directly.
- Currently the only consumer of the shared `@repo/*` config packages.

### packages/eslint-config & packages/typescript-config

- Flat ESLint configs: `@repo/eslint-config/{base,next-js,react-internal}`. `base.js` includes `eslint-plugin-only-warn`, so every rule is downgraded to a warning.
- TS bases: `@repo/typescript-config/{base,nextjs,react-library}.json`.

## Toolchain quirks

- Requires Node >= 24; pinned to npm 11.x (`package-lock.json`, npm workspaces).
- Toolchain is intentionally heterogeneous per workspace: backend = oxlint + Vitest; frontend = ESLint + Next; only `@repo/ui` runs `tsc` type-checks.
- TypeScript versions differ by workspace: root and `@repo/ui` use the TS 7 preview (`typescript@7.0.2`), backend uses TS 6 (`^6.0.2`), frontend uses TS 5 (`^5`).
