---
layout: component-docs
title: Table Footer
outline: false
footer: false
---

## Props

`TableFooter` has no props of its own. Everything it shows comes in through the default slot, and anything else is a native attribute.

## Slots

<div class="component-api-table" role="region" aria-label="TableFooter slots" tabindex="0">
<table><thead><tr><th>Slot</th><th>Description</th></tr></thead><tbody>
<tr><td><code>default</code></td><td>The <code>&lt;tfoot&gt;</code> rows. Required.</td></tr>
</tbody></table>
</div>

## Native attributes

The root element is `<tfoot>`.

The root element receives:

- HTML attributes.
- `aria-*` attributes.
- `data-*` attributes.
- `class`.
- `style`.
- Native event listeners.

The React API styles the footer with `xstyle`, which takes a `stylex.create()` value. In Vue, pass `class` or `style` instead; both land on the `<tfoot>`.
