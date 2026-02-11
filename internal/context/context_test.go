package context

import (
	"strings"
	"testing"
)

func TestContextAdd(t *testing.T) {
	ctx := &Context{}
	ctx.Add("codex", "hello", "world")

	if len(ctx.Entries) != 1 {
		t.Fatalf("entries len = %d, want 1", len(ctx.Entries))
	}

	entry := ctx.Entries[0]
	if entry.Agent != "codex" {
		t.Fatalf("agent = %q, want %q", entry.Agent, "codex")
	}
	if entry.Input != "hello" {
		t.Fatalf("input = %q, want %q", entry.Input, "hello")
	}
	if entry.Output != "world" {
		t.Fatalf("output = %q, want %q", entry.Output, "world")
	}
	if entry.Time.IsZero() {
		t.Fatalf("entry time must be set")
	}
}

func TestSummaryEmpty(t *testing.T) {
	ctx := &Context{}
	if got := ctx.Summary(5, 100); got != "" {
		t.Fatalf("summary = %q, want empty", got)
	}
}

func TestSummaryRecentEntriesOnly(t *testing.T) {
	ctx := &Context{}
	ctx.Add("codex", "q1", "a1")
	ctx.Add("claude", "q2", "a2")
	ctx.Add("codex", "q3", "a3")

	got := ctx.Summary(2, 100)
	if strings.Contains(got, "q1") {
		t.Fatalf("summary should not contain oldest entry: %q", got)
	}
	if !strings.Contains(got, "q2") || !strings.Contains(got, "q3") {
		t.Fatalf("summary should contain recent entries: %q", got)
	}
}

func TestSummaryTruncation(t *testing.T) {
	ctx := &Context{}
	ctx.Add("codex", "q", "123456789")

	got := ctx.Summary(1, 5)
	if !strings.Contains(got, "12345...(truncated)") {
		t.Fatalf("summary should truncate output: %q", got)
	}
}

func TestSummaryUnknownAgentFallback(t *testing.T) {
	ctx := &Context{}
	ctx.Add("", "q", "a")

	got := ctx.Summary(1, 10)
	if !strings.Contains(got, "[unknown]") {
		t.Fatalf("summary should use unknown agent fallback: %q", got)
	}
}

func TestSummaryZeroMaxEntries(t *testing.T) {
	ctx := &Context{}
	ctx.Add("codex", "q", "a")

	if got := ctx.Summary(0, 10); got != "" {
		t.Fatalf("summary with maxEntries=0 should be empty, got: %q", got)
	}
}
