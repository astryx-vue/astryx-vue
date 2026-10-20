---
title: CLI
---

# CLI

`@astryx-vue/cli` looks up astryx-vue component docs from the terminal, for people and for agents. The binary is `astryx-vue`. It is not Meta's `astryx` command, and it does not speak React or StyleX.

Install it as a dev dependency:

```sh
pnpm add -D @astryx-vue/cli
```

```sh
npm install -D @astryx-vue/cli
```

```sh
yarn add -D @astryx-vue/cli
```

Call it through a project script so the path stays stable:

```json
{
  "scripts": {
    "astryx-vue": "node node_modules/@astryx-vue/cli/bin/astryx-vue.mjs"
  }
}
```

```sh
npm run astryx-vue -- component Button
```

## Commands

`astryx-vue component --list` lists the documented components. `astryx-vue component Button` prints one component's usage, props, slots, events, and examples. `astryx-vue search dialog` ranks components and guide topics. `astryx-vue manifest --json` describes the commands, options, response types, and exit codes. `astryx-vue init --features agents` writes the agent context file.

## Flags

`--json` prints a typed envelope on stdout. `--dense` shortens the text people read; together with `--json` it is ignored, and the envelope stays complete. `--zh` uses Simplified Chinese where this site has a translation. `--cwd` is the directory `init` writes into.

## Agent file

`init --features agents` creates `AGENTS.md` when that file is missing. `--agent claude` writes `CLAUDE.md`. `cursor` and `codex` write `AGENTS.md`.

The command owns only the block between these markers:

```html
<!-- Maintained by astryx-vue, do not edit manually -->
...
<!-- astryx-vue block end -->
```

Every run replaces that block with freshly generated text. Text outside the markers stays. If the file exists and the markers are missing, the block is appended.

The sentences the CLI prints come from this docs site. After a docs change, regenerate the catalog in the CLI package. The maintainer steps are in the `packages/cli` README.

This version does not include theme, template, upgrade, doctor, or MCP commands.
