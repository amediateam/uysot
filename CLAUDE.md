# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

`uysot` is a workspace for **reconstructing lost frontend source code from production builds**. There is no application code, `package.json`, build, lint or test tooling yet — the repo currently holds only the task specs under `demo/`. Each reconstruction is expected to produce its own self-contained React + Vite project inside its `demo/<name>/` folder, so build/dev/test commands will be per-project (inside each `demo/<name>/`) once those projects exist. Don't assume a root-level toolchain.

## The five targets

Each `demo/<name>/task.md` is the full brief for one target (written in Russian). They are identical apart from the URL and the output folder:

| Output folder | Live site to reconstruct from |
|---|---|
| `demo/admin` | https://admin.meninguyim.uysot.uz/login |
| `demo/ads` | https://dashboard.ads.uysot.uz/ |
| `demo/app` | https://app.dev.uysot.uz/ |
| `demo/boss` | https://boss.app.uysot.uz/auth/login |
| `demo/showroom` | https://showroom.app.uysot.uz/login |

"Restore into `/demo/<name>`" in a task means the repo-relative `demo/<name>/` directory, not a filesystem root path. The five sites likely share a stack and possibly shared code (same `uysot.uz` family), so look for common modules across them, but keep each project independent unless told otherwise.

## Required workflow (from the task specs)

1. **Look for Source Maps first** (`.map` files, `sourceMappingURL` comments, alternative discovery methods). Only if none can be found, fall back to analysing the minified bundle and its lazy-loaded chunks.
2. Extract facts from the bundle → build a module map → design the new tree → move code into files. Don't skip straight to writing.
3. Target layout is the standard React + Vite one: `src/pages`, `src/components`, `src/hooks`, `src/layouts`, `src/utils`, `src/services`, `src/constants`, `src/assets`, `src/styles`, `src/router`.
4. Restore React Router routes and `React.lazy` code-splitting where the bundle shows them. Split large minified modules and large components into small, meaningfully named files; extract duplicated code.
5. The result must install, run and build again, with minimal stubs where code can't be recovered.

## Rules that constrain the code you write

- **Behavior over beauty.** Restore existing behavior first; do not "nicely rewrite" logic you aren't sure about.
- **Don't change external contracts:** API requests, routes, environment variable names and data formats must stay as found in the bundle.
- Don't remove meaningful business logic without a strong reason. Strip only build-tool scaffolding (bundler runtime, chunk loaders, etc.).
- Anything that can't be recovered exactly must carry the marker comment `// TODO: inferred from build` alongside the most likely implementation. Keep using this exact string so inferred code stays greppable.
- Neutral, purpose-based file names where original names are unrecoverable.

## Expected deliverable for each reconstruction

The task spec asks for a written report in addition to the files: the proposed folder tree; a mapping of bundle modules → new files; separate lists of pages, shared components, hooks, utils, services and configs; and which parts are recovered exactly versus inferred.

Note the spec describes the stack as "React.js, Next.js built with Vite" — internally inconsistent. Confirm from the bundle which it actually is (the spec's own layout and React Router requirement point to a plain Vite + React SPA) rather than assuming Next.js.
