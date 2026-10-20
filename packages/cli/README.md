English | [简体中文](./README.zh-CN.md)

# @astryx-vue/cli

Agent-friendly lookup for [astryx-vue](https://github.com/astryx-vue/astryx-vue), an unofficial Vue 3 port of Astryx. Not affiliated with Meta.

The binary is `astryx-vue`. This package is not Meta's CLI, and it does not provide the bare `astryx` command.

Guide: <https://astryx-vue.pages.dev/en/guide/cli>

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
npm run astryx-vue -- composable useClipboard
npm run astryx-vue -- docs guide/dark-mode
npm run astryx-vue -- search dialog --json
npm run astryx-vue -- manifest --json
```

## Commands

| Command | What it prints |
| --- | --- |
| `astryx-vue component --list` | Every documented component |
| `astryx-vue component <Name>` | Usage, props, slots, events, examples, and notes for one component |
| `astryx-vue composable --list` | Every documented composable, the `use*` functions |
| `astryx-vue composable <Name>` | Parameters, return values, usage, and examples for one composable |
| `astryx-vue docs` | Every guide and theme topic |
| `astryx-vue docs <topic>` | One topic's page text, such as `docs guide/dark-mode` or `docs themes/tokens` |
| `astryx-vue search <query>` | Ranked components, composables, and docs topics |
| `astryx-vue manifest --json` | Commands, options, response types, and exit codes |
| `astryx-vue init --features agents` | Creates or refreshes the managed block in `AGENTS.md` |

Global flags:

| Flag | Effect |
| --- | --- |
| `--json` | Typed envelope `{ apiVersion, type, data }` on stdout. Errors use `{ apiVersion, error, code, suggestions? }` and a non-zero exit code. |
| `--dense` | Shorter text. Ignored with `--json`, which stays the full envelope. |
| `--zh` | Simplified Chinese where the docs have a translation. |
| `--cwd <dir>` | Directory `init` writes into. |

A composable takes `useClipboard` or `use-clipboard`. `component useClipboard` still prints it, and adds a line that points at the `composable` command. `component --list` lists components only. `search --type` accepts `component`, `composable`, or `doc`; composable hits carry `domain: "composable"` and a `command` that points at `composable <Name>`.

`docs` takes a topic id, the same id with `themes/` instead of `theme/`, or a bare name that matches one topic, such as `dark-mode`. `--json` returns `docs.list` or `docs.detail`, and `docs.detail` includes the page `body`.

`init` accepts `--agent cursor|claude|codex`. `cursor` and `codex` write `AGENTS.md`. `claude` writes `CLAUDE.md`. The default file is `AGENTS.md`.

Exit codes are `0` for success, `1` when the command ran but failed, and `2` for invalid usage. Branch on `code` in the JSON envelope, not on the message text.

## Agent block

`init --features agents` writes this managed block:

```html
<!-- Maintained by astryx-vue, do not edit manually -->
...
<!-- astryx-vue block end -->
```

If the file is missing, the command creates it. If the markers are already there, every run replaces only the block with freshly generated text. Other text stays. If the file exists without the markers, the block is appended. A second run still rewrites the block; it does not skip because the markers are already present. When the generated text matches, the bytes stay the same.

The block tells an agent how to query the CLI. It does not paste the component catalog.

## Where the text comes from

The CLI does not keep a second copy of the component docs. `packages/cli/scripts/generate-catalog.mjs` reads:

- `apps/docs/components/demos/*/meta.ts` for names, groups, and order
- `apps/docs/docs/{en,zh}/components/<slug>/` for usage, props, slots, events, and example titles
- `apps/docs/components/demos/<slug>/*.vue` for the example source those pages point at
- `apps/docs/components/demo-infra/reference/*.json` for anatomy and accessibility
- `apps/docs/docs/{en,zh}/guide` and `themes` for search topics and topic bodies
- `packages/core/package.json` exports when a page does not show an import

The result is committed at `packages/cli/src/generated/catalog.json`. `pnpm --filter @astryx-vue/cli build` regenerates it and bundles it into `dist`, which is what the published tarball runs. After a docs change, regenerate it and commit the diff:

```sh
pnpm --filter @astryx-vue/cli generate
```

`pnpm check` runs `generate:check`. That fails when `catalog.json` is stale, and when a PascalCase `@astryx-vue/core` export is not imported by any documented component. `./icons`, `./locale`, CSS, and the package root are not component exports.

Theme, template, upgrade, doctor, swizzle, and MCP commands are not part of this package.

## Related packages

| Package | What it is |
| --- | --- |
| `@astryx-vue/core` | The Vue components this CLI documents |
| `@astryx-vue/themes` | Neutral, Butter, Chocolate, Gothic, Matcha, Stone, and Y2K |

## Try it in this repo

```sh
pnpm --filter @astryx-vue/cli build
node packages/cli/bin/astryx-vue.mjs component Button
node packages/cli/bin/astryx-vue.mjs composable useClipboard
node packages/cli/bin/astryx-vue.mjs docs guide/dark-mode --dense
node packages/cli/bin/astryx-vue.mjs search installation --type doc
node packages/cli/bin/astryx-vue.mjs manifest --json
```

## License

MIT. Astryx is copyright Meta Platforms, Inc. This package is an unofficial port and is not affiliated with or endorsed by Meta.
