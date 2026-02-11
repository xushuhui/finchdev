# Codez - Multi-Agent CLI 设计文档

## 1. 项目概述

### 1.1 目标

构建一个 Go 语言的 CLI **编排层**，通过 `#agent` 语法路由用户输入到不同的 AI Agent CLI（Claude Code、OpenAI Codex），复用它们的现有能力，并在 agent 之间共享对话上下文。

### 1.2 核心特性

- **编排层架构**: 不重复造轮子，复用 Claude Code 和 Codex CLI 的能力
- **多 Agent 路由**: 通过 `#claude`、`#codex` 语法切换不同 AI
- **对话上下文共享**: 所有 Agent 共享对话历史，可以互相看到之前的输出
- **统一界面**: 一个入口，多个 AI 能力

### 1.3 架构图

```
┌─────────────────────────────────────────┐
│              codez (编排层)              │
│  - 解析 #agent 语法                      │
│  - 路由用户输入到对应 CLI                 │
│  - 捕获输出，维护共享上下文                │
└───────────────┬─────────────────────────┘
                │
        ┌───────┴───────┐
        ▼               ▼
┌──────────────┐  ┌──────────────┐
│ claude-code  │  │   codex      │
│    CLI       │  │    CLI       │
│ (Anthropic)  │  │  (OpenAI)    │
└──────────────┘  └──────────────┘
```

### 1.4 使用示例

```
$ codez

codez> #codex 写一个 Go 的 HTTP 服务器

[codex] 我来帮你写一个简单的 HTTP 服务器...
✅ 文件已创建: main.go

codez> #claude 检查一下这个代码有没有安全问题

[claude] 让我检查一下 main.go...

我发现了几个潜在问题:
1. 没有设置超时...
2. 没有限制请求体大小...
我来帮你修复...
✅ 文件已更新: main.go
```

---

## 2. 技术选型

