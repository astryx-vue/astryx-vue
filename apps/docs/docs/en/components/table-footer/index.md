---
layout: component-docs
title: Table Footer
outline: false
footer: false
---

## Usage

`<tfoot>` wrapper for children mode. Holds summary or total rows beneath the body. A row must sit inside a section: `<table>` cannot contain a `<tr>` directly, because the HTML parser inserts an implied `<tbody>` when it parses server-rendered markup and Vue does not when it renders on the client, so the two trees mismatch on hydration. Children mode only: the data-driven `data={...}` path renders a header and a body, never a footer.

```ts
import { TableFooter } from '@astryx-vue/core/Table'
```
