# Codez：双 Agent 协作式 CLI 设计（独立方案）

## 1. 背景与目标

你要的不是“再造一个新 AI”，而是做一个**编排器（Orchestrator）**：

- `codex` 负责高效率产出代码（实现导向）
- `claude code` 负责定位问题、解释原因、给出修复策略（调试导向）
- 用户在一个对话窗口内按需切换 agent

核心目标：

1. **复用现有 CLI 能力**，不重做模型层、不重做工具生态。
2. **一条会话流里切换 agent**，上下文可共享。
3. **减少关键词冲突**，避免编排层提示污染底层 agent 的原生行为。

---

## 2. 设计原则

### 2.1 复用优先

- 优先调用本地 `codex` 与 `claude` CLI。
- 不直接对接模型 HTTP API（除非未来作为可选后端）。

### 2.2 最小侵入

- 用户的原始指令尽量“原样”传给目标 agent。
- 编排层不强行改写用户 prompt，不注入大段固定系统词。

### 2.3 协作可控

- 允许显式 handoff（把一个 agent 的输出作为另一个输入）。
- 允许一键“实现→审查→修复”链路。

### 2.4 冲突隔离

- 编排层控制命令与 agent 指令语法分层。
- 编排元数据不进入 agent 可见文本（side-channel 传递）。

---

## 3. 用户体验（UX）

## 3.1 交互语法

在输入框中使用以下语法：

```text
#codex 写一个 Go 的列表接口，带分页
#claude 检查刚才接口的并发和错误处理问题
```

扩展语法（可选）：

```text
#codex->#claude 写并自检一个列表接口
```

说明：

- `#agent` 只在**行首第一个 token**生效，避免误伤自然语言中的 `#`。
- 无前缀时，走当前默认 agent。

### 3.2 会话控制命令

为了避免与 agent 自身 prompt 冲突，编排器命令统一使用 `/` 前缀：

```text
/agent codex          # 切换默认 agent
/mode pair            # 切换协作模式
/handoff last claude  # 把上轮结果交给 claude
/history brief        # 查看摘要历史
/save                 # 保存会话
```

`/` 命令由编排器本地处理，不传给任何 agent。

---

## 4. 核心能力设计

## 4.1 路由器（Router）

职责：

- 解析 `#codex`、`#claude`、`#a->#b`。
- 产出执行计划（Execution Plan）。
- 将用户输入路由到对应 Adapter。

数据结构：

```go
type RoutePlan struct {
    Steps []RouteStep // 例如: codex, claude
    RawInput string
}

type RouteStep struct {
    Agent string // "codex" | "claude"
    Prompt string
    Mode string // direct | review | fix
}
```

## 4.2 Agent 适配层（Adapters）

每个 agent 一个 adapter，只做“协议翻译”，不做智能改写。

```go
type AgentAdapter interface {
    Name() string
    IsAvailable(ctx context.Context) error
    StartSession(ctx context.Context, session SessionMeta) error
    Send(ctx context.Context, in AgentInput) (<-chan AgentEvent, error)
    Stop(ctx context.Context) error
}
```

实现建议：

- `CodexAdapter`: 驱动 `codex` CLI 子进程。
- `ClaudeAdapter`: 驱动 `claude` CLI 子进程。
- 使用 PTY 读取流式输出，保留原始体验。

## 4.3 会话总线（Conversation Bus）

统一记录所有事件：

- 用户输入
- 各 agent 输出
- handoff 事件
- 失败与重试

```go
type Event struct {
    ID string
    SessionID string
    Type string // user|assistant|handoff|error|system
    Agent string
    Content string
    CreatedAt time.Time
}
```

---

## 5. 双 Agent 协作模式

## 5.1 模式一：Direct（直连）

- 用户指定哪个 agent，就只调用哪个。
- 适合明确单任务。

## 5.2 模式二：Pair（实现 + 审查）

默认流程：

1. `codex` 先产出实现
2. `claude` 基于实现做审查/调试建议
3. 用户可决定是否回交给 `codex` 自动修复

## 5.3 模式三：Debug（问题优先）

默认流程：

1. `claude` 先定位问题，给出最小修复清单
2. `codex` 执行补丁
3. `claude` 复检

