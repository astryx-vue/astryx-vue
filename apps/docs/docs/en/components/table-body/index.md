---
layout: component-docs
title: Table Body
outline: false
footer: false
---

## Usage

`TableBody` is the `<tbody>` wrapper for children mode. It holds the data rows. A row must sit inside a section: `<table>` cannot contain a `<tr>` directly, because the HTML parser inserts an implied `<tbody>` when it parses server-rendered markup and the client render does not, so rows written straight into `Table` mismatch on hydration. The data-driven `data={...}` mode renders this element itself; in children mode it is yours to supply.

```ts
import { TableBody } from '@astryx-vue/core/Table'
```
