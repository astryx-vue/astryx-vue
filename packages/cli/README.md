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

A composable takes `useClipboard` or `use-clipboard`. `component useClipboard` still prints it, and adds a line that points at the `composable` command. `component --list` lists components only. `search --type` accepts `component`, `composable`, `doc`, or `template`; composable hits carry `domain: "composable"` and a `command` that points at `composable <Name>`. A query that hits a name outranks one that only hits page text. Each result names the package it comes from, ranked by score and then, when scores tie, by domain (component, composable, doc, template) and name, so the order never moves between runs.

`docs` takes a topic id, the same id with `themes/` instead of `theme/`, or a bare name that matches one topic, such as `dark-mode`. `--json` returns `docs.list` or `docs.detail`, and `docs.detail` includes the page `body`. `--depth 2` keeps `#` and `##` and drops every deeper heading with the body under it, which is how a long page stays readable; `headings` in the JSON lists only the headings that survived, and `depth` says what was asked for.

## Themes

`theme` lists the seven shipped themes with their own one-sentence summaries. `theme <name>` prints the four steps that load one: the stylesheet import, the `data-astryx-theme` attribute, how switching or running two side by side works, and how to verify. The steps come from the theme's own docs page and the themes index page; the command writes nothing.

A theme slug or its display name both resolve, so `theme butter` and `theme Butter` are the same request. `--json` returns `theme.list` or `theme.detail`, and `theme.detail` carries the whole docs page as `body` for an agent that wants the long version.

## Upgrading

`upgrade` reads the `@astryx-vue/core` version from the project's `package.json` and compares it with the version this CLI was generated from. It never asks the network.

- Older: it prints every section of the upgrade guide — what changed, how it was written before, how it is written now, what to do — then looks through the project's own sources for the old names the guide replaces, and lists file and line. A theme target name only counts as an object key (`progressbar: {`), because the same word is also an HTML tag; a property or option name counts as a word, in camelCase or kebab-case.
- Current: it says nothing needs doing and prints the changelog link.
- Not installed, or a range it cannot read as a version: it says that, and either names the install command for the project's package manager or prints every form.

Both lists come from `apps/docs/docs/{en,zh}/guide/migration.md`: the sections are the page's `###` sections, and the old names are the names its section titles and its `Removed | Use instead` table state.

## Doctor

`doctor` reports five checks and changes nothing:

| Check | Fails or warns when |
| --- | --- |
| `core-version` | `@astryx-vue/core` is missing (fail), its range cannot be read as a version, or it is older or newer than this CLI's catalog (warn) |
| `themes-installed` | `@astryx-vue/themes` is not a dependency (fail) |
| `vue-version` | `vue` is missing (fail) or below 3.5.0 (warn) |
| `theme-stylesheet` | No `@astryx-vue/themes/*.css` import is found (fail), or the file name is not one of the built-in themes (warn) |
| `theme-attribute` | No `data-astryx-theme` is found (warn; Neutral works without it) |

Exit code is `0` when every check passed or only warned, and `1` when one failed; the text still prints, and `--json` returns `doctor.report`. Sources are read from the project directory, skipping `node_modules`, build output, and hidden directories.

## Templates

`template --list` prints all 57 playground pages. `--type page` is the only kind today; `--type block` answers with a note instead of an error.

Every template carries a hand-written one-sentence description and a keyword list in English and Chinese, in `src/generate/template-meta/` (one file per template category). The component list is extracted from the page's `@astryx-vue/core` imports, so it cannot drift from the source. Each record also carries `dependencies`, the npm packages the page imports; a ready page names only `vue` and `@astryx-vue/core`, and the catalog generator fails when a ready page pulls in anything else. That is why `template --list`, `template <slug>`, and their `--json` forms can say exactly what a copied page needs.

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

Success responses are `{ apiVersion: 1, type, data }`. `template`, `build`, and `docs` responses carry `package` for where the records come from (`@astryx-vue/cli` for templates, `@astryx-vue/docs` for pages). Every template entry of `template.list`, `template.show`, and `template.skeleton` carries its own `dependencies` array next to `components`. `component.detail` and `composable.detail` carry the owning package, and every entry of `component.list` and `composable.list` carries its own, because one list can span packages.