---

## 6. 上下文共享策略

目标：既共享信息，又避免 token 爆炸。

### 6.1 三层上下文

1. **Recent Window**：最近 N 轮原文（高保真）
2. **Working Summary**：滚动摘要（跨 agent）
3. **Artifacts**：结构化产物（文件列表、错误堆栈、测试结果）

### 6.2 Handoff 包装

agent 间传递时不直接粘贴全部对话，使用结构化 handoff：

```text
任务目标:
当前状态:
关键文件:
失败现象:
期望下一步:
```

这能显著减少噪声，提升调试与修复成功率。

---

## 7. 关键词冲突规避（重点）

你提到“尽可能不和两者关键词冲突”，这里给出明确策略：

1. **路由关键词只在编排层解释**：`#codex`、`#claude` 不透传给 agent。
2. **控制命令统一 `/` 前缀**：如 `/mode`、`/handoff`，避免污染用户任务语义。
3. **元数据 side-channel 传输**：会话 ID、模式、步骤编号等不拼进 prompt 文本。
4. **禁止模板化强提示词**：不在每轮附加“你是xxx专家”这类固定词。
5. **最小包装**：只在必须时附加简短上下文摘要，不注入平台术语。

---

## 8. 容错与降级

## 8.1 可用性检查

启动时检查：

- `codex --help` 可执行
- `claude --help` 可执行

不可用时给出可操作提示（安装命令、PATH 建议）。

## 8.2 失败重试

- 子进程异常退出：可重启一次并恢复到上一个稳定 turn。
- 流输出中断：标记本轮失败，允许 `/retry` 重试。

## 8.3 单 agent 降级

若某 agent 不可用，系统仍可用另一个 agent 继续工作，不阻塞全局会话。

---

## 9. 安全与边界

因为底层 CLI 本身可能具备执行/改文件能力，编排层需要补一层“最小安全闸”：

1. 显示当前工作目录与可写范围。
2. 高风险动作二次确认（删除、批量覆盖、危险命令）。
3. 会话级审计日志（谁在何时触发了什么操作）。
4. 默认不跨项目目录执行。

---

## 10. 配置设计

```yaml
default_agent: codex
mode: direct   # direct | pair | debug

agents:
  codex:
    bin: codex
    args: []
    enabled: true
  claude:
    bin: claude
    args: []
    enabled: true

context:
  recent_turns: 12
  summary_max_chars: 4000

session:
  store: ~/.codez/sessions
  autosave: true
```

---

## 11. 目录结构（建议）

```text
codez/
  cmd/codez/main.go
  internal/app/          # 启动与生命周期
  internal/router/       # #agent 与 /cmd 解析
  internal/adapter/      # codex/claude 适配器
  internal/session/      # 会话与上下文
  internal/handoff/      # agent 间摘要与交接
  internal/ui/           # 交互层（先 CLI，后 TUI）
  internal/safety/       # 风险动作拦截
  docs/codex.md
```

---

## 12. MVP 范围（建议 2 周）

### M1：最小可用

- 单窗口会话
- `#codex` / `#claude` 路由
- 共享最近上下文
- 子进程流式输出

### M2：协作增强

- `#codex->#claude` 串行
- `/handoff` 与 `/retry`
- 简单摘要

### M3：稳定性

- 自动恢复会话
- 可用性检查与降级
- 操作审计日志

---

## 13. 验收标准

1. 用户可在同一会话中稳定切换 `codex` 和 `claude`。
2. `pair/debug` 模式下至少能完成一次“实现→审查→修复”闭环。
3. 不需要重造模型 API，即可复用两端 CLI 核心能力。
4. 编排指令不会污染普通用户 prompt，关键词冲突可控。

---

## 14. 后续扩展

- 增加第三个 agent（如测试专用 agent）
- 增加“任务卡片”视图（显示每轮目标、状态、owner agent）
- 增加 Git 工作流钩子（生成补丁、回滚点、变更摘要）

---

## 15. 一句话总结

这个项目的本质是：**让 `codex` 负责“快写”，让 `claude` 负责“深查”，通过一个最小侵入的编排层把两者串成可重复的工程协作流。**
