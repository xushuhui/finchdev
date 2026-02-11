package app

import (
	"bufio"
	"bytes"
	"context"
	"errors"
	"fmt"
	"io"
	"os"
	"sort"
	"strings"
	"time"

	"codez/internal/adapter"
	chatctx "codez/internal/context"
	"codez/internal/router"
	"codez/internal/session"
)

const (
	defaultRecentTurns = 5
	defaultMaxOutput   = 2000
)

// Turn keeps one executed request snapshot.
type Turn struct {
	Agent  string
	Input  string
	Output string
	Error  string
}

// App is the main CLI application.
type App struct {
	In  io.Reader
	Out io.Writer
	Err io.Writer

	Adapters map[string]adapter.Adapter
	Context  *chatctx.Context

	DefaultAgent string
	RecentTurns  int
	MaxOutputLen int

	AutoSave    bool
	SessionPath string
	Store       session.Store

	LastTurn *Turn
}

// New creates an app with provided dependencies.
func New(adapters map[string]adapter.Adapter) *App {
	return &App{
		In:           os.Stdin,
		Out:          os.Stdout,
		Err:          os.Stderr,
		Adapters:     adapters,
		Context:      &chatctx.Context{},
		DefaultAgent: "codex",
		RecentTurns:  defaultRecentTurns,
		MaxOutputLen: defaultMaxOutput,
		AutoSave:     false,
	}
}

// NewDefault creates an app with built-in adapters.
func NewDefault() *App {
	return New(map[string]adapter.Adapter{
		"codex":  NewCodex(),
		"claude": NewClaude(),
	})
}

// EnableAutoSave enables session persistence using file-backed store.
func (app *App) EnableAutoSave(path string) {
	app.AutoSave = true
	app.SessionPath = path
	app.Store = session.NewFileStore(path)
}

// Run starts the main CLI loop.
func (app *App) Run(ctx context.Context) error {
	if err := app.prepare(ctx); err != nil {
		return err
	}

	scanner := bufio.NewScanner(app.In)
	showPrompt := shouldShowPrompt(app.In, app.Out)
	for {
		if showPrompt {
			if _, err := fmt.Fprint(app.Out, "codez> "); err != nil {
				return err
			}
		}

		if !scanner.Scan() {
			if scanErr := scanner.Err(); scanErr != nil {
				return scanErr
			}
			return nil
		}

		rawInput := scanner.Text()
		if strings.TrimSpace(rawInput) == "" {
			continue
		}

		routedInput := rawInput
		if strings.HasPrefix(routedInput, "//") {
			routedInput = routedInput[1:]
		} else if strings.HasPrefix(routedInput, "/") {
			handled, err := app.handleLocalCommand(ctx, routedInput)
			if err != nil {
				fmt.Fprintf(app.Err, "[error] %v\n", err)
			}
			if handled {
				continue
			}
		}

		if err := app.executeRoutedInput(ctx, routedInput); err != nil {
			fmt.Fprintf(app.Err, "[error] %v\n", err)
		}
	}
}

func (app *App) executeRoutedInput(ctx context.Context, rawInput string) error {
	parsed := router.Parse(rawInput)
	agentName := parsed.Agent
	if agentName == "" {
		agentName = app.DefaultAgent
	}

	requestText := parsed.Content
	if parsed.Agent == "" {
		requestText = rawInput
	}

	return app.executeTurn(ctx, agentName, requestText)
}

func (app *App) executeTurn(ctx context.Context, agentName, requestText string) error {
	ag, ok := app.Adapters[agentName]
	if !ok {
		return fmt.Errorf("unknown or unavailable agent: %s", agentName)
	}

	prompt := app.buildPrompt(requestText)
	fmt.Fprintf(app.Out, "[%s] ", agentName)

	var output bytes.Buffer
	stdout := io.MultiWriter(app.Out, &output)
	runCtx, cancel := context.WithTimeout(ctx, 5*time.Minute)
	err := ag.Run(runCtx, prompt, stdout, app.Err)
	cancel()

	if output.Len() > 0 && !strings.HasSuffix(output.String(), "\n") {
		fmt.Fprintln(app.Out)
	}

	turn := &Turn{
		Agent:  agentName,
		Input:  requestText,
		Output: output.String(),
	}
	if err != nil {
		turn.Error = err.Error()
	}
	app.LastTurn = turn

	app.Context.Add(agentName, requestText, output.String())
	app.persistState()

	return err
}

func (app *App) handleLocalCommand(ctx context.Context, input string) (bool, error) {
	parts := strings.Fields(input)
	if len(parts) == 0 {
		return false, nil
	}

	switch parts[0] {
	case "/agent":
		if len(parts) < 2 {
			return true, errors.New("usage: /agent codex|claude")
		}
		target := strings.ToLower(parts[1])
		if _, ok := app.Adapters[target]; !ok {
			return true, fmt.Errorf("agent unavailable: %s", target)
		}
		app.DefaultAgent = target
		app.persistState()
		fmt.Fprintf(app.Out, "[system] default agent set to %s\n", target)
		return true, nil

	case "/retry":
		if app.LastTurn == nil {
			return true, errors.New("no previous turn to retry")
		}
		fmt.Fprintf(app.Out, "[system] retry with %s\n", app.LastTurn.Agent)
		return true, app.executeTurn(ctx, app.LastTurn.Agent, app.LastTurn.Input)

	case "/handoff":
		if len(parts) < 2 {
			return true, errors.New("usage: /handoff codex|claude [next action]")
		}
		if app.LastTurn == nil {
			return true, errors.New("no previous turn to handoff")
		}
		target := strings.ToLower(parts[1])
		if _, ok := app.Adapters[target]; !ok {
			return true, fmt.Errorf("agent unavailable: %s", target)
		}

		nextAction := "Please review and suggest next steps."
		if len(parts) > 2 {
			nextAction = strings.TrimSpace(strings.TrimPrefix(input, parts[0]+" "+parts[1]))
		}

		handoff := app.buildHandoff(nextAction)
		fmt.Fprintf(app.Out, "[system] handoff to %s\n", target)
		return true, app.executeTurn(ctx, target, handoff)

	case "/help":
		fmt.Fprintln(app.Out, "[system] local commands:")
		fmt.Fprintln(app.Out, "  /help                          Show this help")
		fmt.Fprintln(app.Out, "  /agent codex|claude            Switch default agent")
		fmt.Fprintln(app.Out, "  /retry                         Retry the previous turn")
		fmt.Fprintln(app.Out, "  /handoff <agent> [next action] Handoff previous turn using template")
		fmt.Fprintln(app.Out, "  //<text>                       Pass through a leading '/' as plain input")
		return true, nil
	}

	return true, fmt.Errorf("unknown local command: %s (use // to pass through)", parts[0])
}

