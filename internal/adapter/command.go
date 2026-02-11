package adapter

import (
	"context"
	"errors"
	"fmt"
	"io"
	"os"
	"os/exec"
	"time"
)

const defaultRunTimeout = 5 * time.Minute

func isCommandAvailable(ctx context.Context, bin string) bool {
	if _, err := exec.LookPath(bin); err != nil {
		return false
	}

	checkCtx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()

	cmd := exec.CommandContext(checkCtx, bin, "--version")
	if err := cmd.Run(); err == nil {
		return true
	}

	cmd = exec.CommandContext(checkCtx, bin, "--help")
	return cmd.Run() == nil
}

func runCommand(ctx context.Context, bin string, args []string, input string, stdout, stderr io.Writer) error {
	if _, err := exec.LookPath(bin); err != nil {
		return fmt.Errorf("command %q not found: %w", bin, err)
	}

	runCtx, cancel := withDefaultRunTimeout(ctx)
	defer cancel()

	allArgs := make([]string, 0, len(args)+1)
	allArgs = append(allArgs, args...)
	if input != "" {
		allArgs = append(allArgs, input)
	}

	cmd := exec.CommandContext(runCtx, bin, allArgs...)
	cmd.Env = os.Environ()
	cmd.Stdout = stdout
	cmd.Stderr = stderr

	if err := cmd.Run(); err != nil {
		if errors.Is(runCtx.Err(), context.DeadlineExceeded) {
			return fmt.Errorf("command timed out: %w", runCtx.Err())
		}
		return err
	}

	return nil
}

func withDefaultRunTimeout(ctx context.Context) (context.Context, context.CancelFunc) {
	if _, ok := ctx.Deadline(); ok {
		return ctx, func() {}
	}
	return context.WithTimeout(ctx, defaultRunTimeout)
}
