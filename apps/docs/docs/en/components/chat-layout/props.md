---
layout: component-docs
title: Chat Layout
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="ChatLayout props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>density</code></td><td><code>ChatDensity</code></td><td><code>'balanced'</code></td><td>Spacing, bubble width, and the frosted dock. <code>compact</code>, <code>balanced</code>, or <code>spacious</code>.</td></tr>
<tr><td><code>scrollRef</code></td><td><code>HTMLElement | null</code></td><td>—</td><td>Element that scrolls instead of the layout root. Left unset, the layout itself scrolls and the dock sticks; set it and the dock becomes fixed over that element.</td></tr>
<tr><td><code>showScrollButton</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Renders the built-in scroll-to-bottom button. Set it to <code>false</code> when the <code>scrollButton</code> slot should be the only control, or when there should be none.</td></tr>
</tbody></table>
</div>

## Slots

<div class="component-api-table" role="region" aria-label="ChatLayout slots" tabindex="0">
<table><thead><tr><th>Slot</th><th>Description</th></tr></thead><tbody>
<tr><td>(default)</td><td>Transcript. Usually one <code>ChatMessageList</code>.</td></tr>
<tr><td><code>composer</code></td><td>Pinned to the bottom, above the frosted scrim. Usually one <code>ChatComposer</code>.</td></tr>
<tr><td><code>empty</code></td><td>Shown when the default slot is omitted. Centered, so an <code>EmptyState</code> keeps a consistent look.</td></tr>
<tr><td><code>scrollButton</code></td><td>Replaces the built-in scroll button. Receives <code>isVisible</code>, <code>label</code>, and <code>scrollToBottom</code>, which dismisses the new-message label and scrolls down.</td></tr>
</tbody></table>
</div>

## Exposed

<div class="component-api-table" role="region" aria-label="ChatLayout exposed" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead><tbody>
<tr><td><code>element</code></td><td><code>HTMLElement | null</code></td><td>The layout root.</td></tr>
<tr><td><code>scrollToBottom</code></td><td><code>() =&gt; void</code></td><td>Dismisses the new-message state and scrolls to the latest message.</td></tr>
</tbody></table>
</div>
