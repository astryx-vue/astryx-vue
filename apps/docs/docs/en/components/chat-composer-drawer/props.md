---
layout: component-docs
title: Chat Composer Drawer
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="ChatComposerDrawer props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>count</code></td><td><code>number</code></td><td>—</td><td>Item count. Providing it turns on the collapse toggle and is shown in the collapsed summary. Omit it and the drawer stays open.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>Localized “Items”</td><td>Name used in the collapsed summary and in the expand and collapse accessible labels.</td></tr>
<tr><td><code>v-model:is-collapsed</code></td><td><code>boolean</code></td><td>—</td><td>Controlled collapsed state. Bound, the drawer renders exactly this value and the toggle only asks for a change.</td></tr>
<tr><td><code>defaultIsCollapsed</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Initial collapsed state while <code>isCollapsed</code> is unbound.</td></tr>
</tbody></table>
</div>

## Events

<div class="component-api-table" role="region" aria-label="ChatComposerDrawer events" tabindex="0">
<table><thead><tr><th>Event</th><th>Payload</th><th>Description</th></tr></thead><tbody>
<tr><td><code>collapsedChange</code></td><td><code>boolean</code></td><td>The collapsed state the toggle is asking for. <code>v-model:is-collapsed</code> listens to it.</td></tr>
</tbody></table>
</div>

## Slots

<div class="component-api-table" role="region" aria-label="ChatComposerDrawer slots" tabindex="0">
<table><thead><tr><th>Slot</th><th>Description</th></tr></thead><tbody>
<tr><td>(default)</td><td>The supplementary content: attachment chips, thumbnails, prompts. Laid out as a wrapping row.</td></tr>
<tr><td><code>collapsedSummary</code></td><td>Replaces the count badge and label shown while collapsed. The toggle still owns the disclosure name.</td></tr>
</tbody></table>
</div>
