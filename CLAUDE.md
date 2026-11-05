# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

`uysot` is a workspace for **reconstructing lost frontend source code from production builds**. Each target gets its own self-contained React + Vite project inside `demo/<name>/`. There is **no root-level `package.json` or toolchain**: install, run and build inside each `demo/<name>/`. There are no lint or test setups. Verification so far has been `npm run build`, `tsc`, and checks in a headless browser. Each project's `RECONSTRUCTION.md` describes how it was checked.

## Targets and status

Each `demo/<name>/task.md` is the full brief for one target (in Russian). The briefs are identical apart from the URL and the output folder.

| Output folder | Live site | Status |
|---|---|---|
| `demo/app` | https://app.dev.uysot.uz/ | Public part restored (login/SMS/Telegram, password restore, QR pages, etc.). The main app behind login (`/main/*`) is **not** restored yet |
| `demo/boss` | https://boss.app.uysot.uz/auth/login | Fully restored (the build is small: login, forbidden page, dashboard stub) |
| `demo/admin` | https://admin.meninguyim.uysot.uz/login | Not started, only `task.md` |
| `demo/ads` | https://dashboard.ads.uysot.uz/ | Not started, only `task.md` |
| `demo/showroom` | https://showroom.app.uysot.uz/login | Not started, only `task.md` |

"Restore into `/demo/<name>`" in a task means the repo-relative `demo/<name>/` directory, not a filesystem root path. Each restored project has a `RECONSTRUCTION.md` (in Russian) with the module map, the exact-vs-inferred accuracy report and run instructions. **Read it before changing that project.** `docs/` holds session logs, for example `docs/session-2026-11-02-app-restore.md`, which includes the next steps for `demo/app`.

## Per-project commands

```bash
# demo/app — React 18, antd 4, RTK 1.9, react-query 3, non-strict TS
cd demo/app && npm install
npm run dev          # needs the real backend
npm run dev:mock     # no backend: admin/admin123, SMS code 123456 (src/mocks, enabled by .env.mock)
npm run build        # also build:mock, preview, typecheck (tsc --noEmit)

# demo/boss — React 18, antd 5, RTK 2, TanStack Query 5, react-hook-form + zod, Tailwind 3, strict TS
cd demo/boss && cp .env.example .env   # fill in VITE_TOLGEE_API_KEY
npm ci
npm run dev          # build = tsc --noEmit && vite build; also preview, typecheck
```

Both projects use the `@/` → `src/` alias (in `vite.config.ts` and `tsconfig.json`) and `build.sourcemap: "hidden"`, so maps stay in `dist/` and the sources can't be lost again. Dependency versions are pinned to the versions detected in each bundle, so don't bump them casually.

## Shared tooling

- **`scripts/fetch-build.mjs`** (Node 18+, no dependencies) downloads a site's `index.html` plus every JS/CSS chunk, including lazy ones, and probes for source maps. Use it like this: `node scripts/fetch-build.mjs <url> demo/<name>/_build`. For pages behind login, pass `--cookie "<Cookie header>"` or set `FETCH_COOKIE`. `_build/` is gitignored per project and can be re-downloaded.
- **`tools/restore/`** is the pipeline that generated `demo/app`. It splits the bundle into declarations with acorn (`units.mjs`), maps vendor references to npm imports (`maps.py`), assigns declarations to files (`assign.py`), emits files (`emit*.py`, `finalize.py`), restores CSS modules by hash (`css.mjs`), then cleans up with `wakaru` and `prettier` (`beautify.sh`). The pipeline is **specific to the app build**: it hardcodes `/home/claude/work` and the app's chunk names. Treat it as a reference and adapt it for other targets. Don't expect it to run as-is.

## Findings to reuse on the remaining targets

- **Stack:** the briefs say "React.js, Next.js built with Vite", but both bundles examined so far are plain **Vite + React 18 + TypeScript SPAs with React Router 6, not Next.js**. Confirm this for each new target from its bundle.
- **Source maps:** none were found for app or boss. The servers fall back to `index.html` with HTTP 200 for any path, so a 200 on `*.map` means nothing until you check the body.
- **Sentry** (app): the Sentry Vite plugin leaves `data-sentry-source-file` attributes in JSX. These give **exact original file paths**, so use them first when assigning code to files. The real source maps may be uploaded to Sentry; `demo/app/RECONSTRUCTION.md` has the project ID.
- **Split builds** (app): the public shell (`apps/open.tsx`) and the authenticated app (`/assets/app-*.js`) are separate entry points. A Vercel middleware serves the authenticated one only with a valid session cookie.
- **Lazy loading:** app uses `import()` and those chunks were restored. Boss has no lazy loading at all (one JS chunk), so its routes are imported directly, as in the original. Don't invent code-splitting the bundle doesn't show.

## Required workflow (from the task specs)

1. **Look for source maps first** (`.map` files, `sourceMappingURL` comments, other discovery methods). Only if none can be found, fall back to analysing the minified bundle and its lazy-loaded chunks.
2. Extract facts from the bundle → build a module map → design the new tree → move code into files. Don't skip straight to writing.
3. The target layout is the standard React + Vite one: `src/pages`, `src/components`, `src/hooks`, `src/layouts`, `src/utils`, `src/services`, `src/constants`, `src/assets`, `src/styles`, `src/router`. Where the bundle reveals the original paths (via Sentry), keep those paths even when they deviate from this layout; `demo/app` has `modules/`, `global/`, `store/`, `apps/` and `bootstrap/` for this reason. Don't create empty folders for which the bundle has no code.
4. Restore React Router routes and `React.lazy` code-splitting where the bundle shows them. Split large minified modules and large components into small, meaningfully named files, and extract duplicated code.
5. The result must install, run and build again, with minimal stubs where code can't be recovered.

## Rules that constrain the code you write

- **Behavior over beauty.** Restore existing behavior first. Don't "nicely rewrite" logic you aren't sure about. Quirks of the original stay in, such as the duplicated `referralCode` key in `demo/app`.
- **Don't change external contracts:** API requests, routes, environment variable names, `localStorage` keys and data formats must stay as found in the bundle. Replace values the bundle inlined from env back with `import.meta.env.VITE_*`.
- Don't remove meaningful business logic without a strong reason. Strip only build-tool scaffolding (bundler runtime, chunk loaders, preload helpers, etc.), and replace inlined libraries with npm imports.
- Anything that can't be recovered exactly must carry the marker `TODO: inferred from build`, alongside the most likely implementation. `demo/app` puts it in a per-file header (`// [restore] TODO: inferred from build — …`) and marks exact-path files with `// [restore] Путь файла восстановлен точно` ("file path restored exactly"). Keep the exact marker string so that inferred code stays greppable.
- Use neutral, purpose-based file names where the original names are unrecoverable.
- **Secrets:** don't commit keys extracted from a build. Put them in a gitignored `.env` and ship a `.env.example`, as `demo/boss` does with `VITE_TOLGEE_API_KEY`. Public client keys such as the reCAPTCHA site key in `demo/app/.env` are fine to commit.

## Expected deliverable for each reconstruction

Besides the files, the task spec asks for a written report, kept as `demo/<name>/RECONSTRUCTION.md`. It contains the folder tree, a mapping of bundle modules → new files, separate lists of pages, shared components, hooks, utils, services and configs, which parts are recovered exactly versus inferred, and how the result was verified.
