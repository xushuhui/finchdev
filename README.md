# FinchDev

Free Online Developer Tools. Built with Vue 3, TDesign, TypeScript, and Vite.

## Features

- **JSON Formatter**: Format, minify, and validate JSON.
- **Regex Tester**: Test regular expressions with live results.
- **Base64 Tool**: Encode and decode text to/from Base64.
- **Timestamp Converter**: Convert Unix timestamps to readable dates and back.
- **URL Encoder**: Encode and decode URL components safely.

## Tech Stack

- **Vue 3**: Progressive frontend framework.
- **TypeScript**: Default language for all frontend logic and component scripts.
- **TDesign Vue Next**: Enterprise-class UI design language and component library.
- **Vite + vite-ssg**: Next-generation frontend tooling with Static Site Generation.
- **Bun**: Fast all-in-one JavaScript runtime.

## Getting Started

### Prerequisites

You need [Bun](https://bun.sh/) installed on your machine.

### Installation

```bash
bun install
```

### Development

```bash
bun run dev
```

### Type Checking

```bash
bun run typecheck
```

This command also enforces the frontend TypeScript policy: frontend source code must use TypeScript and must not add `.js` or `.jsx` files under `src/`, and Vue component scripts must use `lang="ts"`.

### Build

```bash
bun run build
```

The output will be in the `dist` folder, ready for static hosting.

## Development Rules

- Frontend code must use TypeScript. Do not add JavaScript source files under `src/`.
- Vue single-file components must use `<script setup lang="ts">` or `<script lang="ts">`.
- Keep transformation logic in `src/utils/` and cover it with tests in `src/tests/`.
- Use TDesign Vue Next components and design tokens for UI work.

## Project Structure

- `src/views/`: Tool-specific UI components.
- `src/utils/`: Core transformation logic.
- `src/tests/`: Unit tests for utility functions.
- `src/data/tools.ts`: Configuration for all tools.
- `scripts/check-frontend-ts-only.mjs`: Frontend TypeScript policy enforcement.

## License

MIT