| 组件     | 选择                                                                     | 理由                        |
| -------- | ------------------------------------------------------------------------ | --------------------------- |
| 语言     | Go 1.21+                                                                 | 高性能、单二进制部署        |
| CLI 框架 | [bubbletea](https://github.com/charmbracelet/bubbletea)                  | TUI 框架，支持丰富交互      |
| 样式渲染 | [lipgloss](https://github.com/charmbracelet/lipgloss)                    | 终端样式库                  |
| 进程管理 | 标准库 `os/exec`                                                         | 调用子进程 CLI              |
| PTY      | [creack/pty](https://github.com/creack/pty)                              | 伪终端，捕获交互式 CLI 输出 |
| 配置管理 | [viper](https://github.com/spf13/viper)                                  | 支持多种配置格式            |
| 历史存储 | SQLite (via [modernc.org/sqlite](https://pkg.go.dev/modernc.org/sqlite)) | 纯 Go，无 CGO               |

### 2.1 底层 CLI 依赖

| Agent  | CLI 工具                   | 安装方式                                   |
| ------ | -------------------------- | ------------------------------------------ |
| Claude | `claude` (Claude Code)     | `npm install -g @anthropic-ai/claude-code` |
| Codex  | `codex` (OpenAI Codex CLI) | `npm install -g @openai/codex`             |

---

## 3. 项目结构

```
codez/
├── cmd/
│   └── codez/
│       └── main.go                 # 程序入口
├── internal/
│   ├── agent/                      # Agent 管理
│   │   ├── agent.go                # Agent 接口
│   │   ├── claude.go               # Claude Code CLI 封装
│   │   ├── codex.go                # Codex CLI 封装
│   │   └── registry.go             # Agent 注册表
│   ├── router/                     # 路由层
│   │   ├── parser.go               # 解析 #agent 语法
│   │   └── router.go               # 路由逻辑
│   ├── context/                    # 上下文管理
│   │   ├── context.go              # 共享上下文
│   │   └── history.go              # 对话历史 (SQLite)
│   ├── tui/                        # 界面层
│   │   ├── app.go                  # TUI 主应用
│   │   ├── model.go                # bubbletea Model
│   │   └── styles.go               # 样式定义
│   └── config/                     # 配置层
│       └── config.go               # 配置管理
├── config.example.yaml             # 配置文件示例
├── go.mod
├── go.sum
├── Makefile
└── DESIGN.md                       # 本文档
```

---

## 4. 核心接口设计

### 4.1 Agent 接口 (internal/agent/agent.go)

```go
package agent

import (
    "context"
    "io"
)

// Agent 封装底层 CLI 工具
type Agent interface {
    // Name 返回 agent 名称 (用于 #agent 路由)
    Name() string

    // Description 返回 agent 描述
    Description() string

    // Available 检查 CLI 工具是否已安装
    Available() bool

    // Run 执行命令
    // workDir: 工作目录
    // contextInfo: 之前对话的摘要 (用于上下文共享)
    // input: 用户输入 (不含 #agent 前缀)
    // stdout/stderr: 输出流 (用于实时显示)
    Run(ctx context.Context, workDir, contextInfo, input string, stdout, stderr io.Writer) error
}
```

### 4.2 Claude Agent 实现 (internal/agent/claude.go)

```go
package agent

import (
    "context"
    "fmt"
    "io"
    "os"
    "os/exec"
)

type ClaudeAgent struct {
    binPath string
}

func NewClaudeAgent() *ClaudeAgent {
    path, _ := exec.LookPath("claude")
    return &ClaudeAgent{binPath: path}
}

func (c *ClaudeAgent) Name() string        { return "claude" }
func (c *ClaudeAgent) Description() string { return "Claude Code (Anthropic)" }
func (c *ClaudeAgent) Available() bool     { return c.binPath != "" }

func (c *ClaudeAgent) Run(ctx context.Context, workDir, contextInfo, input string, stdout, stderr io.Writer) error {
    // 构建 prompt，注入上下文
    prompt := input
    if contextInfo != "" {
        prompt = fmt.Sprintf("之前的对话上下文:\n%s\n\n当前请求: %s", contextInfo, input)
    }

    // 调用 claude CLI (非交互模式)
    // claude --print (-p): 直接输出，不进入交互模式
    cmd := exec.CommandContext(ctx, c.binPath, "--print", prompt)
    cmd.Dir = workDir
    cmd.Stdout = stdout
    cmd.Stderr = stderr
    cmd.Env = os.Environ()

    return cmd.Run()
}
```

### 4.3 Codex Agent 实现 (internal/agent/codex.go)

```go
package agent

import (
    "context"
    "fmt"
    "io"
    "os"
    "os/exec"
)

type CodexAgent struct {
    binPath string
}

func NewCodexAgent() *CodexAgent {
    path, _ := exec.LookPath("codex")
    return &CodexAgent{binPath: path}
}

func (c *CodexAgent) Name() string        { return "codex" }
func (c *CodexAgent) Description() string { return "Codex CLI (OpenAI)" }
func (c *CodexAgent) Available() bool     { return c.binPath != "" }

func (c *CodexAgent) Run(ctx context.Context, workDir, contextInfo, input string, stdout, stderr io.Writer) error {
    prompt := input
    if contextInfo != "" {
        prompt = fmt.Sprintf("Previous context:\n%s\n\nCurrent request: %s", contextInfo, input)
    }

    // 调用 codex CLI (具体参数需要根据实际 CLI 调整)
    cmd := exec.CommandContext(ctx, c.binPath, prompt)
    cmd.Dir = workDir
    cmd.Stdout = stdout
    cmd.Stderr = stderr
    cmd.Env = os.Environ()

    return cmd.Run()
}
```

### 4.4 Agent 注册表 (internal/agent/registry.go)

```go
package agent

type Registry struct {
    agents map[string]Agent
}

func NewRegistry() *Registry {
    r := &Registry{agents: make(map[string]Agent)}

    // 注册内置 agent
    r.Register(NewClaudeAgent())
    r.Register(NewCodexAgent())

    return r
}

func (r *Registry) Register(a Agent) {
    r.agents[a.Name()] = a
}

func (r *Registry) Get(name string) (Agent, bool) {
    a, ok := r.agents[name]
    return a, ok
}

func (r *Registry) List() []Agent {
    var list []Agent
    for _, a := range r.agents {
        list = append(list, a)
    }
    return list
}

func (r *Registry) Available() []Agent {
    var list []Agent
    for _, a := range r.agents {
        if a.Available() {
            list = append(list, a)
        }
    }
    return list
}
```

### 4.5 路由解析 (internal/router/parser.go)

```go
package router

import (
    "regexp"
    "strings"
)

// ParsedInput 解析后的用户输入
type ParsedInput struct {
    Agent   string // agent 名称，如 "claude", "codex"
    Content string // 实际内容
}

var agentPattern = regexp.MustCompile(`^#(\w+)\s+(.*)$`)

// Parse 解析用户输入
// 输入: "#claude 检查代码"
// 输出: ParsedInput{Agent: "claude", Content: "检查代码"}
func Parse(input string) *ParsedInput {
    input = strings.TrimSpace(input)

    matches := agentPattern.FindStringSubmatch(input)
    if matches == nil {
        // 没有 #agent 前缀，返回空 agent
        return &ParsedInput{Agent: "", Content: input}
    }

    return &ParsedInput{
        Agent:   strings.ToLower(matches[1]),
        Content: strings.TrimSpace(matches[2]),
    }
}
```

### 4.6 上下文管理 (internal/context/context.go)

```go
package context

import (
    "fmt"
    "strings"
    "time"
)

// Entry 单条对话记录
type Entry struct {
    ID        string
    Agent     string    // 使用的 agent
    Input     string    // 用户输入
    Output    string    // agent 输出
    CreatedAt time.Time
}

// Context 共享上下文
type Context struct {
    SessionID string
    WorkDir   string
    Entries   []Entry
}

// Add 添加一条记录
func (c *Context) Add(agent, input, output string) {
    c.Entries = append(c.Entries, Entry{
        ID:        fmt.Sprintf("%d", len(c.Entries)+1),
        Agent:     agent,
        Input:     input,
        Output:    output,
        CreatedAt: time.Now(),
    })
}

// Summary 生成上下文摘要 (传递给下一个 agent)
// maxEntries: 最多包含多少条历史记录
// maxOutputLen: 每条输出最大长度
func (c *Context) Summary(maxEntries, maxOutputLen int) string {
    if len(c.Entries) == 0 {
        return ""
    }

    var sb strings.Builder

    start := 0
    if len(c.Entries) > maxEntries {
        start = len(c.Entries) - maxEntries
    }

    for _, e := range c.Entries[start:] {
        sb.WriteString(fmt.Sprintf("[%s] User: %s\n", e.Agent, e.Input))

        output := e.Output
        if len(output) > maxOutputLen {
            output = output[:maxOutputLen] + "...(truncated)"
        }
        sb.WriteString(fmt.Sprintf("[%s] Response:\n%s\n\n", e.Agent, output))
    }

    return sb.String()
}
```

---

## 5. 主循环逻辑

```go
package main

func (app *App) Run() error {
    ctx := context.Background()
    sharedCtx := &context.Context{
        SessionID: uuid.New().String(),
        WorkDir:   app.workDir,
    }

    for {
        // 1. 读取用户输入
        input, err := app.ui.ReadInput()
        if err != nil {
            return err
        }

        // 2. 解析 #agent 语法
        parsed := router.Parse(input)

        // 3. 确定使用哪个 agent
        agentName := parsed.Agent
        if agentName == "" {
            agentName = app.config.DefaultAgent
        }

        agent, ok := app.registry.Get(agentName)
        if !ok {
            app.ui.PrintError("未知的 agent: " + agentName)
            continue
        }

        if !agent.Available() {
            app.ui.PrintError(fmt.Sprintf("%s CLI 未安装", agent.Name()))
            continue
        }

        // 4. 获取上下文摘要
        contextInfo := sharedCtx.Summary(5, 1000) // 最近 5 条，每条最多 1000 字符

        // 5. 调用 agent
        app.ui.PrintAgentStart(agent.Name())

        var output strings.Builder
        stdout := io.MultiWriter(app.ui.Stdout(), &output) // 同时输出到 UI 和 buffer

        err = agent.Run(ctx, app.workDir, contextInfo, parsed.Content, stdout, app.ui.Stderr())
        if err != nil {
            app.ui.PrintError(err.Error())
        }

        // 6. 保存到共享上下文
        sharedCtx.Add(agent.Name(), parsed.Content, output.String())

        // 7. 持久化到数据库 (可选)
        app.history.Save(sharedCtx)
    }
}
```

---

## 6. 数据库设计 (简化版)

由于是编排层，数据库只需要存储对话历史用于上下文共享和会话恢复。

### 6.1 Schema

```sql
-- 会话表
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    work_dir TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 对话记录表
CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    agent TEXT NOT NULL,          -- claude, codex
    input TEXT NOT NULL,          -- 用户输入
    output TEXT,                  -- agent 输出
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(id)
);

CREATE INDEX IF NOT EXISTS idx_entries_session ON entries(session_id);
```

---

## 7. TUI 设计

### 7.1 界面布局

```
┌──────────────────────────────────────────────────────┐
│ codez v0.1.0                             [claude|codex]│
├──────────────────────────────────────────────────────┤
│                                                      │
│ codez> #codex 写一个 HTTP 服务器                      │
│                                                      │
│ [codex] 我来帮你写一个简单的 HTTP 服务器...           │
│ ... (codex 的完整输出) ...                           │
│                                                      │
│ codez> #claude 检查一下安全问题                       │
│                                                      │
│ [claude] 让我检查一下...                             │
│ ... (claude 的完整输出) ...                          │
│                                                      │
├──────────────────────────────────────────────────────┤
│ codez> _                                             │
└──────────────────────────────────────────────────────┘
```

### 7.2 颜色方案

```go
var (
    PromptStyle = lipgloss.NewStyle().Foreground(lipgloss.Color("39"))  // 蓝色
    ClaudeStyle = lipgloss.NewStyle().Foreground(lipgloss.Color("208")) // 橙色
    CodexStyle  = lipgloss.NewStyle().Foreground(lipgloss.Color("42"))  // 绿色
    ErrorStyle  = lipgloss.NewStyle().Foreground(lipgloss.Color("196")) // 红色
    DimStyle    = lipgloss.NewStyle().Foreground(lipgloss.Color("240")) // 灰色
)
```

---

## 8. 配置

### 8.1 配置文件 (config.yaml)

```yaml
# 默认 agent (不带 #agent 前缀时使用)
default_agent: claude

# Agent 配置
agents:
  claude:
    bin: claude           # CLI 可执行文件名或路径
    args: ["--print"]     # 额外参数

  codex:
    bin: codex
    args: []

# 上下文配置
context:
  max_entries: 10         # 共享上下文最多包含多少条历史
  max_output_len: 2000    # 每条输出最大字符数

# 历史存储
history:
  path: ~/.codez/history.db
```

### 8.2 配置加载优先级

1. 命令行参数
2. 环境变量 (CODEZ_*)
3. 当前目录 ./codez.yaml
4. 用户目录 ~/.codez/config.yaml
5. 默认值

---

## 9. 错误处理

### 9.1 错误类型

| 错误类型       | 处理策略                      |
| -------------- | ----------------------------- |
| Agent 未安装   | 提示用户安装对应 CLI          |
| Agent 执行失败 | 显示错误，继续等待下一条输入  |
| 解析错误       | 提示语法，继续等待            |
| 配置错误       | 启动时检查，提示修复          |

---

## 10. 待定问题

1. **交互式命令**: 底层 CLI 可能需要用户确认 (Y/n)，如何传递？
   - 方案 A: 使用 PTY 转发所有输入输出
   - 方案 B: 使用 CLI 的非交互模式

2. **流式输出**: 如何实时显示底层 CLI 的输出？
   - 直接连接 stdout/stderr，实时转发

3. **上下文长度**: 上下文太长会影响 agent 性能
   - 限制历史条数和每条长度
   - 考虑使用摘要/压缩

4. **并行调用**: 是否支持同时调用多个 agent？
   - MVP 阶段暂不支持

---

## 11. 里程碑

### v0.1.0 - MVP

- [ ] 项目骨架 (Go mod, 目录结构)
- [ ] Claude Agent 封装
- [ ] Codex Agent 封装
- [ ] #agent 语法解析
- [ ] 基础 TUI (readline 风格)
- [ ] 上下文共享 (内存)

### v0.2.0 - 完善

- [ ] 对话历史持久化 (SQLite)
- [ ] 配置文件支持
- [ ] 会话恢复
- [ ] 更好的 TUI (bubbletea)

### v0.3.0 - 增强

- [ ] 更多 Agent (Gemini, 本地模型)
- [ ] 插件系统
- [ ] PTY 支持 (交互式命令)

---

## 12. 项目规范

### 12.1 Bug 记录规范

**每次发现问题和修复必须记录到 `bug.md`**

记录格式：
```markdown
## BUG-XXX: 简短描述

### 状态
- **优先级**: P1/P2/P3
- **状态**: 🔴 未修复 / ✅ 已修复
- **发现者**: Claude/Codex/手动测试

### 问题描述
[详细描述问题，包含代码片段]

### 修复方案
[修复代码或方案]

### 修复记录
- **修复日期**: YYYY-MM-DD
- **修复文件**: `path/to/file.go`
```

### 12.2 代码审查流程

1. 代码提交后由另一个 Agent 审查
2. 审查发现的问题记录到 `bug.md`
3. 修复后更新 `bug.md` 状态
