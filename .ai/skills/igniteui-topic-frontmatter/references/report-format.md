# Audit report format and apply procedure

Version: v4 · 2026-08-31 · igniteui doc-skill set. Content carried from SKILL.md v2 unchanged.

## Report format

Use this shape:

```md
# Frontmatter Audit: <topic path>

**Verdict:** <Conforms | Minor drift | Needs work | Invalid>
**Summary:** <1-2 sentences about the highest-value metadata fixes.>

## Findings
### <Error|Warning|Suggestion> · <short title>
- **Field:** `<field name>`
- **Issue:** <what is wrong>
- **Suggestion:** <specific replacement or action>

## Suggested Frontmatter Changes
| Field | Current | Suggested | Reason |
|---|---|---|---|
| `description` | ... | ... | ... |

No file changes were made. Tell me which suggestions to apply.
```

If there are no issues, say that the frontmatter conforms and do not invent changes.

## Applying selected suggestions

When the user explicitly asks to apply one or more suggestions:

1. Re-read the file.
2. Modify only the YAML frontmatter block.
3. Preserve unrelated frontmatter fields and field order where practical.
4. Do not edit body content after the closing `---`.
5. Run a focused diff check when available.
