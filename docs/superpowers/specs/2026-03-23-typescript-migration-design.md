# FinchDev TypeScript Migration Design

**Date:** 2026-03-23

**Goal**

将当前 FinchDev 从纯 JavaScript 工程迁移为 TypeScript 工程，先完成“可运行、可构建、可测试”的类型化迁移，再分两步逐渐收紧类型规则，最终达到严格类型约束。

**Non-Goals**

- 不新增功能
- 不修改现有产品行为、路由、SEO 或工具输出逻辑
- 不顺手做 UI 重构或组件重写
- 不在本次迁移中直接完成最终 strict 清零

## Current State

当前项目使用 Vue 3、Vite、vite-ssg、TDesign，工程源码和构建配置仍以 `.js` 为主：

- `src/utils/*.js` 为纯函数工具层
- `src/build/*.js` 为构建辅助逻辑
- `src/data/tools.js` 保存工具与路由元数据
- `src/router/*.js` 管理首页与工具页路由
- `src/composables/*.js` 为共享组合式逻辑
- `src/main.js`、`vite.config.js` 为入口与构建配置
- `src/tests/*.test.js` 为 `node:test` 测试
- `src/views/*.vue` 和 `src/components/*.vue` 仍为未显式类型化的 `script setup`

当前项目还没有：

- `tsconfig.json`
- `env.d.ts`
- `typecheck` 脚本
- `vue-tsc` 类型校验流程

## Migration Strategy

本次迁移采用“先迁移文件，再逐步收紧规则”的三阶段策略。

### Phase 1: TypeScript Foundation

先建立 TypeScript 工程基础设施，使项目具备编译、识别和校验 TS 的能力。

包含内容：

- 新增 `typescript`
- 新增 `vue-tsc`
- 新增 `tsconfig.json`
- 新增 `env.d.ts`
- 将 `vite.config.js` 迁移为 `vite.config.ts`
- 将 `src/main.js` 迁移为 `src/main.ts`
- 新增 `typecheck` 脚本

这一阶段的目标是工程层面准备完毕，而不是一次性消灭所有隐式类型问题。

### Phase 2: Source Migration

按依赖层次分批迁移源码，优先迁移低耦合、易建模的模块，再迁移视图层。

迁移顺序：

1. `src/utils/*.js` -> `*.ts`
2. `src/build/*.js` -> `*.ts`
3. `src/data/tools.js` -> `tools.ts`
4. `src/router/*.js` -> `*.ts`
5. `src/composables/*.js` -> `*.ts`
6. `src/tests/*.test.js` -> `*.test.ts`
7. `src/components/*.vue` 与 `src/views/*.vue` 切换到 `<script setup lang="ts">`

这种顺序可以先稳定底层类型模型，减少视图层迁移时的重复定义和断言。

### Phase 3: Rules Tightening in Two Steps

迁移完成后，不直接一步开启最严规则，而是分两次收紧。

#### Tightening Step 1

目标是先消灭最危险的宽松点：

- `noImplicitAny: true`
- `noImplicitThis: true`
- `strictNullChecks: true`
- `useUnknownInCatchVariables: true`
- `noUncheckedIndexedAccess: true`

这一轮重点清理：

- 隐式 `any`
- 未收窄的空值分支
- 宽松索引访问
- `catch (error)` 的未知类型处理

#### Tightening Step 2

目标是进入严格类型阶段：

- `strict: true`
- `exactOptionalPropertyTypes: true`
- `noFallthroughCasesInSwitch: true`

这一轮重点清理：

- 宽松可选字段
- 不完整的分支处理
- 多余或不安全的类型断言

## Type Boundaries

为避免 TypeScript 只停留在“改后缀”层面，本次迁移需要显式建立以下类型边界。

### Tool Metadata Types

为工具注册表和路由元数据建立统一结构：

- `ToolDefinition`
- `RouteMetaDefinition`
- `ToolRouteModule`

这些类型将用于：

