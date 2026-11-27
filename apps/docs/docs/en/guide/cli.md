---
title: CLI
---

# CLI

`@astryx-vue/cli` looks up astryx-vue component docs and playground pages from the terminal, for people and for agents. The binary is `astryx-vue`. It is not Meta's `astryx` command, and it does not speak React or StyleX.

Install it as a dev dependency:

::: code-group
```sh [pnpm]
pnpm add -D @astryx-vue/cli
```

```sh [npm]
npm install -D @astryx-vue/cli
```

```sh [yarn]
yarn add -D @astryx-vue/cli
```

```sh [bun]
bun add -d @astryx-vue/cli
```
:::

The package declares a `bin`, so the command is on `node_modules/.bin` right after installing:

```sh
pnpm exec astryx-vue component Button
npx astryx-vue search dialog --json
```

Without installing it, run `npx @astryx-vue/cli …`. The scope is required: the bare `astryx-vue` name on npm is not this package.

A script alias is optional, and only useful when an agent shell does not have `node_modules/.bin` on `PATH`:

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

`astryx-vue component --list` lists the documented components. `astryx-vue component Button` prints one component's usage, props, slots, events, and examples.

`astryx-vue composable --list` lists the composables, and `astryx-vue composable useClipboard` prints one composable's parameters and return values. Vue calls these functions composables, so the CLI never says hook. `component useClipboard` still finds it and points at the `composable` command.

`astryx-vue docs` (or `astryx-vue docs --list`) lists the guide and theme topics. `astryx-vue docs guide/dark-mode` prints one page's text, and `astryx-vue docs themes/tokens` works too. Spaces, dashes, slashes, and dots all separate the words of a name and their order does not matter, so `docs mode dark` opens the same page. A name that opens nothing suggests the pages that carry its words in their name or keywords. In text, a failed lookup prints the suggestions under the message: `Did you mean:` for names that nearly match and `Run:` for a command that does the job, the same ones `--json` carries in `suggestions`. A word from another tool's command line (`components`, `list`, `props Button`, `migrate`) or an output option such as `--format json` names the run that works here, and a `template` or `docs` lookup of a name that nearly spells a composable points to `astryx-vue composable <name>`.

`astryx-vue search dialog` ranks components, composables, docs topics, and page templates. `--type` narrows the domain to `component`, `composable`, `doc`, or `template`. Other libraries' names find the matching component (`ScrollArea`, `side sheet`, `toggle group`), and glyph names such as `cog` find `Icon`. Among results with the same score, the one that answers more of the query comes first, and a word that starts a family (`tabs`) lists `Tab` and then its parts. A lookup that finds nothing (`astryx-vue docs Button`) points to the command that has the name (`astryx-vue component Button`); a keyword such as `ScrollArea` never opens a component, it comes back as the first suggestion. `astryx-vue manifest --json` describes the commands, options, response types, error codes, and exit codes. `astryx-vue init --features agents` writes the agent context file.

## Templates

`astryx-vue template --list` lists the 57 playground pages, grouped by category. Every template is a page today; `--type block` answers with a note rather than an error. Each line says what the page needs: a ready template names only `vue` and `@astryx-vue/core`, so copying one leaves no install step.

`astryx-vue template login-card` prints one template's description, the components it uses, the packages it needs, and its source. `--skeleton` prints only the layout skeleton: component tags with layout attributes such as `gap`, `padding`, and `columns`, without text, handlers, or native HTML wrappers.

`astryx-vue template login-card ./src/pages` writes `src/pages/LoginCard.vue`. A path that ends in a file name is the file itself. An existing file is only replaced with `--overwrite` (or `-f`), and a path outside the project is refused. Copying rewrites the playground's demo photo paths to an inline grey placeholder and reports how many it replaced; it does not copy assets and does not install anything, it only names the packages the project is missing.

A few templates import something a project cannot install, such as the playground-only `@astryx-vue/playground-charts` alias. They are marked not ready: you can read them, and copying is refused with the reason.

## Build

`astryx-vue build "<idea>"` turns one sentence into a starting point: the closest page template, two alternatives, and the components to use, each with the command to run next. It also lists composables separately.

The ranking is local and deterministic: keyword matching over each template's slug, title, description, keywords, and components, with rare words weighted higher. There is no network call and no model. Chinese is matched by character pairs, so no spaces are needed.

`astryx-vue build` with no idea prints the workflow: pick a page, copy it, then look up each component before writing code.

## Themes

`astryx-vue theme` lists the built-in themes. `astryx-vue theme butter` prints the four steps that load one: the stylesheet import, the `data-astryx-theme` attribute, how to switch themes or run two side by side, and how to check the result. The steps are this site's own theme pages, so the command and the docs cannot disagree. It writes nothing.

## Upgrading and checking a project

`astryx-vue upgrade` reads the `@astryx-vue/core` version in the project's `package.json`, compares it with the version the CLI documents, and prints the sections of the [upgrade guide](/en/guide/migration) — what changed, how it was written before, how it is written now, what to do. It then looks through the project's own sources for the old names that guide replaces and lists file and line. When the project is behind, it also prints one command that moves the project's `@astryx-vue/core` and every other package it lists that is released with core (such as the themes) to the CLI's version. Nothing is changed, and nothing is fetched from the network.