func (app *App) buildHandoff(nextAction string) string {
	status := "success"
	errMsg := ""
	if app.LastTurn != nil && app.LastTurn.Error != "" {
		status = "failed"
		errMsg = app.LastTurn.Error
	}
	goal := ""
	if app.LastTurn != nil {
		goal = app.LastTurn.Input
	}

	return fmt.Sprintf(
		"handoff:\n  goal: %q\n  status: %q\n  files_changed: []\n  error: %q\n  next_action: %q",
		goal,
		status,
		errMsg,
		nextAction,
	)
}

func (app *App) buildPrompt(input string) string {
	summary := app.Context.Summary(app.RecentTurns, app.MaxOutputLen)
	if summary == "" {
		return input
	}

	return fmt.Sprintf("Previous context:\n%s\n\nCurrent request: %s", summary, input)
}

func (app *App) prepare(ctx context.Context) error {
	if app.Context == nil {
		app.Context = &chatctx.Context{}
	}
	if app.RecentTurns <= 0 {
		app.RecentTurns = defaultRecentTurns
	}
	if app.MaxOutputLen <= 0 {
		app.MaxOutputLen = defaultMaxOutput
	}

	app.loadState()

	available := make(map[string]adapter.Adapter)
	for name, ad := range app.Adapters {
		if ad.IsAvailable(ctx) {
			available[name] = ad
			continue
		}
		fmt.Fprintf(app.Err, "agent %q unavailable. %s\n", name, installHint(name))
	}

	if len(available) == 0 {
		return errors.New("no available agents found")
	}

	app.Adapters = available
	if _, ok := app.Adapters[app.DefaultAgent]; !ok {
		app.DefaultAgent = pickDefault(available)
		fmt.Fprintf(app.Err, "default agent switched to %q\n", app.DefaultAgent)
	}

	return nil
}

func (app *App) loadState() {
	if !app.AutoSave {
		return
	}

	if app.Store == nil {
		if app.SessionPath == "" {
			return
		}
		app.Store = session.NewFileStore(app.SessionPath)
	}

	state, err := app.Store.Load()
	if err != nil {
		fmt.Fprintf(app.Err, "[warn] load session failed: %v\n", err)
		return
	}
	if state == nil {
		return
	}

	if state.DefaultAgent != "" {
		app.DefaultAgent = state.DefaultAgent
	}
	if len(state.Entries) > 0 {
		app.Context.Entries = state.Entries
	}
	if state.LastTurn != nil {
		app.LastTurn = &Turn{
			Agent:  state.LastTurn.Agent,
			Input:  state.LastTurn.Input,
			Output: state.LastTurn.Output,
			Error:  state.LastTurn.Error,
		}
	}
}

func (app *App) persistState() {
	if !app.AutoSave || app.Store == nil {
		return
	}

	state := &session.State{
		DefaultAgent: app.DefaultAgent,
		Entries:      app.Context.Entries,
	}
	if app.LastTurn != nil {
		state.LastTurn = &session.LastTurn{
			Agent:  app.LastTurn.Agent,
			Input:  app.LastTurn.Input,
			Output: app.LastTurn.Output,
			Error:  app.LastTurn.Error,
		}
	}

	if err := app.Store.Save(state); err != nil {
		fmt.Fprintf(app.Err, "[warn] save session failed: %v\n", err)
	}
}

func pickDefault(adapters map[string]adapter.Adapter) string {
	if _, ok := adapters["codex"]; ok {
		return "codex"
	}
	if _, ok := adapters["claude"]; ok {
		return "claude"
	}

	names := make([]string, 0, len(adapters))
	for name := range adapters {
		names = append(names, name)
	}
	sort.Strings(names)
	return names[0]
}

func installHint(agent string) string {
	switch agent {
	case "codex":
		return "install with: npm install -g @openai/codex"
	case "claude":
		return "install with: npm install -g @anthropic-ai/claude-code"
	default:
		return "check installation and PATH"
	}
}

func NewCodex() adapter.Adapter {
	return adapter.NewCodexAdapter()
}

func NewClaude() adapter.Adapter {
	return adapter.NewClaudeAdapter()
}

func shouldShowPrompt(in io.Reader, out io.Writer) bool {
	inFile, ok := in.(*os.File)
	if !ok {
		return false
	}
	outFile, ok := out.(*os.File)
	if !ok {
		return false
	}

	inInfo, err := inFile.Stat()
	if err != nil {
		return false
	}
	outInfo, err := outFile.Stat()
	if err != nil {
		return false
	}

	return (inInfo.Mode()&os.ModeCharDevice) != 0 && (outInfo.Mode()&os.ModeCharDevice) != 0
}
