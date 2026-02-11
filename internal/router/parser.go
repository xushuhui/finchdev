package router

import (
	"regexp"
	"strings"
)

// ParsedInput is the parsed user input.
type ParsedInput struct {
	Agent   string
	Content string
}

var routePattern = regexp.MustCompile(`^\s*#([A-Za-z0-9_]+)(?:\s+(.*))?$`)

var allowedAgents = map[string]struct{}{
	"codex":  {},
	"claude": {},
}

// Parse parses user input following PRD routing rules.
func Parse(input string) *ParsedInput {
	if input == "" {
		return &ParsedInput{Agent: "", Content: ""}
	}

	firstLine, rest := splitFirstLine(input)
	matches := routePattern.FindStringSubmatch(firstLine)
	if matches == nil {
		return &ParsedInput{Agent: "", Content: input}
	}

	agent := strings.ToLower(matches[1])
	if _, ok := allowedAgents[agent]; !ok {
		return &ParsedInput{Agent: "", Content: input}
	}

	firstLineContent := ""
	if len(matches) > 2 {
		firstLineContent = matches[2]
	}

	content := firstLineContent
	if rest != "" {
		if content == "" {
			content = rest
		} else {
			content = content + "\n" + rest
		}
	}

	return &ParsedInput{
		Agent:   agent,
		Content: content,
	}
}

func splitFirstLine(input string) (string, string) {
	parts := strings.SplitN(input, "\n", 2)
	if len(parts) == 1 {
		return strings.TrimSuffix(parts[0], "\r"), ""
	}

	return strings.TrimSuffix(parts[0], "\r"), parts[1]
}
