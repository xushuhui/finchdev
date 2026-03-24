# FinchDev Project Context

## Project Overview
FinchDev is a collection of free online developer tools built as a Vue 3 application with SSG support via `vite-ssg`. It provides quick, in-browser utilities including:
- JSON Formatter & Minifier
- Regex Tester
- Base64 Encode/Decode
- Unix Timestamp Converter
- URL Encode/Decode

**Main Technologies:**
- **Framework:** Vue 3 (Composition API, `<script setup>`)
- **Language:** TypeScript for all frontend code
- **Router:** Vue Router
- **UI Library:** TDesign Vue Next
- **Meta Tags Management:** `@unhead/vue`
- **Build Tool:** Vite & `vite-ssg`
- **Package Manager:** bun
- **Testing:** Node.js native test runner (`node:test`)

## Building and Running

**Install Dependencies:**
```bash
bun install
```

**Development Server:**
```bash
bun run dev
```

**Type Checking:**
```bash
bun run typecheck
```
*(Runs the TS-only frontend policy check, then `vue-tsc --noEmit`.)*

**Testing:**
```bash
bun run test
```
*(Runs tests using the native Node.js test runner against `src/tests/*.test.ts`.)*

**Production Build:**
```bash
bun run build
```
*(This automatically triggers `prebuild` which runs `generate:sitemap`, followed by `vite-ssg build`.)*

**Preview Production Build:**
```bash
bun run preview
```

## Development Conventions

- **Component Structure:** Use Vue 3 `<script setup>` syntax. Vue SFC scripts must use `lang="ts"`. Most tool views wrap their content in `<ToolLayout>` which handles standard tool headers, descriptions, usage sections, and FAQs consistently.
- **Frontend Language Policy:** Frontend code must use TypeScript only. Do not add `.js` or `.jsx` files under `src/`.
- **Styling:** Use TDesign components, tokens, and CSS variables. The project supports both light and dark modes via `src/composables/useTheme.ts`.
- **State Management:** Rely on Vue's built-in `ref`, `reactive`, and `computed` for local state management within components.
- **Testing:** Business logic functions (located in `src/utils/`) should be independently testable. Add tests to the `src/tests/` directory using the Node.js native test runner and `.test.ts` files.
- **SEO & Meta:** Tool views define SEO via `src/composables/useSeoHead.ts`, using metadata from `src/data/tools.ts`.
- **Logic Separation:** Keep core logic (e.g. base64 encoding, regex matching, json formatting) in the `src/utils/` directory, decoupled from Vue UI components.
