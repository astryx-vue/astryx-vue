---
layout: component-docs
title: Mobile Nav Toggle
outline: false
footer: false
---

## MobileNavToggle Props

<div class="component-api-table" role="region" aria-label="MobileNavToggle Props" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>isOpen</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Open state of the drawer, paired with <code>v-model:is-open</code>. The glyph and <code>aria-expanded</code> follow it.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Accessible name of the button, written to <code>aria-label</code>. Left out, it comes from the locale messages: “Open menu”, or “Close” while the drawer is open.</td></tr>
<tr><td><code>controls</code></td><td><code>string</code></td><td>—</td><td>Id of the drawer, written to <code>aria-controls</code>.</td></tr>
</tbody></table>
</div>

## Events

<div class="component-api-table" role="region" aria-label="MobileNavToggle events" tabindex="0">
<table><thead><tr><th>Name</th><th>Payload</th><th>Description</th></tr></thead><tbody>
<tr><td><code>update:isOpen</code></td><td><code>boolean</code></td><td>The button was pressed; drives <code>v-model:is-open</code>.</td></tr>
</tbody></table>
</div>

## Slots

`MobileNavToggle` has no slots. It draws the built-in menu glyph, so there is nothing to put inside it.
