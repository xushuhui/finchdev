package adapter

import (
	"context"
	"fmt"
	"io"
	"os"
)

// CodexAdapter adapts OpenAI Codex CLI.
type CodexAdapter struct {
	Bin  string
	Args []string
}

func NewCodexAdapter() *CodexAdapter {
	return &CodexAdapter{
		Bin:  "codex",
		Args: []string{"exec"},
	}
}

func (c *CodexAdapter) Name() string {
	return "codex"
}

func (c *CodexAdapter) IsAvailable(ctx context.Context) bool {
	return isCommandAvailable(ctx, c.Bin)
}

func (c *CodexAdapter) Run(ctx context.Context, input string, stdout, stderr io.Writer) error {
	// Create temp file for -o output
	tmpFile, err := os.CreateTemp("", "codex-output-*.txt")
	if err != nil {
		return fmt.Errorf("failed to create temp file: %w", err)
	}
	tmpPath := tmpFile.Name()
	tmpFile.Close()
	defer os.Remove(tmpPath)

	// Copy args to avoid slice pollution, then add -o flag
	args := make([]string, len(c.Args), len(c.Args)+2)
	copy(args, c.Args)
	args = append(args, "-o", tmpPath)

	// Run codex with both stdout and stderr suppressed
	// (codex outputs metadata to stderr, we only want the -o file content)
	if err := runCommand(ctx, c.Bin, args, input, io.Discard, io.Discard); err != nil {
		return err
	}

	// Read and output the final response
	content, err := os.ReadFile(tmpPath)
	if err != nil {
		return fmt.Errorf("failed to read output file: %w", err)
	}

	if len(content) > 0 {
		if _, err := stdout.Write(content); err != nil {
			return fmt.Errorf("failed to write output: %w", err)
		}
		// Ensure newline at end
		if content[len(content)-1] != '\n' {
			if _, err := stdout.Write([]byte("\n")); err != nil {
				return fmt.Errorf("failed to write newline: %w", err)
			}
		}
	}

	return nil
}
