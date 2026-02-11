package app

import (
	"bytes"
	"context"
	"errors"
	"io"
	"path/filepath"
	"strings"
	"testing"

	"codez/internal/adapter"
	"codez/internal/session"
)

type fakeAdapter struct {
	name      string
	available bool
	output    string
	runErr    error
	calls     []string
}

func (f *fakeAdapter) Name() string {
	return f.name
}

func (f *fakeAdapter) IsAvailable(context.Context) bool {
	return f.available
}

func (f *fakeAdapter) Run(_ context.Context, input string, stdout, _ io.Writer) error {
	f.calls = append(f.calls, input)
	if f.output != "" {
		_, _ = io.WriteString(stdout, f.output)
	}
	return f.runErr
}

func TestPrepareSwitchDefaultAgent(t *testing.T) {
	codex := &fakeAdapter{name: "codex", available: false}
	claude := &fakeAdapter{name: "claude", available: true}

	errOut := &bytes.Buffer{}
	app := New(map[string]adapter.Adapter{
		"codex":  codex,
		"claude": claude,
	})
	app.Err = errOut
	app.DefaultAgent = "codex"

	if err := app.prepare(context.Background()); err != nil {
		t.Fatalf("prepare returned error: %v", err)
	}
	if app.DefaultAgent != "claude" {
		t.Fatalf("default agent = %q, want %q", app.DefaultAgent, "claude")
	}
	if len(app.Adapters) != 1 {
		t.Fatalf("available adapters = %d, want 1", len(app.Adapters))
	}
	if _, ok := app.Adapters["claude"]; !ok {
		t.Fatalf("claude should remain available")
	}
	if !strings.Contains(errOut.String(), "unavailable") {
		t.Fatalf("expected unavailable warning, got: %q", errOut.String())
	}
}

func TestPrepareNoAvailableAgents(t *testing.T) {
	app := New(map[string]adapter.Adapter{
		"codex":  &fakeAdapter{name: "codex", available: false},
		"claude": &fakeAdapter{name: "claude", available: false},
	})
	app.Err = &bytes.Buffer{}

	err := app.prepare(context.Background())
	if err == nil {
		t.Fatalf("expected error when no adapters are available")
	}
}

func TestRunRoutingAndEscapedSlashPassthrough(t *testing.T) {
	codex := &fakeAdapter{name: "codex", available: true, output: "done\n"}
	app := New(map[string]adapter.Adapter{
		"codex": codex,
	})

	app.In = strings.NewReader("\n#codex hi\n//help\n")
	app.Out = &bytes.Buffer{}
	app.Err = &bytes.Buffer{}
	app.DefaultAgent = "codex"

	if err := app.Run(context.Background()); err != nil {
		t.Fatalf("run returned error: %v", err)
	}

	if len(codex.calls) != 2 {
		t.Fatalf("calls = %d, want 2", len(codex.calls))
	}
	if codex.calls[0] != "hi" {
		t.Fatalf("first call = %q, want %q", codex.calls[0], "hi")
	}
	if !strings.Contains(codex.calls[1], "Current request: /help") {
		t.Fatalf("second call should include passthrough request, got: %q", codex.calls[1])
	}
}

func TestRunLocalAgentCommandSwitch(t *testing.T) {
	codex := &fakeAdapter{name: "codex", available: true, output: "c\n"}
	claude := &fakeAdapter{name: "claude", available: true, output: "a\n"}

	app := New(map[string]adapter.Adapter{
		"codex":  codex,
		"claude": claude,
	})
	app.In = strings.NewReader("/agent claude\nhello\n")
	app.Out = &bytes.Buffer{}
	app.Err = &bytes.Buffer{}
	app.DefaultAgent = "codex"

	if err := app.Run(context.Background()); err != nil {
		t.Fatalf("run returned error: %v", err)
	}

	if app.DefaultAgent != "claude" {
		t.Fatalf("default agent = %q, want %q", app.DefaultAgent, "claude")
	}
	if len(codex.calls) != 0 {
		t.Fatalf("codex should not be called")
	}
	if len(claude.calls) != 1 {
		t.Fatalf("claude calls = %d, want 1", len(claude.calls))
	}
}

func TestRunRetryCommand(t *testing.T) {
	codex := &fakeAdapter{name: "codex", available: true, output: "ok\n"}
	app := New(map[string]adapter.Adapter{
		"codex": codex,
	})

	app.In = strings.NewReader("#codex first\n/retry\n")
	app.Out = &bytes.Buffer{}
	app.Err = &bytes.Buffer{}

	if err := app.Run(context.Background()); err != nil {
		t.Fatalf("run returned error: %v", err)
	}

	if len(codex.calls) != 2 {
		t.Fatalf("calls = %d, want 2", len(codex.calls))
	}
	if codex.calls[0] != "first" {
		t.Fatalf("first call = %q, want %q", codex.calls[0], "first")
	}
	if !strings.Contains(codex.calls[1], "Current request: first") {
		t.Fatalf("retry should call with previous request, got: %q", codex.calls[1])
	}
}

