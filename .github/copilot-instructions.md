<!-- .github/copilot-instructions.md
Guidance for AI coding agents working on the Diet Buddy repository.
Keep this file short, actionable, and specific to this codebase.
-->

# Diet Buddy — Copilot / AI Agent Instructions

Quick orientation (what you'll see): this is a Next.js 16 app using the App Router (`/src/app`), TypeScript, Tailwind v4, and `next-themes` for theming. Key files:

- `package.json` — scripts: `dev`, `build`, `start`, `lint` (see scripts for commands).
- `src/app/layout.tsx` — root layout (imports `globals.css` and wraps with `Providers`).
- `src/app/providers.tsx` — client-side ThemeProvider (`"use client"` is used here).
- `src/app/page.tsx` — main landing page; use this as the simplest example of layout/styles.
- `src/app/globals.css` — global CSS and CSS variables (themeable colors, font variables).
- `public/` — static assets (images like `/next.svg`, `/vercel.svg`).

What to assume and follow

- App router: Add new pages or route handlers under `src/app/` (create a folder named for the route with `page.tsx` or `route.ts`).
- Server vs Client components: Files that begin with `"use client"` are client components (see `providers.tsx`). Most other files are server components by default.
- TypeScript: `tsconfig.json` is strict. Use the `@/*` path alias to import from `src/` (e.g. `import X from '@/lib/x';`).
- Styling: Tailwind utility-first classes are used. Global tokens live in `src/app/globals.css`. Fonts are added via `next/font/google` and exposed as CSS variables in `layout.tsx`.

Build / dev / lint commands (how a human would run them)

- Local dev: `npm run dev` (starts Next dev server on :3000)
- Build for production: `npm run build` then `npm run start`
- Lint: `npm run lint` (runs `eslint` configured with `eslint-config-next`)

Patterns and examples to follow

- Theme integration: `Providers` uses `next-themes`. When changing theme behavior, update `src/app/providers.tsx` and `src/app/globals.css` for CSS variables.
- Fonts: `layout.tsx` defines Geist fonts using `next/font` and maps them to CSS variables (`--font-geist-sans`, `--font-geist-mono`). Prefer that pattern when adding fonts so components can use those CSS variables.
- Client-only logic: Keep client-side hooks and browser-only code inside files that declare `"use client"` (e.g. `providers.tsx`). Avoid adding `window`/`localStorage` access in server components.

Conventions specific to this repo

- Minimal scripts: `lint` runs bare `eslint` — add flags or CI integration only if needed.
- Tailwind is included via `postcss` + `tailwindcss` v4; CSS imports happen in `globals.css` (do not duplicate Tailwind base imports elsewhere).
- Next version: This repo uses Next 16 and React 19 — be cautious when applying patterns from older Next/React versions.

Integration points and external deps

- `next-themes` — theming provider in `providers.tsx`.
- `next/font/google` — used in `layout.tsx` for fonts.
- No API or backend services are present in the repo root. If adding serverless routes, use `src/app/api/.../route.ts`.

Small examples

- Add a new route: create `src/app/notes/page.tsx` exporting a default React component (server by default). If it needs client hooks, add `src/app/notes/client-component.tsx` with `"use client"`.
- Import using path alias: `import Something from '@/components/Something';` (maps to `src/components/Something`).

What not to change without review

- `tsconfig.json` paths and `compilerOptions.strict` — changing these affects all contributors.
- Global CSS tokens in `globals.css` — many components rely on those variables for dark mode.
- Next major versions — bumping Next/React has wide impact; propose changes in an issue/PR first.

If you need more context

- Inspect `src/app/layout.tsx`, `src/app/providers.tsx`, and `src/app/globals.css` for layout, theming, and global styles examples.
- Check `package.json` for scripts and dependency versions before updating dependencies.

If something is missing or unclear, ask: What change are you making and which files should remain stable? That helps keep PRs small and safe.

— End of instructions —
