package adapter

import (
	"context"
	"io"
)

// ClaudeAdapter adapts Claude Code CLI.
type ClaudeAdapter struct {
	Bin  string
	Args []string
}

func NewClaudeAdapter() *ClaudeAdapter {
	return &ClaudeAdapter{
		Bin:  "claude",
		Args: []string{"-p"},
	}
}

func (c *ClaudeAdapter) Name() string {
	return "claude"
}

func (c *ClaudeAdapter) IsAvailable(ctx context.Context) bool {
	return isCommandAvailable(ctx, c.Bin)
}

func (c *ClaudeAdapter) Run(ctx context.Context, input string, stdout, stderr io.Writer) error {
	return runCommand(ctx, c.Bin, c.Args, input, stdout, stderr)
}
