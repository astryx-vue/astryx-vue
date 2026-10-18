---
layout: component-docs
title: Dialog Header
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="DialogHeader props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>title</code></td><td><code>string</code></td><td>—</td><td>The dialog title. It receives default focus on open and names the dialog. Required.</td></tr>
<tr><td><code>subtitle</code></td><td><code>string</code></td><td>—</td><td>Secondary text under the title. An empty string renders nothing.</td></tr>
<tr><td><code>hasCloseButton</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows the close button, which emits <code>openChange(false)</code> when clicked.</td></tr>
<tr><td><code>closeButtonLabel</code></td><td><code>string</code></td><td><code>'Close'</code></td><td>Accessible name for the close button.</td></tr>
</tbody></table>
</div>

## Events

- `openChange(isOpen: boolean)`: fires with `false` when the close button is clicked.

## Slots

- `startContent`: content before the title, such as a back button.
- `endContent`: content before the close button.
