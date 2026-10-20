---
layout: component-docs
title: Tab
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Tab props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>value</code></td><td><code>string</code></td><td>—</td><td>Unique value of this tab. The surrounding <code>TabList</code> matches its own <code>value</code> against it to decide the selection. Required.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Visible text. The default slot wins when both are given, and this prop becomes the accessible name while the label is hidden.</td></tr>
<tr><td><code>panelId</code></td><td><code>string</code></td><td>—</td><td>ID of the panel this tab controls, for <code>aria-controls</code>. Only used when the strip is a <code>role="tablist"</code>.</td></tr>
<tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Whether the tab is disabled. Keyboard navigation skips it.</td></tr>
<tr><td><code>href</code></td><td><code>string</code></td><td>—</td><td>URL to navigate to. Outside the tabs pattern the tab renders as a link. Ignored inside a <code>role="tablist"</code> strip.</td></tr>
<tr><td><code>as</code></td><td><code>NavLinkComponent</code></td><td><code>'a'</code></td><td>Link root component, such as a router link. Only applies when there is an <code>href</code> and the strip is not a tablist.</td></tr>
<tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Hides the label visually. Only the icon and the end content show, and <code>label</code> becomes the accessible name.</td></tr>
</tbody></table>
</div>

## Slots

- `default`: the label text. Falls back to the `label` prop.
- `icon`: icon shown while the tab is not selected.
- `selectedIcon`: icon shown while the tab is selected. Falls back to `icon`.
- `endContent`: content after the label, such as a badge count or a status dot.
