---
title: Working with AI
---

# Working with AI

An AI writing component code makes two mistakes more than any other: it guesses props, and it copies React idioms from upstream. One instruction file and one command line tool block both.

Two pieces:

- A note in the repo that tells the AI where to look and what not to write.
- A CLI that hands the AI the real props, slots, and examples on demand.

## Step 1: install the CLI

```sh
pnpm add -D @astryx-vue/cli
```

The binary lands in `node_modules/.bin` and is called `astryx-vue`. Without installing, run `npx @astryx-vue/cli …`; the scope is required, because the bare `astryx-vue` name on npm is not this package.

## Step 2: write the instruction file

```sh
pnpm exec astryx-vue init --features agents
```

This writes a managed note into the project. With no `--agent` it picks the file the project already has, in this order: `AGENTS.md`, `CLAUDE.md`, `.cursorrules`, `.hermes.md`, `HERMES.md`. When none exists it creates `AGENTS.md`.

Which file for which tool:

| Tool | How to write it |
| --- | --- |
| Claude Code | `--agent claude`, writes `CLAUDE.md` |
| Codex, Cursor | `--agent codex` or `--agent cursor`, writes `AGENTS.md` |
| A repo that already has a file | No `--agent`; the existing file is reused |
| Anything else | `--agent-docs-path <file>` names the file |

GitHub Copilot reads `.github/copilot-instructions.md`. The CLI does not write that file by default; point it there with `--agent-docs-path .github/copilot-instructions.md`. Relative paths resolve against the project directory, and a path that lands outside it is refused.

## What goes into the file

The text sits between two markers.

```html
<!-- Maintained by astryx-vue, do not edit manually -->
...
<!-- astryx-vue block end -->
```

Inside the block are four parts.

1. **What the project uses.** astryx-vue is an unofficial Vue 3 community port of Astryx. Components come from `@astryx-vue/core`, themes from `@astryx-vue/themes`. Do not use Meta's React packages, StyleX, or the bare `astryx` command.
2. **A three-step workflow.** Find a template with `build`, copy it with `template`, and look things up with `component`, `composable`, and `docs` before writing code.
3. **How to look things up.** `component --list`, `composable --list`, `docs <topic>`, `search`, and `manifest --json`, plus the `--json`, `--zh`, and `--dense` flags.
4. **How to run it, plus a few conventions.** Subpath imports, peer dependencies, and that the styles do not need UnoCSS.

Run the same command again to refresh. Only the text between the two markers is replaced; project rules you wrote outside them are left alone.

## Let the AI look things up

The instruction file only points the way. The answers live in the CLI. Hand these to the AI, or put them in your project rules.

```sh
# Which components exist
pnpm exec astryx-vue component --list

# One component's usage, props, slots, events, and examples
pnpm exec astryx-vue component Button

# A composable's parameters and return value
pnpm exec astryx-vue composable useClipboard

# One guide or theme topic
pnpm exec astryx-vue docs guide/dark-mode

# Search components, docs, and templates together
pnpm exec astryx-vue search "date picker"
```

Add `--json` when a script or agent reads the output: the reply is a typed envelope, and errors use the same shape with a non-zero exit code. `--dense` shortens the text for humans; `--zh` answers in Simplified Chinese.

Once the AI looks things up before it writes, invented props mostly stop happening.

## Starting from a template beats starting from nothing

```sh
pnpm exec astryx-vue build "order detail page, list on the left, detail on the right"
pnpm exec astryx-vue template --list
pnpm exec astryx-vue template order-detail ./src/pages
```

`build` scores keywords locally and answers with the closest template, two alternatives, and the components to use. No network, no external model. `template <slug> <dir>` writes `<Name>.vue`, swaps the demo photos for a grey placeholder, and reports which packages the project is still missing.

An existing file is never overwritten; pass `--overwrite` (or `-f`) to replace it.

## Rules worth giving the AI

These lines do more than a page of explanation.

- Run `astryx-vue component <Name>` before writing a component. Do not write props from memory.
- Import from `@astryx-vue/core/<Subpath>` or the package root only. Do not use Meta's `@astryxdesign/*` packages.
- Style with a theme plus `var(--astryx-*)` variables. No hex colors and no pixel values.
- Write padding once, on `Layout` or `AppShell`. Do not add another `div` with padding at each level. See [Page layout](/en/guide/layout).
- When a component's behavior is unclear, find the topic with `astryx-vue docs`. Do not invent an API.

## Next

- Every CLI flag and exit code: [CLI](/en/guide/cli).
- Which files `init` writes and how the markers work: the "Agent file" section of [CLI](/en/guide/cli).
