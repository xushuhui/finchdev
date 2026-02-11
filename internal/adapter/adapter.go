package adapter

import (
	"context"
	"io"
)

// Adapter defines agent adapter behavior.
type Adapter interface {
	Name() string
	IsAvailable(ctx context.Context) bool
	Run(ctx context.Context, input string, stdout, stderr io.Writer) error
}
