English | [简体中文](./README.zh-CN.md)

# @astryx-vue/cli

Agent-friendly lookup for [astryx-vue](https://github.com/astryx-vue/astryx-vue), an unofficial Vue 3 port of Astryx. Not affiliated with Meta.

The binary is `astryx-vue`. This package is not Meta's CLI, and it does not provide the bare `astryx` command.

Guide: <https://astryx-vue.pages.dev/en/guide/cli>

```sh
pnpm add -D @astryx-vue/cli
```

## Running it

The package declares a `bin`, so installing it puts the command on `node_modules/.bin`. Use it directly:

```sh
npx astryx-vue component Button
pnpm exec astryx-vue search dialog --json
npx astryx-vue manifest --json
```

Without installing it, run `npx @astryx-vue/cli …` for a one-off. The scope is required: the bare `astryx-vue` name on npm is not this package, so `npx astryx-vue` fails on a machine where nothing is installed, and that name could later belong to someone else.

A script alias is optional. It is useful only when an agent shell does not have `node_modules/.bin` on `PATH`:

```json
{
  "scripts": {
    "astryx-vue": "astryx-vue"
  }
}
```

```sh
npm run astryx-vue -- component Button
```

## Commands

| Command | What it prints |
| --- | --- |
| `astryx-vue build "<idea>"` | The closest page template, two alternatives, and the components to use |
| `astryx-vue template --list` | Every page template, grouped by category, with the ones a project cannot copy marked |
| `astryx-vue template <slug>` | One template's description, components, and source |
| `astryx-vue template <slug> --skeleton` | Only the layout skeleton: component tags and layout attributes |
| `astryx-vue template <slug> <path>` | Writes the template to a file, or to `<path>/<Name>.vue` for a directory |
| `astryx-vue component --list` | Every documented component |
| `astryx-vue component <Name>` | Usage, props, slots, events, examples, and notes for one component |
| `astryx-vue composable --list` | Every documented composable, the `use*` functions |
| `astryx-vue composable <Name>` | Parameters, return values, usage, and examples for one composable |
| `astryx-vue docs` | Every guide and theme topic |
| `astryx-vue docs <topic>` | One topic's page text, such as `docs guide/dark-mode` or `docs themes/tokens` |
| `astryx-vue docs <topic> --depth <n>` | The same page, cut off below heading level `n` |
| `astryx-vue search <query>` | Ranked components, composables, docs topics, and templates |
| `astryx-vue manifest --json` | Commands, options, response types, error codes, and exit codes |
| `astryx-vue theme` | Every built-in theme, one line each |
| `astryx-vue theme <name>` | How to load one theme: stylesheet, `data-astryx-theme`, switching and scoping, verification |
| `astryx-vue upgrade` | What upgrading the project's `@astryx-vue/core` takes, and where old names still appear |
| `astryx-vue doctor` | Checks versions, the theme stylesheet, and the theme attribute. Reports only |
| `astryx-vue init` | The setup guide for an AI assistant, plus the managed block in an agent file |

Global flags:

| Flag | Effect |
| --- | --- |
| `--json` | Typed envelope `{ apiVersion, type, data }` on stdout. Errors use `{ apiVersion, error, code, suggestions? }` and a non-zero exit code. |
| `--dense` | Shorter text. Ignored with `--json`, which stays the full envelope. |
| `--zh` | Simplified Chinese where the docs have a translation. |
| `--cwd <dir>` | Project directory. Defaults to the working directory; `template` and `init` write inside it, and `upgrade`/`doctor` read it. |


## Docs

The full command reference — JSON envelopes, error codes, template rules, `init` block rules, and the maintainer steps — lives on the docs site: <https://astryx-vue.pages.dev/en/guide/cli>. The site is the only copy of that text; this README stays short on purpose.

## Programmatic use

```ts
import { assertResponse, runCli } from '@astryx-vue/cli'

const result = await runCli(['search', 'dialog', '--json'], { cwd: process.cwd() })
const found = assertResponse(result.stdout, 'search')
```

`runCli` takes the same arguments as the binary and returns `{ exitCode, stdout, stderr }`. `assertResponse` narrows the envelope to the type you expect.

## Contributing

Where the text comes from, how to regenerate the catalog, and how to run the command from a checkout are in [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT. Astryx is copyright Meta Platforms, Inc. This package is an unofficial port and is not affiliated with or endorsed by Meta.
