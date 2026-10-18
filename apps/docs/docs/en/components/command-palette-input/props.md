---
layout: component-docs
title: Command Palette Input
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="CommandPaletteInput props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>Search…</code></td><td>Grey placeholder in the field. Also the fallback accessible name.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td><code>placeholder</code></td><td>Accessible name of the field. Defaults to the placeholder text, so pass it when "Search…" does not say what is being searched.</td></tr>
<tr><td><code>hasAutoFocus</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Focus the field when it mounts. A palette that renders inline skips this, so opening a docs preview does not steal focus.</td></tr>
<tr><td><code>value</code></td><td><code>string</code></td><td>—</td><td>Search text. Bind with <code>v-model:value</code>. When omitted, the field reads and writes the search text of the surrounding <code>CommandPalette</code>.</td></tr>
</tbody></table>
</div>

## Events

- `update:value(value: string)`: the next search text. Fired only while `value` is bound.
- `valueChange(value: string)`: the same value under the original callback name, for code ported from React.

## Slots

- `end`: content after the field, such as a clear button or a `Kbd` shortcut hint. The spinner sits in front of it.
- `endContent`: the same slot under the original name. `end` wins when both are passed.
