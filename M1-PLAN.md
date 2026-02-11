# M1 实施计划

> 本文档为 M1 里程碑的详细执行计划，基于 PRD v0.1-final。

## 1. 任务总览

| 编号 | 任务 | 依赖 | 预估复杂度 |
|------|------|------|------------|
| M1.0 | 验证 codex 非交互参数 | 无 | 低 |
| M1.1 | 路由解析 | 无 | 低 |
| M1.2 | Agent 可用性检查 | 无 | 低 |
| M1.3 | 非交互调用 + 流式输出 | M1.0, M1.2 | 中 |
| M1.4 | 内存上下文 | 无 | 低 |
| M1.5 | 基础 CLI 循环 | M1.1, M1.3, M1.4 | 中 |

## 2. 依赖关系图

```
M1.0 ─────────────┐
                  ├──→ M1.3 ──┐
M1.2 ─────────────┘           │
                              ├──→ M1.5 (最终集成)
M1.1 ─────────────────────────┤
                              │
M1.4 ─────────────────────────┘
```

**关键路径**：M1.0 → M1.3 → M1.5

## 3. 任务详细拆解

### M1.0 验证 codex 非交互参数

**目标**：确认 `codex exec` 或等价参数可用。

**步骤**：
1. 本地安装 codex CLI（`npm install -g @openai/codex`）
2. 运行 `codex --help` 查看可用参数
3. 测试非交互模式：`codex exec "echo hello"`
4. 若参数不存在，查找等价参数并更新 PRD

**DoD（完成定义）**：
- [ ] 确认可用的非交互参数
- [ ] 更新 PRD 中的 `agents.codex.args` 配置（如需要）
- [ ] 若参数变更，同步更新 `PRD.md` 和 `config.example.yaml`，并在文档版本中记录
- [ ] 记录验证结果到本文档

**验收产物**：
- 验证命令的终端输出截图或日志
- 更新后的 PRD（如有变更）

**验证结果**：（待填写）

---

### M1.1 路由解析

**目标**：实现 `#agent` 语法解析，符合 PRD 7 条硬规则。

**步骤**：
1. 创建 `internal/router/parser.go`
2. 实现 `Parse(input string) *ParsedInput` 函数
3. 编写单元测试覆盖所有规则

**DoD**：
- [ ] 解析器实现完成
- [ ] 单元测试通过（覆盖 7 条硬规则）
- [ ] 代码审查通过

**验收产物**：
- `internal/router/parser.go` 源码
- `internal/router/parser_test.go` 测试文件
- 单元测试通过截图（`go test -v`）

**接口定义**：
```go
type ParsedInput struct {
    Agent   string // "codex" | "claude" | ""
    Content string // 实际内容（不含 #agent 前缀）
}

func Parse(input string) *ParsedInput
```

---

### M1.2 Agent 可用性检查

**目标**：启动时检测 codex/claude CLI 是否可用。

**步骤**：
1. 创建 `internal/adapter/adapter.go`（接口定义）
2. 创建 `internal/adapter/codex.go` 和 `internal/adapter/claude.go`
3. 实现 `IsAvailable()` 方法（调用 `--version` 或 `--help`）
4. 实现降级逻辑

**DoD**：
- [ ] 两个 adapter 实现完成
- [ ] 可用性检查逻辑完成
- [ ] 降级策略实现（单 agent 可用时自动设为默认）

**验收产物**：
- `internal/adapter/*.go` 源码
- 可用性检查日志输出（两个 agent 都存在/缺一/都缺失）

**接口定义**：
```go
type Adapter interface {
    Name() string
    IsAvailable(ctx context.Context) bool
    Run(ctx context.Context, input string, stdout, stderr io.Writer) error
}
```

---

### M1.3 非交互调用 + 流式输出

**目标**：调用底层 CLI 并实时转发输出。

**步骤**：
1. 在 adapter 中实现 `Run()` 方法
2. 使用 `os/exec` 启动子进程
3. 实时读取 stdout/stderr 并转发到 UI
4. 实现 5 分钟超时机制
5. 实现降级策略：若流式转发失败（如管道断开），降级为批量输出

**降级触发条件**：
- 流式读取出现 IO 错误时，切换为等待进程结束后一次性输出
- 降级时在 UI 显示提示信息

