English | [简体中文](./README.zh-CN.md)

# @astryx-vue/cli

Agent-friendly CLI for [astryx-vue](https://github.com/astryx-vue/astryx-vue), the Vue 3 community port of Astryx.

The binary name is `astryx-vue`. This package is not Meta's CLI, and it does not provide the bare `astryx` command.

```sh
pnpm add -D @astryx-vue/cli
```

## Script alias

Agents should call a project script so the binary path stays stable:

```json
{
  "scripts": {
    "astryx-vue": "node node_modules/@astryx-vue/cli/bin/astryx-vue.mjs"
  }
}
```

```sh
npm run astryx-vue -- component Button
npm run astryx-vue -- search dialog --json
npm run astryx-vue -- manifest --json
```

## Commands

| Command | What it prints |
| --- | --- |
| `astryx-vue component --list` | Every documented component |
| `astryx-vue component <Name>` | Usage, props, slots, events, and notes for one component |
| `astryx-vue search <query>` | Ranked components and guide topics |
| `astryx-vue manifest --json` | Commands, options, response types, and exit codes |
| `astryx-vue init --features agents` | Creates or refreshes the managed block in `AGENTS.md` |

Global flags:

| Flag | Effect |
| --- | --- |
| `--json` | Typed envelope `{ apiVersion, type, data }` on stdout. Errors use `{ apiVersion, error, code, suggestions? }` and a non-zero exit code. |
| `--dense` | Shorter text. Ignored with `--json`, which stays the full envelope. |
| `--zh` | Simplified Chinese where the docs have a translation. |
| `--cwd <dir>` | Directory `init` writes into. |

`init` accepts `--agent cursor|claude|codex`. `cursor` and `codex` write `AGENTS.md`. `claude` writes `CLAUDE.md`. The default file is `AGENTS.md`.

Exit codes are `0` for success, `1` when the command ran but failed, and `2` for invalid usage. Branch on `code` in the JSON envelope, not on the message text.

## Agent block

`init --features agents` writes this managed block:

```html
<!-- Maintained by astryx-vue, do not edit manually -->
...
<!-- astryx-vue block end -->
```

If the file is missing, the command creates it. If the markers are already there, only the block is replaced. Other text stays. If the file exists without the markers, the block is appended. Running it again with the same flags leaves the file unchanged.

The block tells an agent how to query the CLI. It does not paste the component catalog.

## Where the text comes from

The CLI does not keep a second copy of the component docs. `packages/cli/scripts/generate-catalog.mjs` reads:

- `apps/docs/components/demos/*/meta.ts` for names, groups, and order
- `apps/docs/docs/{en,zh}/components/<slug>/` for usage, props, slots, and events
- `apps/docs/components/demo-infra/reference/*.json` for anatomy and accessibility
- `apps/docs/docs/{en,zh}/guide` and `themes` for search topics
- `packages/core/package.json` exports when a page does not show an import

The result is committed at `packages/cli/src/generated/catalog.json`. After a docs change, regenerate it and commit the diff:

```sh
pnpm --filter @astryx-vue/cli generate
```

`pnpm check` runs `generate:check` and fails if the file is stale.

Theme, template, upgrade, doctor, swizzle, and MCP commands are not part of this package.

## Try it in this repo

```sh
pnpm --filter @astryx-vue/cli build
node packages/cli/bin/astryx-vue.mjs component Button
node packages/cli/bin/astryx-vue.mjs search installation --type doc
node packages/cli/bin/astryx-vue.mjs manifest --json
```
