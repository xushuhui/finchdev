# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

FinchDev is a Vue 3 developer tools website (finchdev.com) built with TDesign Vue Next and SSR/SSG via vite-ssg. It provides free online tools like JSON formatter, regex tester, Base64 encoder, timestamp converter, and URL encoder. All processing is purely client-side.

## Commands

```bash
bun install        # Install dependencies
bun run dev        # Start dev server at localhost:5173
bun run build      # Build for production (static site generation)
bun run preview    # Preview production build
bun run test       # Run all tests using Node.js built-in test runner
```

For a single test file: `node --test src/tests/jsonTools.test.js`

## Architecture

### Tech Stack
- **Framework:** Vue 3 (Composition API)
- **UI Library:** TDesign Vue Next (Official)
- **Icons:** TDesign Icons Vue Next
- **Build Tool:** Vite + vite-ssg
- **Meta/SEO:** @unhead/vue
- **Package Manager:** Bun
- **Testing:** Node.js built-in test runner

### Tool Structure
Each tool follows the same pattern:
- **View component** (`src/views/{ToolName}.vue`) - UI using TDesign components
- **Utility functions** (`src/utils/{toolName}Tools.js`) - Pure transformation logic
- **Test file** (`src/tests/{toolName}Tools.test.js`) - Unit tests for utilities

### Key Files
- `src/data/tools.js` - Single source of truth for tool metadata (names, paths, SEO, icons)
- `src/router/index.js` - Route definitions
- `src/components/ToolLayout.vue` - Standard layout wrapper for all tools
- `src/composables/useTheme.js` - Dark/light mode logic (TDesign compatible)
- `src/style.css` - Global styles and TDesign variable overrides

## Development Rules

- **UI Standard:** Use TDesign Vue Next components exclusively. Do not use Tailwind CSS.
- **Theme:** Support both light and dark modes. Use TDesign CSS variables (`--td-text-color-primary`, etc.) for custom styles.
- **Logic:** Keep transformation logic in `src/utils/` and ensure it is covered by tests.
- **Icons:** Use `tdesign-icons-vue-next` for all UI icons.