`astryx-vue doctor` reports five checks and edits nothing: whether core is installed and how its version compares, whether themes is installed, whether `vue` satisfies 3.5.0, whether a theme stylesheet is imported, and whether a theme is set — a `data-astryx-theme` attribute, `dataset.astryxTheme` in a script, or a `<Theme>` from core, whose outermost instance writes the attribute. Exit code is 0 when everything passed or only warned, and 1 when a check failed.

In a project that lists core, a sixth check, `button-actions`, reads the templates of the project's own `.vue` files and names each core `Button` or `IconButton` that does nothing when pressed: no `@click`, `click-action`, `href`, or `submit`/`reset` type, an empty handler such as `@click="() => {}"`, or a link that goes nowhere (`""`, `#`, `javascript:`; `#` is fine in an app that routes by the hash). It only judges a button when nothing around it can act on a press: every element around it, in its own file and in each file that renders that component, is plain HTML with no handler, a core layout component such as `Stack` or `Card`, or a Vue wrapper such as `Transition`. A button it cannot read fully is left out: one with spread props, a `ref`, an `id`, a `tooltip`, a disabled or loading state, slot content, or a component it cannot follow (a route table, a lazy load, an auto-imported tag). Test, story and fixture files are skipped. The check is a warning and never fails `doctor`; it reports `info` and judges nothing when the app listens for a press through the DOM (`addEventListener('click', …)`, `useEventListener`, an `onclick` property).

A failed package check prints the command that fixes it, in the project's package manager. A missing themes package is named at the project's core release, because the two packages version together, and saved exactly (`-E`) when the project pins core to one version. A package that `package.json` lists but no `node_modules` folder holds, as in a fresh clone, gets the project's own install (`pnpm install`) instead, so the versions the project lists stay as they are.

## Flags

`--json` prints a typed envelope on stdout. `--dense` shortens the text people read; together with `--json` it is ignored, and the envelope stays complete. `--zh` uses Simplified Chinese where this site has a translation. `--cwd` is the project directory `template` and `init` write inside.

No command asks a question, so there is nothing to confirm. A `--yes`, `-y`, `--non-interactive`, or `--no-input` is refused with exit code 2, and the error names the same command without it.

The template `--json` types are `template.list`, `template.show`, `template.skeleton`, and `template.copy`; `build` returns `build.help` and `build.kit`. Errors carry a code such as `ERR_UNKNOWN_TEMPLATE`, `ERR_TEMPLATE_NOT_READY`, `ERR_FILE_EXISTS`, or `ERR_PATH_TRAVERSAL`.

## Agent file

`init` prints the setup guide — which packages to install (a canary package takes `@canary`, once it is on npm), the theme import, the locale snippet, and what to verify — and writes the managed block below. It creates `AGENTS.md` when no agent file exists. Without `--agent`, an agent file the project already has is reused, in the order `AGENTS.md`, `CLAUDE.md`, `.cursorrules`, `.hermes.md`, `HERMES.md`. `--agent claude` writes `CLAUDE.md`, `hermes` writes `.hermes.md` (or `HERMES.md` when the project already has one), `cursor` and `codex` write `AGENTS.md`, and `all` writes every known file that exists. `--agent-docs-path <file>` writes exactly that file. `astryx-vue init --remove-agents` takes the managed block back out of the agent files at the project root (or out of the one file `--agent-docs-path` names) and deletes a file the block was all of; it does not combine with `--features` or `--agent`.

The command owns only the block between these markers:

```html
<!-- Maintained by astryx-vue, do not edit manually -->
...
<!-- astryx-vue block end -->
```

Every run replaces that block with freshly generated text. Text outside the markers stays. If the file exists and the markers are missing, the block is appended. A file whose block is already current is not written, and the output says so for each file: created, appended, updated, or already current. The `--json` receipt has the same per file in `files[].action` (`created`, `appended`, `updated`, `unchanged`), and `agentDocsStatus` says how the agent files stood before the run: `missing`, `stale`, or `current` (null when no agent file was written).

When every agent file is already current, the project went through this setup before, so the text output prints `build` and `search` and where the install steps are, instead of the whole guide. `--json` still carries the whole guide.

A file the command cannot read or write fails with `ERR_WRITE_FAILED`, and the message names the file, the reason (such as `permission denied (EACCES)`), and what to change.

The block names every package the CLI documents, marks the canary ones, and says plainly when a package is not on npm yet — those get no install command, so nobody is sent to a missing package. Then it describes a three-step workflow: run `build` to pick a page, run `template` to copy it, then run `component`, `composable`, or `docs` before writing code. It also says how to invoke the binary.

The install command follows the project's package manager: the `packageManager` field first, then a lockfile. When neither says which manager it is, all four forms are printed. The install step names only what `package.json` does not list yet: themes at the project's core release when core is already there, or the project's own install when both are listed but not installed.

The sentences the CLI prints come from this docs site and from the playground pages. After a docs or template change, regenerate the catalog in the CLI package. The maintainer steps are in `packages/cli/CONTRIBUTING.md`.

## From code

`runCli` takes the same arguments as the binary and returns `{ exitCode, stdout, stderr }`:

```ts
import { assertResponse, runCli } from '@astryx-vue/cli'

const result = await runCli(['search', 'dialog', '--json'], { cwd: process.cwd() })
const found = assertResponse(result.stdout, 'search')
```

`assertResponse` narrows the envelope to the type you expect. `parseResponse` returns the envelope without asserting, and `isError` checks one.

This version does not include `swizzle`, `discover`, `gap-report`, `integration`, or `blog`, and there is no MCP server.
