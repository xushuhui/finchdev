package session

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"time"

	chatctx "codez/internal/context"
)

// State is persisted session state.
type State struct {
	DefaultAgent string          `json:"default_agent"`
	Entries      []chatctx.Entry `json:"entries"`
	LastTurn     *LastTurn       `json:"last_turn,omitempty"`
}

// LastTurn stores minimal retry/handoff state.
type LastTurn struct {
	Agent  string `json:"agent"`
	Input  string `json:"input"`
	Output string `json:"output"`
	Error  string `json:"error,omitempty"`
}

// Store defines session persistence behavior.
type Store interface {
	Load() (*State, error)
	Save(state *State) error
}

// FileStore persists state as JSON file.
type FileStore struct {
	Path string
}

func NewFileStore(path string) *FileStore {
	return &FileStore{Path: path}
}

func (s *FileStore) Load() (*State, error) {
	if s.Path == "" {
		return nil, errors.New("empty session path")
	}

	content, err := os.ReadFile(s.Path)
	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			return nil, nil
		}
		return nil, fmt.Errorf("read session file: %w", err)
	}

	state := &State{}
	if err := json.Unmarshal(content, state); err != nil {
		if backupErr := s.backupBrokenFile(); backupErr != nil {
			return nil, fmt.Errorf("parse session file: %w (backup failed: %v)", err, backupErr)
		}
		return nil, nil
	}

	return state, nil
}

func (s *FileStore) Save(state *State) error {
	if s.Path == "" {
		return errors.New("empty session path")
	}

	dir := filepath.Dir(s.Path)
	if err := os.MkdirAll(dir, 0o755); err != nil {
		return fmt.Errorf("create session dir: %w", err)
	}

	content, err := json.MarshalIndent(state, "", "  ")
	if err != nil {
		return fmt.Errorf("marshal session state: %w", err)
	}

	if err := os.WriteFile(s.Path, content, 0o644); err != nil {
		return fmt.Errorf("write session file: %w", err)
	}

	return nil
}

func (s *FileStore) backupBrokenFile() error {
	backupPath := fmt.Sprintf("%s.broken.%s", s.Path, time.Now().UTC().Format("20060102T150405.000000000Z"))
	if err := os.Rename(s.Path, backupPath); err != nil {
		return fmt.Errorf("move broken session file to backup: %w", err)
	}
	return nil
}
