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
<tr><td><code>subtitle</code></td><td><code>string</code></td><td>—</td><td>Secondary text under the title. An empty string with no <code>subtitle</code> slot renders nothing.</td></tr>
<tr><td><code>hasCloseButton</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows the close button, which emits <code>openChange(false)</code> when clicked.</td></tr>
<tr><td><code>endContentEdgeCompensation</code></td><td><code>'inline' | 'block' | 'all'</code></td><td><code>all</code> when a close button is shown</td><td>Which edges of the trailing slot are compensated. <code>inline</code> is the inline end, <code>block</code> is both block edges, <code>all</code> is both. Omitting it with no close button compensates nothing.</td></tr>
<tr><td><code>closeButtonLabel</code></td><td><code>string</code></td><td>Active language</td><td>Accessible name of the close button. Defaults to Close in English and 关闭 in Chinese.</td></tr>
<tr><td><code>hasDivider</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Draws a themed rule along the bottom edge. The rule uses <code>--astryx-color-border</code>.</td></tr>
</tbody></table>
</div>

## Events

- `openChange(isOpen: boolean)`: fires with `false` when the close button is clicked.

## Slots

- `title`: inline content in place of the title string. The heading still names the dialog.
- `subtitle`: inline content for the subtitle.
- `startContent`: content before the title, such as a back button.
- `endContent`: content before the close button.
