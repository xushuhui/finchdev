package session

import (
	"os"
	"path/filepath"
	"testing"

	chatctx "codez/internal/context"
)

func TestFileStoreRoundTrip(t *testing.T) {
	tmp := t.TempDir()
	path := filepath.Join(tmp, "session.json")

	store := NewFileStore(path)
	state := &State{
		DefaultAgent: "claude",
		Entries: []chatctx.Entry{{
			Agent:  "codex",
			Input:  "hello",
			Output: "world",
		}},
		LastTurn: &LastTurn{Agent: "codex", Input: "hello", Output: "world"},
	}

	if err := store.Save(state); err != nil {
		t.Fatalf("save failed: %v", err)
	}

	loaded, err := store.Load()
	if err != nil {
		t.Fatalf("load failed: %v", err)
	}
	if loaded == nil {
		t.Fatalf("loaded state is nil")
	}
	if loaded.DefaultAgent != "claude" {
		t.Fatalf("default agent = %q, want %q", loaded.DefaultAgent, "claude")
	}
	if len(loaded.Entries) != 1 {
		t.Fatalf("entries len = %d, want 1", len(loaded.Entries))
	}
	if loaded.LastTurn == nil || loaded.LastTurn.Agent != "codex" {
		t.Fatalf("last turn not persisted")
	}
}

func TestFileStoreLoadNotFound(t *testing.T) {
	path := filepath.Join(t.TempDir(), "missing.json")
	store := NewFileStore(path)

	loaded, err := store.Load()
	if err != nil {
		t.Fatalf("load failed: %v", err)
	}
	if loaded != nil {
		t.Fatalf("expected nil state for missing file")
	}
}

func TestFileStoreLoadCorruptedBackupsAndResets(t *testing.T) {
	tmp := t.TempDir()
	path := filepath.Join(tmp, "session.json")
	if err := os.WriteFile(path, []byte("{invalid"), 0o644); err != nil {
		t.Fatalf("write corrupted session file failed: %v", err)
	}

	store := NewFileStore(path)
	loaded, err := store.Load()
	if err != nil {
		t.Fatalf("load failed: %v", err)
	}
	if loaded != nil {
		t.Fatalf("expected nil state after corrupted recovery")
	}

	if _, err := os.Stat(path); !os.IsNotExist(err) {
		t.Fatalf("expected original corrupted file moved away, stat err: %v", err)
	}

	backups, err := filepath.Glob(path + ".broken.*")
	if err != nil {
		t.Fatalf("glob backups failed: %v", err)
	}
	if len(backups) != 1 {
		t.Fatalf("expected exactly one backup file, got %d", len(backups))
	}

	content, err := os.ReadFile(backups[0])
	if err != nil {
		t.Fatalf("read backup failed: %v", err)
	}
	if string(content) != "{invalid" {
		t.Fatalf("backup content mismatch: %q", string(content))
	}
}
