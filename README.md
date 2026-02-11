# Codez

Multi-Agent CLI 编排层，通过 `#agent` 语法路由用户输入到不同的 AI Agent CLI（Claude Code、OpenAI Codex），在 agent 之间共享对话上下文。

## 核心理念

让 `codex` 负责"快写"，让 `claude` 负责"深查"，通过一个最小侵入的编排层把两者串成可重复的工程协作流。

```
#codex 实现 → #claude 检查 → #codex 修复
```

## 架构

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

## 安装

### 前置依赖

安装底层 Agent CLI：

```bash
# Claude Code (Anthropic)
npm install -g @anthropic-ai/claude-code

# Codex CLI (OpenAI)
npm install -g @openai/codex
```

### 构建 codez

```bash
git clone https://github.com/yourname/codez.git
cd codez
go build -o codez ./cmd/codez
```

## 使用

```bash
./codez
```

### 基础示例

```
codez> #codex 写一个 Go 的 HTTP 服务器

[codex] 我来帮你写一个简单的 HTTP 服务器...

codez> #claude 检查一下这个代码有没有安全问题

[claude] 让我检查一下...
我发现了几个潜在问题:
1. 没有设置超时...
2. 没有限制请求体大小...

codez> #codex 按照上面的建议修复

[codex] 好的，我来修复这些问题...
```

## 路由语法

### `#agent` 路由

| 语法 | 说明 |
|------|------|
| `#codex <内容>` | 路由到 Codex CLI |
| `#claude <内容>` | 路由到 Claude Code CLI |
| `<内容>` | 路由到默认 agent（codex） |

### 规则

1. 仅解析输入的**第一行首 token**
2. 仅识别白名单：`#codex`、`#claude`
3. 必须是完整 token（后跟空白或行尾），如 `#codex123` 不匹配
4. 未识别的 `#xxx` 一律透传给默认 agent
5. 支持字面转义：`\#codex ...` 视为普通文本，不路由
6. `#agent` 标签不透传给底层 CLI
7. 无 `#` 前缀时，走默认 agent

## 特性

### 上下文共享

所有 Agent 共享对话历史。当你切换 agent 时，新 agent 可以看到之前的对话上下文。

```
codez> #codex 写一个排序函数
[codex] ...

codez> #claude 这个实现的时间复杂度是多少？
[claude] 根据上面 codex 写的代码，这是一个冒泡排序...
```

### Agent 可用性检查

启动时自动检测已安装的 CLI：

- 不可用的 agent 显示安装提示
- 只有一个可用时，自动设为默认
- 都不可用时，退出并报错

### 超时机制

每次调用有 5 分钟超时限制，超时后自动终止进程。

## 配置

默认配置：

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| default_agent | codex | 无 `#` 前缀时使用的 agent |
| recent_turns | 5 | 上下文保留的最近轮数 |
| max_output_len | 2000 | 每轮输出的最大字符数 |

## 项目结构

```
codez/
├── cmd/codez/main.go           # 程序入口
├── internal/
│   ├── app/app.go              # 主循环逻辑
│   ├── router/parser.go        # #agent 语法解析
│   ├── adapter/                # Agent 适配器
│   │   ├── adapter.go          # 接口定义
│   │   ├── codex.go            # Codex CLI 封装
│   │   └── claude.go           # Claude CLI 封装
│   └── context/context.go      # 上下文管理
├── go.mod
└── README.md
```

## 开发状态

### M1 (已完成)

- [x] M1.0 验证 codex 非交互参数 (`exec`)
- [x] M1.1 路由解析 (`#codex` / `#claude`)
- [x] M1.2 Agent 可用性检查
- [x] M1.3 非交互调用 + 流式输出
- [x] M1.4 内存上下文 (recent turns)
- [x] M1.5 基础 CLI 循环

### M2 (已完成)

- [x] `/handoff`、`/retry`、`/agent` 命令
- [x] 会话持久化 (JSON FileStore，SQLite 作为后续增强)
- [x] Handoff 模板
- [x] `//` 透传（本地命令转义）

### M3 (未来)

- [ ] pair 模式自动链路
- [ ] PTY 交互支持
- [ ] bubbletea TUI

## 测试

```bash
go test ./...
```

## 许可证

MIT
