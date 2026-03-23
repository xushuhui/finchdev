# FinchDev TypeScript Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert FinchDev from JavaScript to TypeScript without changing product behavior, then complete the first tightening pass toward strict typing.

**Architecture:** Establish TypeScript project infrastructure first, then migrate low-coupling modules before moving into Vue views and shared components. Keep runtime behavior stable by validating every phase with `test`, `build`, and `typecheck`, and only enable the first strictness wave after all source files compile under TypeScript.

**Tech Stack:** Vue 3, Vite, vite-ssg, TypeScript, vue-tsc, node:test, Bun

---

## File Structure Map

### New files

- `tsconfig.json`: TypeScript compiler configuration for app code, tests, and Vite config
- `env.d.ts`: Vue and Vite module declarations
- `src/types/tools.ts`: Shared metadata and route types
- `src/types/results.ts`: Shared utility result and page state types when they stop fitting locally

### Files to rename or migrate

- `vite.config.js` -> `vite.config.ts`: Typed Vite config and plugin wiring
- `src/main.js` -> `src/main.ts`: Typed app entry
- `src/utils/*.js` -> `src/utils/*.ts`: Typed tool utilities
- `src/build/*.js` -> `src/build/*.ts`: Typed build helpers and resolvers
- `src/data/tools.js` -> `src/data/tools.ts`: Typed tool registry
- `src/router/*.js` -> `src/router/*.ts`: Typed route modules and route list
- `src/composables/*.js` -> `src/composables/*.ts`: Typed reusable hooks
- `src/tests/*.test.js` -> `src/tests/*.test.ts`: Typed tests

### Files to update in place

- `src/views/*.vue`: `<script setup lang="ts">`, typed refs, typed events, typed helper calls
- `src/components/*.vue`: typed props and local state
- `package.json`: add `typecheck` script and TS dependencies
- `bun.lock`: lockfile update after dependency changes

---

### Task 1: Establish TypeScript Project Infrastructure

**Files:**
- Create: `tsconfig.json`
- Create: `env.d.ts`
- Modify: `package.json`
- Modify: `bun.lock`
- Modify: `vite.config.js`
- Modify: `src/main.js`

- [ ] **Step 1: Add TypeScript toolchain dependencies**

Run:
```bash
bun add -d typescript vue-tsc @types/node
```

Expected: `package.json` contains the new dev dependencies and `bun.lock` is updated.

- [ ] **Step 2: Write the failing typecheck command**

Update `package.json` with:
```json
{
  "scripts": {
    "typecheck": "vue-tsc --noEmit"
  }
}
```

Run:
```bash
bun run typecheck
```

Expected: FAIL because `tsconfig.json` and TypeScript entry files do not exist yet.

- [ ] **Step 3: Add the initial TS config and env declarations**

Create `tsconfig.json` with a migration-safe baseline:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "useDefineForClassFields": true,
    "isolatedModules": true,
    "noEmit": true,
    "strict": false,
    "allowJs": false,
    "checkJs": false,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["node"]
  },
  "include": [
    "env.d.ts",
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "vite.config.ts"
  ]
}
```

Create `env.d.ts` with:
```ts
/// <reference types="vite/client" />
```

- [ ] **Step 4: Convert config and entry files to TypeScript**

Rename and update:
- `vite.config.js` -> `vite.config.ts`
- `src/main.js` -> `src/main.ts`

Key expectations:
```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
```

```ts
import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routes } from './router'
```

- [ ] **Step 5: Run typecheck to verify the foundation passes**

Run:
```bash
bun run typecheck
```

Expected: either PASS, or fail only on remaining non-migrated source files referenced by the entry/router graph.

- [ ] **Step 6: Commit the TS foundation**

Run:
```bash
git add package.json bun.lock tsconfig.json env.d.ts vite.config.ts src/main.ts
```

Commit message:
```bash
git commit -m "build(ts): add typescript foundation"
```

---

### Task 2: Migrate Build Helpers, Shared Types, Router, and Data Layer

**Files:**
- Create: `src/types/tools.ts`
- Modify: `src/build/chunking.js`
- Modify: `src/build/tdesignResolver.js`
- Modify: `src/data/tools.js`
- Modify: `src/router/index.js`
- Modify: `src/router/routeModules.js`
- Test: `src/tests/chunking.test.js`
- Test: `src/tests/routeModules.test.js`
- Test: `src/tests/tdesignResolver.test.js`

- [ ] **Step 1: Rename the build, router, data, and related test files to TS**

Rename:
```bash
mv src/build/chunking.js src/build/chunking.ts
mv src/build/tdesignResolver.js src/build/tdesignResolver.ts
mv src/data/tools.js src/data/tools.ts
mv src/router/index.js src/router/index.ts
mv src/router/routeModules.js src/router/routeModules.ts
mv src/tests/chunking.test.js src/tests/chunking.test.ts
mv src/tests/routeModules.test.js src/tests/routeModules.test.ts
mv src/tests/tdesignResolver.test.js src/tests/tdesignResolver.test.ts
```

- [ ] **Step 2: Write the failing type-level expectations for the tool registry**

Create `src/types/tools.ts` with explicit interfaces first, then wire a failing compile by annotating `toolDefinitions` and `routeMeta` in `src/data/tools.ts`.

Example target types:
```ts
export interface ToolDefinition {
  name: string
  path: `/${string}`
  icon: string
  cardDescription: string
  h1: string
  title: string
  description: string
}

