# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Test

```bash
go build -o codez ./cmd/codez    # Build
go test ./...                     # Run all tests
go test ./internal/router/...     # Run specific package tests
go test -run TestParse ./...      # Run specific test
```

## Architecture

Codez is a CLI orchestration layer that routes user input to different AI Agent CLIs (Claude Code, OpenAI Codex) and shares conversation context between agents.

```
User Input → Router (parse #agent) → Adapter → External CLI (claude/codex)
                                         ↓
                              Context (shared history)
```

**Key packages:**
- `internal/app/` - Main CLI loop, coordinates all components
- `internal/router/` - Parses `#agent` syntax from user input
- `internal/adapter/` - Wraps external CLIs (codex, claude) with unified interface
- `internal/context/` - Manages shared conversation history across agents

**Adapter interface** (`internal/adapter/adapter.go`):
```go
type Adapter interface {
    Name() string
    IsAvailable(ctx context.Context) bool
    Run(ctx context.Context, input string, stdout, stderr io.Writer) error
}
```

**Input syntax:**
- `#codex <msg>` / `#claude <msg>` - Route to specific agent
- `!<cmd>` - Execute shell command directly (M1.6)
- `/cmd` - Local commands (M2, not yet implemented)

## Project Rules

**Bug tracking:** All issues and fixes must be recorded in `bug.md` with format:
```
## BUG-XXX: description
### 状态 / 问题描述 / 修复方案 / 修复记录
```

**Code review:** Cross-agent review (codex writes → claude reviews, or vice versa).

## Key Files

- `PRD.md` - Product requirements, milestones (M1/M2/M3)
- `bug.md` - Bug records and fixes
- `README.md` - User-facing documentation
