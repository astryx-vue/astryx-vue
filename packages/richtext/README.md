# @astryx-vue/richtext

Vue 3 rich text for [astryx-vue](https://github.com/astryx-vue/astryx-vue), an unofficial port of Astryx's `@astryxdesign/richtext`. Not affiliated with Meta.

This version ships the framework-independent half of the package: the Lexical node set and the Markdown import/export pipeline. The editor and viewer components are not here yet, so there is nothing to mount and no stylesheet to load.

## Install

```sh
pnpm add @astryx-vue/richtext
```

Peer dependencies: `@astryx-vue/core` and `vue` `^3.5.0`. Lexical is a peer dependency too, optional and pinned to the same minor the upstream package uses (`^0.52.0`):

```sh
pnpm add lexical @lexical/markdown @lexical/headless @lexical/html @lexical/link @lexical/list @lexical/rich-text @lexical/code @lexical/extension @lexical/table @lexical/utils
```

> `@lexical/headless` declares `happy-dom` as a dependency of its own, so installing it for server-side conversion also installs `happy-dom`. That is Lexical's choice; upstream carries the same dependency.

## Markdown, on the server

`@astryx-vue/richtext/markdown` imports no Vue component and touches no DOM, so it runs in Node, in a worker, or during server rendering.

```ts
import { editorStateJSONToMarkdown, markdownToEditorStateJSON } from '@astryx-vue/richtext/markdown'

const state = markdownToEditorStateJSON('# Title\n\nSome *emphasis*.\n')
const markdown = editorStateJSONToMarkdown(state)
```

Importing Markdown keeps the authored source. Blocks you did not touch come back byte for byte: list markers, indentation, escapes, character references such as `&amp;`, and the exact code fence ticks all survive the round trip. Only the blocks that change are written out in canonical form.

The same parser the core `Markdown` component uses does the reading, so the two agree on what a given document means.

## Also exported

`sanitizeUrl` and `validateUrl` — the allowlist check that decides which hrefs a link may carry.

## License

MIT
