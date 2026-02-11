# Codez v0.1 PRD

> 本文档由 Claude 与 Codex 讨论收敛后生成，作为 v0.1 实现的唯一依据。

## 1. 项目定位

**一句话描述**：让 `codex` 负责"快写"，让 `claude` 负责"深查"，通过一个最小侵入的编排层把两者串成可重复的工程协作流。

**核心闭环**：`#codex 实现` → `#claude 检查` → `#codex 修复`

## 2. 架构边界

| 项目  | v0.1 范围                       | 明确排除              |
| ----- | ------------------------------- | --------------------- |
| 架构  | CLI 编排层                      | 不直接接模型 HTTP API |
| Agent | 复用本地 `codex` + `claude` CLI | 不自己实现工具调用    |
| 交互  | 非交互优先                      | PTY 延后到 v0.2       |
| UI    | 轻量 CLI 循环                   | bubbletea TUI 延后    |

## 3. 用户交互语法

### 3.1 路由语法（`#agent`）

```text
#codex 写一个 Go 的列表接口
#claude 检查刚才接口的并发问题
```

规则：

1. 仅解析输入的**第一行首 token**
2. 仅识别白名单：`#codex`、`#claude`
3. 必须是完整 token（后跟空白或行尾），如 `#codex123` 不匹配
4. 未识别的 `#xxx` 一律透传给默认 agent
5. 支持字面转义：`\#codex ...` 视为普通文本，不路由
6. `#agent` 标签不透传给底层 CLI
7. 无 `#` 前缀时，走 `default_agent`

### 3.2 本地命令（`/cmd`）

| 命令                     | 说明                   | 里程碑 |
| ------------------------ | ---------------------- | ------ |
| `/agent codex\|claude`   | 切换默认 agent         | M2     |
| `/handoff codex\|claude` | 把上一轮结果按模板转交 | M2     |
| `/retry`                 | 重试上一轮             | M2     |

规则：

- `/` 命令全部本地消费，不进入 agent prompt
- **M1 不实现任何 `/` 命令**，仅支持 `#agent` 路由
- **M1 中以 `/` 开头的输入一律按普通文本透传给默认 agent**
- 转义：若需把 `/xxx` 原样发给 agent，使用 `//xxx`（M2 生效）

### 3.3 终端模式（`!cmd`）

```text
!ls -la
!git status
!npm install
```

规则：

1. 以 `!` 开头的输入进入终端模式，直接执行 shell 命令
2. `!` 后的内容作为 shell 命令执行（使用系统默认 shell）
3. 命令输出实时显示到终端
4. 命令执行结果（stdout/stderr）记录到上下文历史，供后续 agent 引用
5. 支持管道和重定向：`!cat file.go | grep func`
6. 转义：`\!echo` 视为普通文本，不执行命令
7. 单独输入 `!` 不执行任何操作，提示用法

示例：

```bash
codez> !pwd
/Users/dev/myproject

codez> !git diff --stat
 main.go | 10 +++++-----
 1 file changed, 5 insertions(+), 5 deletions(-)

codez> #claude 检查上面 git diff 的改动有没有问题
[claude] 根据刚才的 git diff 输出，我来检查这些改动...
```

安全考量：

- 命令在当前工作目录执行
- 继承当前环境变量
- **不做命令过滤**：用户对本地终端有完全控制权
- 超时机制与 agent 调用一致（默认 5 分钟）

## 4. Agent 适配

### 4.1 调用参数

```yaml
agents:
  codex:
    bin: codex
    args: ["exec"] # 待验证
  claude:
    bin: claude
    args: ["-p"] # --print 简写
```

> **注意**：`codex exec` 需在实现前验证。若不可用，替换为等价非交互参数，不改动整体架构。

### 4.2 可用性检查

启动时检查：

```bash
codex --version  # 或 --help
claude --version
```

降级策略：

1. 不可用的 agent 标记为 disabled
2. 用户调用时提示安装命令
3. 只有一个可用时，自动设为默认
4. 都不可用时，退出并报错

### 4.3 超时机制

```go
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
defer cancel()
```

超时后 kill 进程并提示用户。

## 5. 上下文共享

### 5.1 策略

- **Recent Turns**：最近 N 轮原文（默认 5 轮）
- **Handoff 模板**：agent 间传递时使用结构化摘要

### 5.2 Handoff 模板（5 字段）

```yaml
handoff:
  goal: "用户目标"
  status: "当前状态（success/failed/partial）"
  files_changed: []
  error: "错误摘要（可空）"
  next_action: "下一 agent 目标"
```

生成方式：

```go
handoff := Handoff{
    Goal:         lastUserInput,
    Status:       inferStatus(exitCode),
    FilesChanged: []string{},        // v0.1 留空
    Error:        stderr.String(),
    NextAction:   "",                // /handoff 时填充
}
```

## 6. 协作模式

| 模式   | 说明                                  | v0.1 状态               |
| ------ | ------------------------------------- | ----------------------- |
| direct | 用户指定哪个 agent 就只调用哪个       | ✅ 唯一模式             |
| pair   | codex 产出 → claude 审查 → codex 修复 | ❌ v0.1 不支持，M3 实现 |

> v0.1 只有 direct 模式，无需 `/mode` 命令。

## 7. 项目结构

```
codez/
├── cmd/codez/main.go
├── internal/
│   ├── app/           # 启动、生命周期
│   ├── router/        # #agent 解析
│   ├── adapter/       # codex/claude 适配器
│   ├── shell/         # 终端模式 (!cmd) 执行器
│   ├── context/       # 上下文 + handoff
│   ├── command/       # /agent, /handoff, /retry
│   └── ui/            # 输入输出（readline）
├── config.example.yaml
└── go.mod
```

