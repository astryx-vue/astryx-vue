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
| `astryx-vue search <query>` | Ranked components, composables, docs topics, and templates |
| `astryx-vue manifest --json` | Commands, options, response types, error codes, and exit codes |
| `astryx-vue init --features agents` | Creates or refreshes the managed block in an agent file |

Global flags:

| Flag | Effect |
| --- | --- |
| `--json` | Typed envelope `{ apiVersion, type, data }` on stdout. Errors use `{ apiVersion, error, code, suggestions? }` and a non-zero exit code. |
| `--dense` | Shorter text. Ignored with `--json`, which stays the full envelope. |
| `--zh` | Simplified Chinese where the docs have a translation. |
| `--cwd <dir>` | Project directory. Defaults to the working directory; `template` and `init` write inside it. |

A composable takes `useClipboard` or `use-clipboard`. `component useClipboard` still prints it, and adds a line that points at the `composable` command. `component --list` lists components only. `search --type` accepts `component`, `composable`, `doc`, or `template`; composable hits carry `domain: "composable"` and a `command` that points at `composable <Name>`. A query that hits a name outranks one that only hits page text.

`docs` takes a topic id, the same id with `themes/` instead of `theme/`, or a bare name that matches one topic, such as `dark-mode`. `--json` returns `docs.list` or `docs.detail`, and `docs.detail` includes the page `body`.

## Templates

`template --list` prints all 53 playground pages. `--type page` is the only kind today; `--type block` answers with a note instead of an error.

Every template carries a hand-written one-sentence description and a keyword list in English and Chinese, in `src/generate/template-meta.ts`. The component list is extracted from the page's `@astryx-vue/core` imports, so it cannot drift from the source.

Some pages import a package a project cannot install: five use `@astryx-vue/playground-charts`, a path alias that only exists inside the docs playground. Those are marked `isReady: false` with the reason. A page is ready when every non-relative import it really performs is `vue` or `@astryx-vue/core`; text inside a code sample the page displays, such as `@astryxdesign/core`, is page content and does not count. `--list` and `template <slug>` still show them; copying is refused with `ERR_TEMPLATE_NOT_READY`.

`template <slug> <path>` writes one file:

- a path that ends in a file name, or that already names a file, is the target file;
- anything else is a directory and receives `<PascalCaseSlug>.vue`;
- an existing file is only replaced with `--overwrite` (or `-f`), otherwise `ERR_FILE_EXISTS`;
- a path outside the project directory is refused with `ERR_PATH_TRAVERSAL`.

Copying rewrites the playground's `/template-assets/…` photo paths to an inline grey placeholder and reports how many it replaced, so the file renders without the docs site. It does not copy any asset and does not install anything: it names the packages the project's `package.json` does not list, plus an install command with the lockfile's package manager.

`--skeleton` prints the component tags with layout attributes only: `gap`, `padding`, `width`, `maxWidth`, `height`, `columns`, `axis`, `justify`, `align`, `density`, `variant`, `hasDivider`, and the `rowGap`/`columnGap`/`contentPadding`/`minHeight` variants. Text, bindings other than layout, event handlers, and native HTML wrappers are dropped, so a page positioned with plain `<div>` reads flatter than it renders. The skeleton is a structure reference, not a compilable file.

## Build

`build "<idea>"` ranks the templates locally: field-weighted keyword matching over slug, title, description, keywords, and the components a page uses, with rare words counting more than common ones. No network, no model, same answer every run. Chinese is matched by character pairs, so no spaces are needed.

- `TEMPLATE` is the closest page. `OTHER TEMPLATES` is the next two. A page that cannot be copied keeps its place only when it answers the idea clearly better, and it is marked with the reason.
- `COMPONENTS` (up to 6) and `COMPOSABLES` (up to 4) come from the same ranking `search` uses, so the two commands cannot disagree. When the idea names fewer pieces than the limit, the recommended page's own components fill the rest, marked as such.
- A weak match is dropped rather than padded. An idea nothing matches returns no template and says so.
- `build` with no idea prints the workflow: find a template, copy it, then look up each component before writing code.

## JSON envelopes

Success responses are `{ apiVersion: 1, type, data }`. Template and build responses also carry `package: "@astryx-vue/cli"`.

| Type | Command |
| --- | --- |
| `template.list`, `template.show`, `template.skeleton`, `template.copy` | `template` |
| `build.help`, `build.kit` | `build` |
| `component.list`, `component.detail` | `component` |
| `composable.list`, `composable.detail` | `composable` |
| `docs.list`, `docs.detail` | `docs` |
| `search` | `search` |
| `manifest` | `manifest` |
| `init.run` | `init` |
| `help`, `version` | `--help`, `--version`, or no arguments with `--json` |

