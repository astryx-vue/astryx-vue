---
layout: component-docs
title: Chat Composer Token Element
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="ChatComposerTokenElement props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>token</code></td><td><code>ChatComposerToken</code></td><td>—</td><td>Required. Either a badge config <code>{ value, label?, variant?, icon? }</code> or a custom token <code>{ value, render }</code>. <code>value</code> is what the draft serializes to.</td></tr>
</tbody></table>
</div>

The chip is a `span` with `data-astryx-token` and `contenteditable="false"`, so it can sit next to a serialized draft without being typed into. A badge token draws a `Badge`; `icon` takes a built-in glyph name such as `check`, or an Iconify id such as `carbon:user`. A custom token draws whatever `render` returns.