func TestRunHandoffCommand(t *testing.T) {
	codex := &fakeAdapter{name: "codex", available: true, output: "implementation done\n"}
	claude := &fakeAdapter{name: "claude", available: true, output: "review done\n"}

	app := New(map[string]adapter.Adapter{
		"codex":  codex,
		"claude": claude,
	})
	app.In = strings.NewReader("#codex implement list api\n/handoff claude check concurrency\n")
	app.Out = &bytes.Buffer{}
	app.Err = &bytes.Buffer{}

	if err := app.Run(context.Background()); err != nil {
		t.Fatalf("run returned error: %v", err)
	}

	if len(codex.calls) != 1 {
		t.Fatalf("codex calls = %d, want 1", len(codex.calls))
	}
	if len(claude.calls) != 1 {
		t.Fatalf("claude calls = %d, want 1", len(claude.calls))
	}
	if !strings.Contains(claude.calls[0], "handoff:") {
		t.Fatalf("handoff payload missing, got: %q", claude.calls[0])
	}
	if !strings.Contains(claude.calls[0], "implement list api") {
		t.Fatalf("handoff should include previous goal, got: %q", claude.calls[0])
	}
	if !strings.Contains(claude.calls[0], "check concurrency") {
		t.Fatalf("handoff should include next action, got: %q", claude.calls[0])
	}
}

func TestRunUnknownCommandDoesNotCallAdapter(t *testing.T) {
	codex := &fakeAdapter{name: "codex", available: true, output: "ok\n"}
	app := New(map[string]adapter.Adapter{"codex": codex})
	app.In = strings.NewReader("/unknown\n")
	app.Out = &bytes.Buffer{}
	errOut := &bytes.Buffer{}
	app.Err = errOut

	if err := app.Run(context.Background()); err != nil {
		t.Fatalf("run returned error: %v", err)
	}
	if len(codex.calls) != 0 {
		t.Fatalf("adapter should not be called on unknown local command")
	}
	if !strings.Contains(errOut.String(), "unknown local command") {
		t.Fatalf("expected unknown command error, got: %q", errOut.String())
	}
}

func TestRunHelpCommandDoesNotCallAdapter(t *testing.T) {
	codex := &fakeAdapter{name: "codex", available: true, output: "ok\n"}
	app := New(map[string]adapter.Adapter{"codex": codex})
	app.In = strings.NewReader("/help\n")
	out := &bytes.Buffer{}
	app.Out = out
	app.Err = &bytes.Buffer{}

	if err := app.Run(context.Background()); err != nil {
		t.Fatalf("run returned error: %v", err)
	}
	if len(codex.calls) != 0 {
		t.Fatalf("adapter should not be called on /help")
	}
	if !strings.Contains(out.String(), "[system] local commands:") {
		t.Fatalf("expected help header, got: %q", out.String())
	}
	if !strings.Contains(out.String(), "//<text>") {
		t.Fatalf("expected help to include slash passthrough rule, got: %q", out.String())
	}
}

func TestRunNoPromptInNonTTY(t *testing.T) {
	codex := &fakeAdapter{name: "codex", available: true, output: "done\n"}
	app := New(map[string]adapter.Adapter{"codex": codex})
	app.In = strings.NewReader("#codex hello\n")
	out := &bytes.Buffer{}
	app.Out = out
	app.Err = &bytes.Buffer{}

	if err := app.Run(context.Background()); err != nil {
		t.Fatalf("run returned error: %v", err)
	}
	if strings.Contains(out.String(), "codez> ") {
		t.Fatalf("unexpected prompt in non-TTY output: %q", out.String())
	}
}

func TestRunContinuesAfterAdapterError(t *testing.T) {
	codex := &fakeAdapter{name: "codex", available: true, runErr: errors.New("boom")}
	app := New(map[string]adapter.Adapter{
		"codex": codex,
	})

	app.In = strings.NewReader("#codex one\n#codex two\n")
	app.Out = &bytes.Buffer{}
	errOut := &bytes.Buffer{}
	app.Err = errOut
	app.DefaultAgent = "codex"

	if err := app.Run(context.Background()); err != nil {
		t.Fatalf("run returned error: %v", err)
	}

	if len(codex.calls) != 2 {
		t.Fatalf("calls = %d, want 2", len(codex.calls))
	}
	if !strings.Contains(errOut.String(), "boom") {
		t.Fatalf("expected error output to contain adapter error")
	}
}

func TestAutoSaveRoundTrip(t *testing.T) {
	path := filepath.Join(t.TempDir(), "session.json")

	codex := &fakeAdapter{name: "codex", available: true, output: "ok\n"}
	app1 := New(map[string]adapter.Adapter{"codex": codex})
	app1.AutoSave = true
	app1.Store = session.NewFileStore(path)
	app1.In = strings.NewReader("#codex hello\n")
	app1.Out = &bytes.Buffer{}
	app1.Err = &bytes.Buffer{}

	if err := app1.Run(context.Background()); err != nil {
		t.Fatalf("run #1 failed: %v", err)
	}

	app2 := New(map[string]adapter.Adapter{"codex": &fakeAdapter{name: "codex", available: true}})
	app2.AutoSave = true
	app2.Store = session.NewFileStore(path)
	app2.Out = &bytes.Buffer{}
	app2.Err = &bytes.Buffer{}

	if err := app2.prepare(context.Background()); err != nil {
		t.Fatalf("prepare #2 failed: %v", err)
	}
	if len(app2.Context.Entries) != 1 {
		t.Fatalf("expected persisted entries, got %d", len(app2.Context.Entries))
	}
	if app2.LastTurn == nil || app2.LastTurn.Input != "hello" {
		t.Fatalf("expected persisted last turn")
	}
}
