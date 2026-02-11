package context

import (
	"fmt"
	"strings"
	"time"
)

// Entry is one conversation record.
type Entry struct {
	Agent  string
	Input  string
	Output string
	Time   time.Time
}

// Context stores shared conversation entries in memory.
type Context struct {
	Entries []Entry
}

// Add appends one entry.
func (c *Context) Add(agent, input, output string) {
	c.Entries = append(c.Entries, Entry{
		Agent:  agent,
		Input:  input,
		Output: output,
		Time:   time.Now(),
	})
}

// Summary generates compact text context using recent entries.
func (c *Context) Summary(maxEntries, maxOutputLen int) string {
	if len(c.Entries) == 0 || maxEntries <= 0 {
		return ""
	}

	start := 0
	if len(c.Entries) > maxEntries {
		start = len(c.Entries) - maxEntries
	}

	var builder strings.Builder
	for _, entry := range c.Entries[start:] {
		agent := entry.Agent
		if agent == "" {
			agent = "unknown"
		}

		output := entry.Output
		if maxOutputLen > 0 && len(output) > maxOutputLen {
			output = output[:maxOutputLen] + "...(truncated)"
		}

		builder.WriteString(fmt.Sprintf("[%s] User: %s\n", agent, entry.Input))
		builder.WriteString(fmt.Sprintf("[%s] Response:\n%s\n\n", agent, output))
	}

	return strings.TrimSuffix(builder.String(), "\n")
}