**DoD**：
- [ ] codex adapter `Run()` 实现
- [ ] claude adapter `Run()` 实现
- [ ] 流式输出转发正常
- [ ] 超时机制生效
- [ ] 降级策略可触发并正常工作

**验收产物**：
- adapter 源码
- 流式输出演示截图
- 超时触发日志
- 降级场景测试日志（可选，难以复现时跳过）

**关键代码**：
```go
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
defer cancel()

cmd := exec.CommandContext(ctx, binPath, args...)
cmd.Stdout = io.MultiWriter(ui.Stdout(), &outputBuffer)
cmd.Stderr = io.MultiWriter(ui.Stderr(), &errorBuffer)
```

---

### M1.4 内存上下文

**目标**：维护最近 N 轮对话历史，支持跨 agent 共享。

**步骤**：
1. 创建 `internal/context/context.go`
2. 实现 `Context` 结构体和 `Add()`、`Summary()` 方法
3. 实现最近 N 轮截取逻辑

**DoD**：
- [ ] Context 结构体实现
- [ ] Add/Summary 方法实现
- [ ] 单元测试通过

**验收产物**：
- `internal/context/context.go` 源码
- `internal/context/context_test.go` 测试文件
- 单元测试通过截图

**接口定义**：
```go
type Entry struct {
    Agent  string
    Input  string
    Output string
    Time   time.Time
}

type Context struct {
    Entries []Entry
}

func (c *Context) Add(agent, input, output string)
func (c *Context) Summary(maxEntries, maxOutputLen int) string
```

---

### M1.5 基础 CLI 循环

**目标**：实现主循环，串联所有组件。

**步骤**：
1. 创建 `cmd/codez/main.go`
2. 创建 `internal/app/app.go`（应用主逻辑）
3. 实现 readline 风格输入
4. 集成 router、adapter、context
5. 实现 `codez>` 提示符和输出格式

**DoD**：
- [ ] 主程序入口完成
- [ ] CLI 循环正常运行
- [ ] 能够切换 `#codex` / `#claude`
- [ ] 上下文在 agent 间共享
- [ ] 通过 PRD 验收示例

**验收产物**：
- `cmd/codez/main.go` 和 `internal/app/app.go` 源码
- PRD 验收示例完整执行录屏或截图
- TEST-PLAN 中 TP-M1-001~TP-M1-017 通过记录

**验收示例**：
```bash
$ codez
codez> #codex 写一个 hello world
[codex] ... 输出 ...
codez> #claude 检查上面的代码
[claude] ... 输出（能看到 codex 的历史上下文）...
codez> 继续优化  # 走默认 agent
```

## 4. CLI 解析约束摘录

> 以下规则摘自 PRD v0.1-final 第 3.1 节，作为 M1.1 实现依据。

### `#agent` 路由规则（7 条）

1. 仅解析输入的**第一行首 token**
2. 仅识别白名单：`#codex`、`#claude`
3. 必须是完整 token（后跟空白或行尾），如 `#codex123` 不匹配
4. 未识别的 `#xxx` 一律透传给默认 agent
5. 支持字面转义：`\#codex ...` 视为普通文本，不路由
6. `#agent` 标签不透传给底层 CLI
7. 无 `#` 前缀时，走 `default_agent`

### M1 `/` 输入规则

- M1 不实现任何 `/` 命令
- M1 中以 `/` 开头的输入一律按普通文本透传给默认 agent

## 5. 执行顺序建议

```
Phase 1（可并行）:
├── M1.0 验证 codex 参数
├── M1.1 路由解析
├── M1.2 Agent 可用性检查
└── M1.4 内存上下文

Phase 2（依赖 Phase 1）:
└── M1.3 非交互调用 + 流式输出

Phase 3（最终集成）:
└── M1.5 基础 CLI 循环
```

## 6. 风险与缓解

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| codex 非交互参数不可用 | 阻塞 M1.3 | M1.0 优先验证，找等价参数 |
| 流式输出不稳定 | 用户体验差 | 增加缓冲，降级为批量输出 |
| CLI 卡住不响应 | 用户无法继续 | 5 分钟超时 + 提示用户 |

## 7. 文档版本

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0-draft | 2026-02-11 | Claude 初稿，待 Codex 审查 |
| v1.1-draft | 2026-02-11 | 根据 Codex R1 审查修订：增加验收产物、降级条件、PRD 同步闭环 |

---

**状态**：修订完成，等待 Codex R2 复审。
