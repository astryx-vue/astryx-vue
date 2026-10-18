---
layout: component-docs
title: Avatar Group Overflow
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="AvatarGroupOverflow props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>count</code></td><td><code>number</code></td><td>—</td><td>Number of hidden avatars. Rendered as <code>+N</code> and also used to build the accessible name. Required.</td></tr>
</tbody></table>
</div>

## Events

- `click(event: MouseEvent)`: fires when the indicator is clicked. The listener also turns the figure into a button that can take focus.

## Slots

- `default`: custom count text, such as `12+`. Falls back to `+N`.