- `src/data/tools.ts`
- `src/router/index.ts`
- `src/router/routeModules.ts`
- 首页工具列表渲染
- SEO head 逻辑

### Utility Result Types

为工具函数输出建立返回类型，避免页面层依赖松散对象结构。

优先建立的类型包括：

- JSON 格式化结果类型
- JWT 解码结果类型
- 颜色转换结果类型
- Diff 行结构类型
- QR 生成选项类型
- 时间戳转换结果类型

### View State Types

对页面中的状态值、错误值和交互值建立更清晰的类型约束。

建议遵循以下原则：

- `ref<string>('')`、`ref<boolean>(false)` 等显式泛型优先
- 表单状态对象有明确接口，而不是匿名对象无限扩展
- 错误状态优先用 `string` 或 `null`
- 若有多态状态，统一为有限联合类型，例如：
  - `'idle' | 'success' | 'error'`

### Shared Component Types

为共享组件和组合式逻辑建立更明确的输入边界：

- `ToolLayout` 的 props 类型
- `useSeoHead` 的参数类型
- `useTheme` 的返回值类型

## Configuration Strategy

初始 TypeScript 配置以“迁移可运行”为优先，避免一开始因严格规则阻塞全量迁移。

### Initial TS Config

初始建议：

- `allowJs: false`
- `checkJs: false`
- `noEmit: true`
- `isolatedModules: true`
- `moduleResolution: 'bundler'`
- `strict: false`
- 保持 Vue + Vite 所需的标准配置

目标是尽快把项目切到 TS 工程，再用后续两轮 tightening 逐步提升质量。

## File Plan

### Files to Add

- `tsconfig.json`
- `env.d.ts`
- 必要时新增 `src/types/*.ts`

### Files to Rename or Migrate

- `vite.config.js` -> `vite.config.ts`
- `src/main.js` -> `src/main.ts`
- `src/utils/*.js` -> `*.ts`
- `src/build/*.js` -> `*.ts`
- `src/data/tools.js` -> `tools.ts`
- `src/router/*.js` -> `*.ts`
- `src/composables/*.js` -> `*.ts`
- `src/tests/*.test.js` -> `*.test.ts`

### Files to Update In-Place

- `src/views/*.vue`
- `src/components/*.vue`
- `package.json`
- `bun.lock`

## Verification Strategy

每一批迁移都必须执行同一组验证命令：

1. `bun run test`
2. `bun run build`
3. `bun run typecheck`

最终验收标准：

- 关键源码路径中不再保留 `.js` 源文件
- 项目可正常构建与 SSG 渲染
- 测试保持通过
- 第一阶段迁移完成后无阻塞性类型错误
- 两轮 tightening 各自收口时通过对应 `typecheck`

## Execution Plan Overview

建议将实施拆成三个可独立验证的提交批次：

1. 工程切到 TS
2. 源码与测试迁移到 TS
3. 第一轮类型规则收紧

后续第二轮 strict 清零可以作为下一轮工作单独推进，避免把风险堆到一次提交中。

## Risks and Mitigations

### Risk: Vue 页面迁移时类型噪音过大

缓解：

- 先建立底层共享类型
- 视图层最后迁移
- 优先显式标注 `ref`、事件参数、返回类型

### Risk: 第三方库类型定义不完整

缓解：

- 优先依赖库自带类型
- 若必要，添加本地声明文件或小范围包装类型
- 不用 `any` 粗暴跳过，优先 `unknown` + 收窄

### Risk: 一次性开启 strict 导致迁移停滞

缓解：

- 按设计分两步 tightening
- 每轮只解决对应层级的问题

## Recommendation

按以下顺序执行：

1. 先完成 TypeScript 工程迁移
2. 稳定测试、构建、类型检查
3. 完成第一轮规则收紧
4. 单独继续第二轮 strict 清零

这样可以以最小风险完成从 JS 到 TS 的工程升级，并为后续严格类型治理打好基础。