export interface RouteMetaDefinition {
  title: string
  description: string
  url: string
}

export interface ToolRouteModule {
  name: string
  path: `/${string}`
  file: string
  importMode: 'sync' | 'async'
  loader?: () => Promise<unknown>
}
```

Run:
```bash
bun run typecheck
```

Expected: FAIL until the migrated files line up with these explicit interfaces.

- [ ] **Step 3: Implement the minimal typed versions of the build and router modules**

Update `src/build/chunking.ts`:
```ts
export function getManualChunkName(id: string): string | undefined {
  // existing branching logic, typed return
}
```

Update `src/build/tdesignResolver.ts`:
```ts
export interface TDesignResolvedComponent {
  name: string
  from: string
}

export function resolveTDesignComponent(componentName: string): TDesignResolvedComponent | undefined {
  // existing lookup logic, typed map
}
```

Update `src/router/routeModules.ts` and `src/router/index.ts` to import `ToolRouteModule` and use typed arrays.

- [ ] **Step 4: Make the route metadata and tool registry compile cleanly**

Update `src/data/tools.ts` to export typed constants:
```ts
export const toolDefinitions: ToolDefinition[] = [
  // existing tool objects
]

export const routeMeta: Record<string, RouteMetaDefinition> = {
  // homepage + generated route meta
}
```

- [ ] **Step 5: Run focused tests and typecheck**

Run:
```bash
node --test src/tests/chunking.test.ts src/tests/routeModules.test.ts src/tests/tdesignResolver.test.ts
bun run typecheck
```

Expected: PASS.

- [ ] **Step 6: Commit the typed build/router layer**

Run:
```bash
git add src/build src/data src/router src/types src/tests/chunking.test.ts src/tests/routeModules.test.ts src/tests/tdesignResolver.test.ts
```

Commit message:
```bash
git commit -m "refactor(ts): migrate build and routing modules"
```

---

### Task 3: Migrate Utility Modules and Their Tests

**Files:**
- Modify: `src/utils/base64Tools.js`
- Modify: `src/utils/colorTools.js`
- Modify: `src/utils/cronTools.js`
- Modify: `src/utils/diffTools.js`
- Modify: `src/utils/hashTools.js`
- Modify: `src/utils/htmlEntityTools.js`
- Modify: `src/utils/jsonTools.js`
- Modify: `src/utils/jwtTools.js`
- Modify: `src/utils/markdownTools.js`
- Modify: `src/utils/qrTools.js`
- Modify: `src/utils/regexTools.js`
- Modify: `src/utils/timestampTools.js`
- Modify: `src/utils/urlTools.js`
- Modify: `src/utils/uuidTools.js`
- Modify: `src/utils/yamlJsonTools.js`
- Modify: `src/tests/*.test.js`

- [ ] **Step 1: Rename all utility modules and utility tests to TS**

Run:
```bash
for file in src/utils/*.js; do mv "$file" "${file%.js}.ts"; done
for file in src/tests/*.test.js; do mv "$file" "${file%.js}.ts"; done
```

- [ ] **Step 2: Write failing type signatures for result-heavy utilities**

Add explicit return types before implementation cleanup.

Examples:
```ts
export interface JsonTransformResult {
  output: string
  error: string
}

export interface RegexTestResult {
  error: string
  matches: Array<{ value: string; index: number }>
}

export interface DecodeJwtResult {
  header: Record<string, unknown> | null
  payload: Record<string, unknown> | null
  signature: string
  error: string
  isExpired: boolean
}
```

Run:
```bash
bun run typecheck
```

Expected: FAIL on utilities that still rely on implicit return inference or untyped object literals.

- [ ] **Step 3: Implement typed utility modules one by one**

For each utility file:
- annotate input parameters
- annotate explicit return type
- replace implicit mixed return shapes with stable interfaces
- prefer `unknown` + narrowing where parsing is involved

Example pattern:
```ts
export function formatJson(input: string): JsonTransformResult {
  try {
    return {
      output: JSON.stringify(JSON.parse(input), null, 2),
      error: '',
    }
  } catch (error) {
    return {
      output: '',
      error: getErrorMessage(error),
    }
  }
}
```

- [ ] **Step 4: Update tests to use `.ts` imports and strict assertions**

Example:
```ts
import { formatJson } from '../utils/jsonTools.ts'
```

Keep tests runtime-equivalent; do not rewrite behavior.

- [ ] **Step 5: Run utility tests, then full tests and typecheck**

Run:
```bash
node --test src/tests/*.test.ts
bun run typecheck
```

Expected: PASS.

- [ ] **Step 6: Commit the utility migration**

Run:
```bash
git add src/utils src/tests
```

Commit message:
```bash
git commit -m "refactor(ts): migrate utility modules and tests"
```

---

### Task 4: Migrate Composables and Shared Components

**Files:**
- Modify: `src/composables/useSeoHead.js`
- Modify: `src/composables/useTheme.js`
- Modify: `src/components/Footer.vue`
- Modify: `src/components/Header.vue`
- Modify: `src/components/ToolLayout.vue`
- Modify: `src/App.vue`

- [ ] **Step 1: Rename composables to TS and add explicit return signatures**

Rename:
```bash
mv src/composables/useSeoHead.js src/composables/useSeoHead.ts
mv src/composables/useTheme.js src/composables/useTheme.ts
```

Target signatures:
```ts
export function useSeoHead(meta: RouteMetaDefinition): void

export function useTheme(): {
  isDark: Ref<boolean>
  toggleTheme: () => void
}
```

- [ ] **Step 2: Convert shared Vue components to `<script setup lang="ts">`**

Update:
- `src/components/Header.vue`
- `src/components/Footer.vue`
- `src/components/ToolLayout.vue`
- `src/App.vue`

For `ToolLayout`, define typed props explicitly:
```ts
interface ToolFaqItem {
  question: string
  answer: string
}

interface ToolLayoutProps {
  title: string
  description: string
  usageSteps: string[]
  faqs: ToolFaqItem[]
}
```

- [ ] **Step 3: Run typecheck to verify component/composable contracts fail and then pass**

Run before completing all prop/event typing:
```bash
bun run typecheck
```

Expected: FAIL on missing prop annotations or inferred `any` in event callbacks.

Then complete the typings and rerun until PASS.

- [ ] **Step 4: Verify shared shell still builds**

Run:
```bash
bun run build
```

Expected: PASS and homepage still renders through `vite-ssg`.

- [ ] **Step 5: Commit the shared typed layer**

Run:
```bash
git add src/composables src/components src/App.vue
```

Commit message:
```bash
git commit -m "refactor(ts): type shared composables and components"
```

---

### Task 5: Migrate All Tool Views to Typed Vue Scripts

**Files:**
- Modify: `src/views/Base64Tool.vue`
- Modify: `src/views/ColorConverter.vue`
- Modify: `src/views/CronGenerator.vue`
- Modify: `src/views/DiffChecker.vue`
- Modify: `src/views/HashGenerator.vue`
- Modify: `src/views/HtmlEntityEncoder.vue`
- Modify: `src/views/Home.vue`
- Modify: `src/views/JWTDecoder.vue`
- Modify: `src/views/JsonFormatter.vue`
- Modify: `src/views/MarkdownPreview.vue`
- Modify: `src/views/QrCodeGenerator.vue`
- Modify: `src/views/RegexTester.vue`
- Modify: `src/views/TimestampConverter.vue`
- Modify: `src/views/UUIDGenerator.vue`
- Modify: `src/views/UrlEncoder.vue`
- Modify: `src/views/YamlJsonConverter.vue`

- [ ] **Step 1: Convert every view to `<script setup lang="ts">`**

Update each file header:
```vue
<script setup lang="ts">
```

- [ ] **Step 2: Add explicit view-state typing instead of relying on inference**

Use typed refs like:
```ts
const input = ref<string>('')
const output = ref<string>('')
const error = ref<string>('')
```

For complex state use interfaces:
```ts
interface DiffSummary {
  additions: number
  removals: number
  unchanged: number
}
```

- [ ] **Step 3: Type event handlers and browser APIs carefully**

Examples to apply where relevant:
```ts
function handleToolJump(option: { value?: string } | undefined): void {
  if (option?.value) {
    router.push(option.value)
  }
}
```

```ts
async function copyOutput(): Promise<void> {
  await navigator.clipboard.writeText(output.value)
}
```

```ts
function downloadQr(): void {
  const link = document.createElement('a')
  link.href = dataUrl.value
  link.download = 'qr-code.png'
  link.click()
}
```

- [ ] **Step 4: Run typecheck and fix every view-level error without changing behavior**

Run:
```bash
bun run typecheck
```

Expected: FAIL initially, then PASS after all views are migrated.

- [ ] **Step 5: Run full regression verification**

Run:
```bash
bun run test
bun run build
bun run typecheck
```

Expected: all three commands PASS.

- [ ] **Step 6: Commit the view migration**

Run:
```bash
git add src/views
```

Commit message:
```bash
git commit -m "refactor(ts): migrate tool views to typed scripts"
```

---

### Task 6: Complete Tightening Step 1

**Files:**
- Modify: `tsconfig.json`
- Modify: any migrated TS or Vue files that fail under the first tightened rule set

- [ ] **Step 1: Turn on the first strictness wave**

Update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "strictNullChecks": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "useUnknownInCatchVariables": true,
    "noUncheckedIndexedAccess": true
  }
}
```

- [ ] **Step 2: Run typecheck and capture the failing categories**

Run:
```bash
bun run typecheck
```

Expected: FAIL with a finite list of nullability, catch-variable, and implicit-any issues.

- [ ] **Step 3: Fix nullability and unknown-error handling without loosening types**

Preferred patterns:
```ts
function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}
```

```ts
const tool = toolDefinitions.find((item) => item.path === route.path)
if (!tool) {
  return
}
```

Avoid:
```ts
const error = e as any
```

- [ ] **Step 4: Rerun the full verification suite**

Run:
```bash
bun run typecheck
bun run test
bun run build
```

Expected: PASS.

- [ ] **Step 5: Commit tightening step 1**

Run:
```bash
git add tsconfig.json src
```

Commit message:
```bash
git commit -m "refactor(ts): enable first strictness pass"
```

---

### Task 7: Prepare the Next Strictness Pass Without Enabling It Yet

**Files:**
- Modify: `docs/superpowers/specs/2026-03-23-typescript-migration-design.md`
- Modify: `README.md` if developer commands are documented there

- [ ] **Step 1: Document the new TS workflow for future work**

Add or update developer documentation with:
```md
- `bun run typecheck` for Vue + TS checking
- Source code now uses `.ts` and `<script setup lang="ts">`
- Final `strict: true` cleanup is intentionally deferred to a later pass
```

- [ ] **Step 2: Record remaining strictness follow-up items**

Capture known follow-ups for the second tightening pass, such as:
- optional property exactness cleanup
- exhaustive branch handling
- removal of temporary type assertions

- [ ] **Step 3: Run the final verification suite**

Run:
```bash
bun run typecheck
bun run test
bun run build
```

Expected: PASS.

- [ ] **Step 4: Commit the migration documentation update**

Run:
```bash
git add docs/superpowers/specs/2026-03-23-typescript-migration-design.md README.md
```

Commit message:
```bash
docs(ts): document migration state and next tightening pass
```