| Type | Command |
| --- | --- |
| `template.list`, `template.show`, `template.skeleton`, `template.copy` | `template` |
| `build.help`, `build.kit` | `build` |
| `component.list`, `component.detail` | `component` |
| `composable.list`, `composable.detail` | `composable` |
| `docs.list`, `docs.detail` | `docs` |
| `search` | `search` |
| `manifest` | `manifest` |
| `theme.list`, `theme.detail` | `theme` |
| `upgrade.report` | `upgrade` |
| `doctor.report` | `doctor` |
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
| `ERR_UNKNOWN_THEME` | No theme has that slug or display name. |

`manifest --json` carries the same list per command, so an agent can read the codes without this table.

## Agent block

`init` prints the setup guide — which packages to install (canary ones with `@canary`, once they are on npm), the theme import, the locale snippet, and what to verify — and writes this managed block:

```html
<!-- Maintained by astryx-vue, do not edit manually -->
...
<!-- astryx-vue block end -->
```

If the file is missing, the command creates it. If the markers are already there, every run replaces only the block with freshly generated text. Other text stays. If the file exists without the markers, the block is appended. A second run still rewrites the block; it does not skip because the markers are already present. When the generated text matches, the bytes stay the same.

The block names every package the catalog covers. A package npm does not serve yet (a `private` one) is still named, but with a note and no install command, so nobody is sent to a 404; a published canary package would get the `@canary` specifier. Then it teaches the three-step workflow (`build` to pick a page, `template` to copy it, `component`/`composable`/`docs` before writing code), lists the lookup commands, and says how to run the binary. It does not paste the component catalog.

The install command in the guide follows the project: the `packageManager` field first, then `pnpm-lock.yaml`, `yarn.lock`, `bun.lock(b)`, or `package-lock.json`. With neither, all four forms are listed. `--features` is optional now; passing `agents` is the same as leaving it out, and any other feature is `ERR_UNKNOWN_FEATURE`.

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
- `apps/docs/docs/{en,zh}/guide` and `themes` for search topics, topic bodies, and the theme records (`theme`), plus the install commands and snippets `init` prints
- `apps/docs/docs/{en,zh}/guide/migration.md` for the upgrade guide's sections and the old names `upgrade` searches for
- `apps/docs/components/playground/pages/*.vue` for the template sources, and `templateManifest.ts` for their titles and categories
- every `packages/*/package.json` for which package owns a component, and its exports when a page does not show an import

The template descriptions and keywords are hand-written in `packages/cli/src/generate/template-meta/`, one file per template category, and merged by `template-meta.ts`. They are source data, not a generated file.

Example titles and descriptions are kept once per language, but the example code is stored once for both: both pages point at the same `.vue` file. The generator stops with an error naming the component and the example number if the two pages ever show different code, so one language cannot silently borrow the other's snippet. `examplesFor()` in `packages/cli/src/catalog.ts` is the only place that picks a language back out.

The result is committed at `packages/cli/src/generated/catalog.json`. `pnpm --filter @astryx-vue/cli build` regenerates it and bundles it into `dist`, which is what the published tarball runs. After a docs or template change, regenerate it and commit the diff:

```sh
pnpm --filter @astryx-vue/cli generate
```

`pnpm check` runs `generate:check`. That fails when `catalog.json` is stale, when a PascalCase export of any package is not imported by a documented component, and when a playground page has no metadata in `template-meta.ts`. `./icons`, `./locale`, CSS, and the package root are not component exports.

`catalog.packages` lists every package the catalog covers (`core`, `themes`, `richtext`, `charts`, `lab`) with its directory, whether it publishes only under the `canary` tag, and whether it is `published`. `published` is false for a `private` package: npm has no version of it, so no output prints an install command for it. A component's `package` is the one that exports it by subpath, else the one that has a source entry for it.

`swizzle`, `discover`, `gap-report`, `integration`, and `blog` are not part of this package, and there is no MCP server. `theme`, `upgrade`, and `doctor` print guidance and reports; none of them edits a project file.

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
