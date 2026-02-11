package main

import (
	"path/filepath"
	"testing"
)

func TestDefaultSessionPathUsesHomeDir(t *testing.T) {
	home := t.TempDir()
	t.Setenv("HOME", home)

	got := defaultSessionPath()
	want := filepath.Join(home, ".codez", "session.json")
	if got != want {
		t.Fatalf("defaultSessionPath = %q, want %q", got, want)
	}
}