## 8. 配置文件

```yaml
default_agent: codex
mode: direct

agents:
  codex:
    bin: codex
    args: ["exec"]
    enabled: true
  claude:
    bin: claude
    args: ["-p"]
    enabled: true

context:
  recent_turns: 5
  max_output_len: 2000

session:
  store: ~/.codez/sessions
  autosave: false # M1 不持久化，M2 引入
```

配置加载优先级：

1. 命令行参数
2. 环境变量 (CODEZ\_\*)
3. 当前目录 ./codez.yaml
4. 用户目录 ~/.codez/config.yaml
5. 默认值

## 9. 里程碑

### M1（必须完成）

- [ ] **M1.0** 验证 codex 非交互参数（`exec` 子命令或等价）
- [ ] M1.1 路由解析（`#codex` / `#claude`）
- [ ] M1.2 两个 adapter 的可用性检查
- [ ] M1.3 非交互调用 + 流式输出转发
- [ ] M1.4 内存上下文（recent turns）
- [ ] M1.5 基础 CLI 循环（readline）
- [ ] M1.6 终端模式（`!cmd` 直接执行 shell 命令）

**验收标准**：

```bash
$ codez
codez> #codex 写一个 hello world
[codex] ... 输出 ...
codez> #claude 检查上面的代码
[claude] ... 输出（能看到 codex 的历史上下文）...
codez> 继续优化  # 走默认 agent
codez> !ls -la   # 终端模式，直接执行命令
total 16
drwxr-xr-x  4 user  staff   128 Feb 11 10:00 .
-rw-r--r--  1 user  staff   156 Feb 11 10:00 main.go
codez> #claude 解释一下刚才列出的文件
[claude] ... 输出（能看到 !ls 的结果）...
```

### M2（建议完成）

- [x] 最小 handoff 模板
- [x] `/handoff`、`/retry`、`/agent` 命令
- [x] 会话持久化（JSON FileStore，SQLite 作为后续增强）
- [x] 至少完成 1 次跨 agent 审查闭环（验证协作治理规则）

### M3（增强）

- [ ] pair 模式自动链路
- [ ] `/mode` 命令
- [ ] PTY 交互支持
- [ ] bubbletea TUI

## 10. 冲突规避规则

1. **路由关键词只在编排层解释**：`#codex`、`#claude` 不透传给 agent
2. **控制命令统一 `/` 前缀**：避免污染用户任务语义
3. **元数据 side-channel 传输**：会话 ID、模式不拼进 prompt 文本
4. **禁止模板化强提示词**：不在每轮附加固定系统词
5. **最小包装**：只在必要时附加简短上下文摘要
6. **`/` 命令转义**：若用户需要把 `/xxx` 原样发给 agent，使用 `//xxx` 语法
   - `//help` → 发送 `/help` 给当前 agent
   - `/help` → 编排层本地命令（M2 实现后生效）

## 11. 错误处理

| 错误类型       | 处理策略                        |
| -------------- | ------------------------------- |
| Agent 未安装   | 提示安装命令，继续单 agent 工作 |
| Agent 执行失败 | 显示错误，继续等待下一条输入    |
| Agent 超时     | kill 进程，提示用户             |
| 解析错误       | 提示语法，继续等待              |
| 配置错误       | 启动时检查，提示修复            |

## 12. 协作治理规则

1. **作者-审查者分离**：产出方与审查方必须是不同 agent
   - claude 产出 → codex 审查
   - codex 产出 → claude 审查

2. **审查闭环**：
   - 审查方给出问题清单（问题、影响、建议）
   - 产出方逐条修订并回复
   - 复审通过后方可进入下一阶段

3. **适用范围**：文档与代码均适用

## 13. 文档版本

| 版本       | 日期       | 说明                    |
| ---------- | ---------- | ----------------------- |
| v0.1-draft | 2026-02-11 | Claude + Codex 讨论收敛 |
| v0.1-rev1  | 2026-02-11 | Codex 检查反馈修正      |
| v0.1-rev2  | 2026-02-11 | 新增协作治理规则        |
| v0.1-rev3  | 2026-02-11 | 新增路由硬规则          |
| v0.1-final | 2026-02-11 | Codex 终检通过          |
| v0.1-rev4  | 2026-02-11 | 新增终端模式 (!cmd)     |
| v0.2-rev1  | 2026-02-11 | M2 第一轮完成（命令 + JSON 持久化） |

---

**状态**：PRD READY，可开始 M1 实现。

---

## 附录 A：审查意见模板（默认模板，可扩展）

### A.1 Reviewer 模板（审查方）

```markdown
## Review by <agent>

### 总结

- 结论：Pass / Needs Changes
- 范围：文档 / 代码
- 轮次：R1 / R2 / ...

### 问题清单

1. [严重级别: High|Med|Low] <问题标题>
   - 位置：<文件:行号 或 章节>
   - 影响：<风险或后果>
   - 建议：<可执行修改建议>

2. ...
```

### A.2 Author 模板（产出方修订回复）

```markdown
## Fix Response by <agent>

### 逐条响应

1. 对应问题 #1
   - 处理结果：已修复 / 部分修复 / 暂不修复
   - 修改内容：<具体改动>
   - 说明：<原因或取舍>

2. ...

### 变更摘要

- 文档：<章节变更>
- 代码：<文件变更>
```

### A.3 复审通过条件

通过（Pass）需同时满足：

- High 问题全部关闭
- Med 问题已关闭或有明确接受理由
- 关键验收标准无回退
- 变更范围与目标一致
