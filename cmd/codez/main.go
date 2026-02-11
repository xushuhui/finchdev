package main

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"codez/internal/app"
)

func main() {
	application := app.NewDefault()
	configureAutoSave(application)

	if err := application.Run(context.Background()); err != nil {
		fmt.Fprintf(os.Stderr, "fatal: %v\n", err)
		os.Exit(1)
	}
}

func configureAutoSave(application *app.App) {
	autosaveEnv := strings.TrimSpace(strings.ToLower(os.Getenv("CODEZ_AUTOSAVE")))
	enabled := autosaveEnv == "1" || autosaveEnv == "true" || autosaveEnv == "yes"
	if !enabled {
		return
	}

	path := strings.TrimSpace(os.Getenv("CODEZ_SESSION_PATH"))
	if path == "" {
		path = defaultSessionPath()
	}
	application.EnableAutoSave(path)
}

func defaultSessionPath() string {
	home, err := os.UserHomeDir()
	if err != nil || strings.TrimSpace(home) == "" {
		return ".codez/session.json"
	}

	return filepath.Join(home, ".codez", "session.json")
}
