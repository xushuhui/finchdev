# Bug 记录

## BUG-001: codex 输出格式混乱

### 状态
- **优先级**: P1
- **状态**: ✅ 已修复

### 问题描述

使用 `#codex` 调用时，输出包含大量元数据（thinking、tokens used 等），且响应内容被重复输出。

**复现步骤**:
```bash
codez> #codex 你是什么模型
```

**实际输出**:
```
[codex] ...
thinking
**Confirming model description**
codex
我是 OpenAI 的 AI 助手...
tokens used
2,803
我是 OpenAI 的 AI 助手...   # 响应被重复输出
```

**期望输出**:
```
[codex] 我是 OpenAI 的 AI 助手...
```

### 根因分析

`codex exec` 默认输出包含：
- 会话元数据（workdir、model、sandbox 等）
- thinking 过程
- tokens 统计
- 最终响应

**关键发现**：元数据输出走的是 **stderr**，不是 stdout。因此需要同时抑制 stdout 和 stderr。

### 解决方案

**方案 B: 使用 `-o` 参数输出最终响应到文件**

`codex exec` 支持 `-o, --output-last-message <FILE>` 参数，可将最终响应写入指定文件。

**修改内容**:
1. 在 `CodexAdapter.Run()` 中创建临时文件
2. 添加 `-o <tempfile>` 参数
3. 执行完成后读取临时文件内容并输出到 stdout
4. 清理临时文件

**代码变更**:
- `internal/adapter/codex.go`: 修改 Run 方法实现

### 对比：claude 为何正常

`claude -p` 直接输出纯响应，无多余元数据，因此无需特殊处理。

### 验证方法

```bash
# 修复前
codez> #codex hello
# 输出混乱

# 修复后
codez> #codex hello
# 只显示最终响应
```

### 修复记录

- **修复日期**: 2026-02-11
- **修复文件**: `internal/adapter/codex.go`
- **测试结果**: `go test ./...` 全部通过

**核心代码变更**:
```go
func (c *CodexAdapter) Run(ctx context.Context, input string, stdout, stderr io.Writer) error {
    // Create temp file for -o output
    tmpFile, err := os.CreateTemp("", "codex-output-*.txt")
    // ...

    // Add -o flag to capture final response
    args := append(c.Args, "-o", tmpPath)

    // Run codex with both stdout and stderr suppressed
    // (codex outputs metadata to stderr, we only want the -o file content)
    runCommand(ctx, c.Bin, args, input, io.Discard, io.Discard)

    // Read and output the final response
    content, _ := os.ReadFile(tmpPath)
    stdout.Write(content)
}
```

---

## BUG-002: slice append 可能污染原切片

### 状态
- **优先级**: P2
- **状态**: ✅ 已修复
- **发现者**: Codex 代码审查

### 问题描述

在 `CodexAdapter.Run()` 中：
```go
args := append(c.Args, "-o", tmpPath)
```

如果 `c.Args` 底层数组有剩余容量，`append` 会直接修改原数组，导致并发调用时出现数据竞争。

### 修复方案

先拷贝切片再 append：
```go
args := make([]string, len(c.Args), len(c.Args)+2)
copy(args, c.Args)
args = append(args, "-o", tmpPath)
```

或使用更简洁的写法：
```go
args := append([]string(nil), c.Args...)
args = append(args, "-o", tmpPath)
```

### 修复记录
- **修复日期**: 2026-02-11
- **修复文件**: `internal/adapter/codex.go`

---

## BUG-003: stdout.Write 错误未处理

### 状态
- **优先级**: P3
- **状态**: ✅ 已修复
- **发现者**: Codex 代码审查

### 问题描述

在 `CodexAdapter.Run()` 中：
```go
stdout.Write(content)
```

`Write` 返回的错误被忽略，可能导致输出不完整但无感知。

### 修复方案

处理 Write 错误：
```go
if _, err := stdout.Write(content); err != nil {
    return fmt.Errorf("failed to write output: %w", err)
}
```

### 修复记录
- **修复日期**: 2026-02-11
- **修复文件**: `internal/adapter/codex.go`
