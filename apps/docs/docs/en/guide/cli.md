---
title: CLI
---

# CLI

`@astryx-vue/cli` looks up astryx-vue component docs and playground pages from the terminal, for people and for agents. The binary is `astryx-vue`. It is not Meta's `astryx` command, and it does not speak React or StyleX.

Install it as a dev dependency:

```sh
pnpm add -D @astryx-vue/cli
```

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

`astryx-vue docs` lists the guide and theme topics. `astryx-vue docs guide/dark-mode` prints one page's text, and `astryx-vue docs themes/tokens` works too.

`astryx-vue search dialog` ranks components, composables, docs topics, and page templates. `--type` narrows the domain to `component`, `composable`, `doc`, or `template`. `astryx-vue manifest --json` describes the commands, options, response types, error codes, and exit codes. `astryx-vue init --features agents` writes the agent context file.

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

`astryx-vue upgrade` reads the `@astryx-vue/core` version in the project's `package.json`, compares it with the version the CLI documents, and prints the sections of the [upgrade guide](/en/guide/migration) — what changed, how it was written before, how it is written now, what to do. It then looks through the project's own sources for the old names that guide replaces and lists file and line. Nothing is changed, and nothing is fetched from the network.

`astryx-vue doctor` reports five checks and edits nothing: whether core is installed and how its version compares, whether themes is installed, whether `vue` satisfies 3.5.0, whether a theme stylesheet is imported, and whether `data-astryx-theme` is set. Exit code is 0 when everything passed or only warned, and 1 when a check failed.

## Flags

`--json` prints a typed envelope on stdout. `--dense` shortens the text people read; together with `--json` it is ignored, and the envelope stays complete. `--zh` uses Simplified Chinese where this site has a translation. `--cwd` is the project directory `template` and `init` write inside.

The template `--json` types are `template.list`, `template.show`, `template.skeleton`, and `template.copy`; `build` returns `build.help` and `build.kit`. Errors carry a code such as `ERR_UNKNOWN_TEMPLATE`, `ERR_TEMPLATE_NOT_READY`, `ERR_FILE_EXISTS`, or `ERR_PATH_TRAVERSAL`.

## Agent file

`init` prints the setup guide — which packages to install (a canary package takes `@canary`), the theme import, the locale snippet, and what to verify — and writes the managed block below. It creates `AGENTS.md` when no agent file exists. Without `--agent`, an agent file the project already has is reused, in the order `AGENTS.md`, `CLAUDE.md`, `.cursorrules`, `.hermes.md`, `HERMES.md`. `--agent claude` writes `CLAUDE.md`, `hermes` writes `.hermes.md` (or `HERMES.md` when the project already has one), `cursor` and `codex` write `AGENTS.md`, and `all` writes every known file that exists. `--agent-docs-path <file>` writes exactly that file.

The command owns only the block between these markers:

```html
<!-- Maintained by astryx-vue, do not edit manually -->
...
<!-- astryx-vue block end -->
```

Every run replaces that block with freshly generated text. Text outside the markers stays. If the file exists and the markers are missing, the block is appended.

The block names every package the CLI documents, marks the canary ones, then describes a three-step workflow: run `build` to pick a page, run `template` to copy it, then run `component`, `composable`, or `docs` before writing code. It also says how to invoke the binary.

The install command follows the project's package manager: the `packageManager` field first, then a lockfile. When neither says which manager it is, all four forms are printed.

The sentences the CLI prints come from this docs site and from the playground pages. After a docs or template change, regenerate the catalog in the CLI package. The maintainer steps are in the `packages/cli` README.

This version does not include `swizzle`, `discover`, `gap-report`, `integration`, or `blog`, and there is no MCP server.
