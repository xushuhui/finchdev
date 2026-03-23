# Homepage Performance Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce homepage initial bundle cost by lazy-loading tool pages and splitting heavy vendor code into stable chunks.

**Architecture:** Keep the homepage and shared shell in the entry path, but move every tool page behind route-level dynamic imports. Extract build chunking rules into a plain JavaScript helper so they can be unit-tested and reused by Vite config, then switch TDesign to component auto-import registration instead of global plugin installation.

**Tech Stack:** Vue 3, Vite, vite-ssg, tdesign-vue-next, node:test

---

### Task 1: Add verifiable build strategy helpers

**Files:**
- Create: `src/build/chunking.js`
- Test: `src/tests/chunking.test.js`

- [ ] Step 1: write failing tests for manual chunk classification
- [ ] Step 2: run the focused test and confirm it fails
- [ ] Step 3: implement the minimal chunk helper
- [ ] Step 4: rerun the focused test and confirm it passes

### Task 2: Make route loading homepage-first

**Files:**
- Create: `src/router/routeModules.js`
- Test: `src/tests/routeModules.test.js`
- Modify: `src/router/index.js`

- [ ] Step 1: write failing tests for homepage sync load and tool-page async loaders
- [ ] Step 2: run the focused test and confirm it fails
- [ ] Step 3: implement route module metadata and wire router to it
- [ ] Step 4: rerun the focused test and confirm it passes

### Task 3: Apply build optimization in app entry

**Files:**
- Modify: `vite.config.js`
- Modify: `src/main.js`

- [ ] Step 1: wire auto-import plugin and manual chunk helper into Vite config
- [ ] Step 2: remove full TDesign plugin registration from app entry
- [ ] Step 3: run full tests and build, then compare output bundle structure
