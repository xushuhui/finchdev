package router

import "testing"

func TestParse(t *testing.T) {
	tests := []struct {
		name        string
		input       string
		wantAgent   string
		wantContent string
	}{
		{
			name:        "codex route",
			input:       "#codex write server",
			wantAgent:   "codex",
			wantContent: "write server",
		},
		{
			name:        "claude route",
			input:       "#claude review this",
			wantAgent:   "claude",
			wantContent: "review this",
		},
		{
			name:        "route prefix not forwarded for multiline",
			input:       "#codex write\nmore details",
			wantAgent:   "codex",
			wantContent: "write\nmore details",
		},
		{
			name:        "unknown route passthrough",
			input:       "#foo test",
			wantAgent:   "",
			wantContent: "#foo test",
		},
		{
			name:        "escaped route passthrough",
			input:       "\\#codex hello",
			wantAgent:   "",
			wantContent: "\\#codex hello",
		},
		{
			name:        "not full token",
			input:       "#codex123 hello",
			wantAgent:   "",
			wantContent: "#codex123 hello",
		},
		{
			name:        "markdown heading no route",
			input:       "## heading",
			wantAgent:   "",
			wantContent: "## heading",
		},
		{
			name:        "no prefix uses default downstream",
			input:       "continue",
			wantAgent:   "",
			wantContent: "continue",
		},
		{
			name:        "only parse first line",
			input:       "normal text\n#codex should not route",
			wantAgent:   "",
			wantContent: "normal text\n#codex should not route",
		},
		{
			name:        "empty input",
			input:       "",
			wantAgent:   "",
			wantContent: "",
		},
		{
			name:        "route with no content",
			input:       "#claude",
			wantAgent:   "claude",
			wantContent: "",
		},
		{
			name:        "route with leading spaces",
			input:       "   #codex hello",
			wantAgent:   "codex",
			wantContent: "hello",
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			got := Parse(tc.input)
			if got.Agent != tc.wantAgent {
				t.Fatalf("agent = %q, want %q", got.Agent, tc.wantAgent)
			}
			if got.Content != tc.wantContent {
				t.Fatalf("content = %q, want %q", got.Content, tc.wantContent)
			}
		})
	}
}
