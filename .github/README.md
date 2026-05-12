# Agentic Workflows (`gh-aw`)

This directory contains GitHub **agentic workflows** that automatically
translate English documentation into Japanese when changes are pushed to
`vnext`.

## Workflow files

| Source (`.md`) | Compiled (`.lock.yml`) | Watches |
|---|---|---|
| `workflows/sync-jp-docs-angular.md` | `workflows/sync-jp-docs-angular.lock.yml` | `docs/angular/src/content/en/**` on `master` |
| `workflows/sync-jp-docs-xplat.md` | `workflows/sync-jp-docs-xplat.lock.yml` | `docs/xplat/src/content/en/**` on `master` |

The `.md` files are the human-editable source. The `.lock.yml` files are
auto-generated and are what GitHub Actions actually executes. **Do not edit
`.lock.yml` files directly.**

## How to update a workflow

### Prerequisites

1. [GitHub CLI](https://cli.github.com/) installed
2. The `gh-aw` extension installed:
   ```bash
   gh extension install github/gh-aw
   ```
3. Authenticated with `gh auth login`

### Steps

1. Edit the `.md` file under `.github/workflows/`.
2. Run from the repo root:
   ```bash
   gh aw compile
   ```
   This regenerates the corresponding `.lock.yml` file(s) and updates
   `.github/aw/actions-lock.json` if action SHAs changed.
3. Commit **both** the `.md` and the `.lock.yml` together (plus
   `actions-lock.json` if it changed).
4. Push to `vnext`.

For more information: https://github.github.com/gh-aw/introduction/overview/

## Required GitHub secrets

The following secrets must be configured at the repository level
(Settings → Secrets and variables → Actions) for the agent workflows to
run:

| Secret | Required | Purpose |
|---|---|---|
| `GITHUB_TOKEN` | Auto (built-in) | Standard token — nothing to provision |
| `COPILOT_GITHUB_TOKEN` | **Yes** | Authenticates the Copilot CLI engine that drives the translation agent. Without it, the workflow fails immediately. |
| `GH_AW_GITHUB_TOKEN` | Recommended | Elevated token the agent uses to create the translation PR. Falls back to `GITHUB_TOKEN` if unset. |
| `GH_AW_GITHUB_MCP_SERVER_TOKEN` | Optional | Token for the embedded GitHub MCP read-only tools. Falls back to `GITHUB_TOKEN`. |
| `GH_AW_CI_TRIGGER_TOKEN` | Optional | Triggers CI on the auto-created PR. Only needed if you want checks to run on bot PRs. |

These are the same secrets used in the old `igniteui-docfx` and
`igniteui-xplat-docs` repositories.

