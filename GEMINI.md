# FinchDev Project Context

## Project Overview
FinchDev is a collection of free online developer tools built as a Single Page Application (SPA) with Server-Side Generation (SSG) capabilities. It provides quick, in-browser utilities including:
- JSON Formatter & Minifier
- Regex Tester
- Base64 Encode/Decode
- Unix Timestamp Converter
- URL Encode/Decode

**Main Technologies:**
- **Framework:** Vue 3 (Composition API, `<script setup>`)
- **Router:** Vue Router
- **Styling:** Tailwind CSS
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

**Testing:**
```bash
bun run test
```
*(Runs tests using the native Node.js test runner against `src/tests/*.test.js`)*

**Production Build:**
```bash
bun run build
```
*(This automatically triggers `prebuild` which runs `generate:sitemap`, followed by `vite-ssg build`)*

**Preview Production Build:**
```bash
bun run preview
```

## Development Conventions

- **Component Structure:** Use Vue 3 `<script setup>` syntax. Most tool views wrap their content in `<ToolLayout>` which handles standard tool headers, descriptions, usage sections, and FAQs consistently.
- **Styling:** Use Tailwind CSS utility classes. The project supports both light and dark modes (utilizing the `.dark` class, managed via `src/composables/useTheme.js`).
- **State Management:** Rely on Vue's built-in `ref` and `reactive` for local state management within components.
- **Testing:** Business logic functions (located in `src/utils/`) should be independently testable. Add tests to the `src/tests/` directory using the Node.js native test runner.
- **SEO & Meta:** Each tool view defines its title and meta description using `@unhead/vue` (`useHead`), pulling configurations from the central `src/data/tools.js` definitions.
- **Logic Separation:** Keep core logic (e.g., base64 encoding, regex matching, json formatting) in the `src/utils/` directory, decoupled from Vue UI components. This ensures they are easily testable.
