---
layout: component-docs
title: Table Header
outline: false
footer: false
---

## Usage

`<thead>` wrapper for children mode. Holds the header row, whose cells are `TableHeaderCell`. A row must sit inside a section: `<table>` cannot contain a `<tr>` directly, because the HTML parser inserts an implied `<tbody>` when it parses server-rendered markup and the client renderer does not, so the two trees mismatch on hydration. The data-driven `data` mode renders this element itself whenever columns are supplied; in children mode it is yours to supply.

```ts
import { TableHeader } from '@astryx-vue/core/Table'
```
