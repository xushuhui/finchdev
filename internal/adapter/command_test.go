package adapter

import (
	"bytes"
	"context"
	"os/exec"
	"strings"
	"testing"
	"time"
)

func TestIsCommandAvailable(t *testing.T) {
	ctx := context.Background()
	if !isCommandAvailable(ctx, "echo") {
		t.Fatalf("echo command should be available in test environment")
	}
	if isCommandAvailable(ctx, "definitely-not-a-real-command") {
		t.Fatalf("non-existing command should not be available")
	}
}

func TestRunCommandNotFound(t *testing.T) {
	err := runCommand(context.Background(), "definitely-not-a-real-command", nil, "", nil, nil)
	if err == nil {
		t.Fatalf("expected error for missing command")
	}
}

func TestRunCommandSuccess(t *testing.T) {
	var stdout bytes.Buffer
	var stderr bytes.Buffer

	err := runCommand(context.Background(), "echo", nil, "hello", &stdout, &stderr)
	if err != nil {
		t.Fatalf("runCommand returned error: %v", err)
	}

	if !strings.Contains(stdout.String(), "hello") {
		t.Fatalf("stdout = %q, want contain %q", stdout.String(), "hello")
	}
	if stderr.Len() != 0 {
		t.Fatalf("stderr should be empty, got: %q", stderr.String())
	}
}

func TestRunCommandTimeout(t *testing.T) {
	if _, err := exec.LookPath("sleep"); err != nil {
		t.Skip("sleep command not found")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Millisecond)
	defer cancel()

	err := runCommand(ctx, "sleep", []string{"1"}, "", nil, nil)
	if err == nil {
		t.Fatalf("expected timeout error")
	}
	if !strings.Contains(err.Error(), "timed out") {
		t.Fatalf("expected timeout error, got: %v", err)
	}
}

func TestRunCommandAppendsInputAfterArgs(t *testing.T) {
	var stdout bytes.Buffer

	err := runCommand(context.Background(), "echo", []string{"prefix"}, "payload", &stdout, nil)
	if err != nil {
		t.Fatalf("runCommand returned error: %v", err)
	}

	out := stdout.String()
	if !strings.Contains(out, "prefix") || !strings.Contains(out, "payload") {
		t.Fatalf("stdout missing expected args, got: %q", out)
	}
}

func TestWithDefaultRunTimeout(t *testing.T) {
	ctx := context.Background()
	runCtx, cancel := withDefaultRunTimeout(ctx)
	defer cancel()

	if _, ok := runCtx.Deadline(); !ok {
		t.Fatalf("expected deadline when input context has none")
	}
}

func TestWithDefaultRunTimeoutKeepExistingDeadline(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

	runCtx, done := withDefaultRunTimeout(ctx)
	defer done()

	d1, ok1 := ctx.Deadline()
	d2, ok2 := runCtx.Deadline()
	if !ok1 || !ok2 {
		t.Fatalf("both contexts should have deadlines")
	}
	if !d1.Equal(d2) {
		t.Fatalf("deadline should be preserved")
	}
}
