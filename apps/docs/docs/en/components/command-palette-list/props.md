---
layout: component-docs
title: Command Palette List
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="CommandPaletteList props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>label</code></td><td><code>string</code></td><td><code>Commands</code></td><td>Accessible name of the listbox. The default comes from the locale messages, so it is translated for you.</td></tr>
</tbody></table>
</div>

## Slots

- `default`: the list content, usually `CommandPaletteItem` rows, with or without `CommandPaletteGroup` sections.