Exit codes are `0` for success, `1` when the command ran but failed, and `2` for invalid usage. Branch on `code` in the JSON envelope, not on the message text.

| Code | When |
| --- | --- |
| `ERR_UNKNOWN_TEMPLATE` | No template matches the slug. Up to five close slugs come back as suggestions. |
| `ERR_TEMPLATE_NOT_READY` | The template imports a package the project cannot install. |
| `ERR_FILE_EXISTS` | The target file exists and `--overwrite` was not passed. |
| `ERR_PATH_TRAVERSAL` | A target path resolves outside the project directory. |
| `ERR_INVALID_ARGUMENT` | Two modes were combined, a value is outside its choices, or the idea is blank. |
| `ERR_UNKNOWN_COMPONENT`, `ERR_UNKNOWN_COMPOSABLE`, `ERR_UNKNOWN_TOPIC` | No record matches the name. |
| `ERR_UNKNOWN_AGENT` | `--agent` is not `cursor`, `claude`, `codex`, `hermes`, or `all`. |
| `ERR_UNKNOWN_FEATURE` | `--features` names something other than `agents`. |

`manifest --json` carries the same list per command, so an agent can read the codes without this table.

## Agent block

`init --features agents` writes this managed block:

```html
<!-- Maintained by astryx-vue, do not edit manually -->
...
<!-- astryx-vue block end -->
```

If the file is missing, the command creates it. If the markers are already there, every run replaces only the block with freshly generated text. Other text stays. If the file exists without the markers, the block is appended. A second run still rewrites the block; it does not skip because the markers are already present. When the generated text matches, the bytes stay the same.

The block teaches the three-step workflow (`build` to pick a page, `template` to copy it, `component`/`composable`/`docs` before writing code), lists the lookup commands, and says how to run the binary. It does not paste the component catalog.

Where it writes:

- no `--agent`: the first agent file the project already has, in the order `AGENTS.md`, `CLAUDE.md`, `.cursorrules`, `.hermes.md`, `HERMES.md`; `AGENTS.md` when none exists;
- `--agent cursor` or `--agent codex`: `AGENTS.md`;
- `--agent claude`: `CLAUDE.md`;
- `--agent hermes`: `.hermes.md`, or `HERMES.md` when the project already has that file;
- `--agent all`: every known file that exists, or `AGENTS.md` when none does;
- `--agent-docs-path <file>`: exactly that file, relative to the project directory. Missing directories are created; a path outside the project is refused with `ERR_PATH_TRAVERSAL`.

## Where the text comes from

The CLI does not keep a second copy of the component docs. `packages/cli/scripts/generate-catalog.mjs` reads:

- `apps/docs/components/demos/*/meta.ts` for names, groups, and order
- `apps/docs/docs/{en,zh}/components/<slug>/` for usage, props, slots, events, and example titles
- `apps/docs/components/demos/<slug>/*.vue` for the example source those pages point at
- `apps/docs/components/demo-infra/reference/*.json` for anatomy and accessibility
- `apps/docs/docs/{en,zh}/guide` and `themes` for search topics and topic bodies
- `apps/docs/components/playground/pages/*.vue` for the template sources, and `templateManifest.ts` for their titles and categories
- `packages/core/package.json` exports when a page does not show an import

The template descriptions and keywords are hand-written in `packages/cli/src/generate/template-meta.ts`. They are source data, not a generated file.

Example titles and descriptions are kept once per language, but the example code is stored once for both: both pages point at the same `.vue` file. The generator stops with an error naming the component and the example number if the two pages ever show different code, so one language cannot silently borrow the other's snippet. `examplesFor()` in `packages/cli/src/catalog.ts` is the only place that picks a language back out.

The result is committed at `packages/cli/src/generated/catalog.json`. `pnpm --filter @astryx-vue/cli build` regenerates it and bundles it into `dist`, which is what the published tarball runs. After a docs or template change, regenerate it and commit the diff:

```sh
pnpm --filter @astryx-vue/cli generate
```

`pnpm check` runs `generate:check`. That fails when `catalog.json` is stale, when a PascalCase `@astryx-vue/core` export is not imported by any documented component, and when a playground page has no metadata in `template-meta.ts`. `./icons`, `./locale`, CSS, and the package root are not component exports.

Theme, upgrade, doctor, swizzle, and MCP commands are not part of this package.

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
node packages/cli/bin/astryx-vue.mjs template --list
node packages/cli/bin/astryx-vue.mjs template login-card --skeleton
node packages/cli/bin/astryx-vue.mjs build "login page with SSO"
node packages/cli/bin/astryx-vue.mjs search login --type template
node packages/cli/bin/astryx-vue.mjs manifest --json
```

## License

MIT. Astryx is copyright Meta Platforms, Inc. This package is an unofficial port and is not affiliated with or endorsed by Meta.
