# FinchDev

Free Online Developer Tools. Built with Vue 3, TDesign, and Vite.

## Features

- **JSON Formatter**: Format, minify, and validate JSON.
- **Regex Tester**: Test regular expressions with live results.
- **Base64 Tool**: Encode and decode text to/from Base64.
- **Timestamp Converter**: Convert Unix timestamps to readable dates and back.
- **URL Encoder**: Encode and decode URL components safely.

## Tech Stack

- **Vue 3**: Progressive JavaScript Framework.
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

### Build

```bash
bun run build
```

The output will be in the `dist` folder, ready for static hosting.

## Project Structure

- `src/views/`: Tool-specific UI components.
- `src/utils/`: Core transformation logic.
- `src/tests/`: Unit tests for utility functions.
- `src/data/tools.js`: Configuration for all tools.

## License

MIT
