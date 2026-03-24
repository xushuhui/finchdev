# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

FinchDev is a Vue 3 developer tools website (finchdev.com) built with TDesign Vue Next, TypeScript, and SSR/SSG via vite-ssg. It provides free online tools like JSON formatter, regex tester, Base64 encoder, timestamp converter, and URL encoder. All processing is purely client-side.

## Commands

```bash
bun install        # Install dependencies
bun run dev        # Start dev server at localhost:5173
bun run build      # Build for production (static site generation)
bun run preview    # Preview production build
bun run test       # Run all tests using Node.js built-in test runner
bun run typecheck  # Enforce TS-only frontend policy and run vue-tsc
```

For a single test file: `node --test src/tests/jsonTools.test.ts`

## Architecture

### Tech Stack
- **Framework:** Vue 3 (Composition API)
- **Language:** TypeScript for all frontend code
- **UI Library:** TDesign Vue Next (Official)
- **Icons:** TDesign Icons Vue Next
- **Build Tool:** Vite + vite-ssg
- **Meta/SEO:** @unhead/vue
- **Package Manager:** Bun
- **Testing:** Node.js built-in test runner

### Tool Structure
Each tool follows the same pattern:
- **View component** (`src/views/{ToolName}.vue`) - UI using TDesign components with `lang="ts"`
- **Utility functions** (`src/utils/{toolName}Tools.ts`) - Pure transformation logic
- **Test file** (`src/tests/{toolName}Tools.test.ts`) - Unit tests for utilities

### Key Files
- `src/data/tools.ts` - Single source of truth for tool metadata (names, paths, SEO, icons)
- `src/router/index.ts` - Router bootstrap
- `src/router/routeModules.ts` - Route module definitions and lazy loading
- `src/components/ToolLayout.vue` - Standard layout wrapper for all tools
- `src/composables/useTheme.ts` - Theme logic (TDesign compatible)
- `src/style.css` - Global styles and TDesign variable overrides
- `scripts/check-frontend-ts-only.mjs` - Enforces TS-only frontend source policy

## Development Rules

- **Frontend Language Policy:** Frontend code must use TypeScript only. Do not add `.js` or `.jsx` files under `src/`, and every Vue script block must declare `lang="ts"`.
- **UI Standard:** Use TDesign Vue Next components exclusively. Do not use Tailwind CSS.
- **Theme:** Support both light and dark modes. Use TDesign CSS variables (`--td-text-color-primary`, etc.) for custom styles.
- **Logic:** Keep transformation logic in `src/utils/` and ensure it is covered by tests.
- **Icons:** Use `tdesign-icons-vue-next` for all UI icons.
