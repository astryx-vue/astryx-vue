---
layout: component-docs
title: Bottom Sheet Switcher
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="BottomSheetSwitcher props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>activeSheet</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Bound with <code>v-model:active-sheet</code>. The <code>sheet-id</code> of the step to show. Bind it to <code>null</code> to close the whole flow.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Accessible name for the whole flow. When omitted, the active sheet's own <code>label</code> is used, and <code>Bottom sheet</code> when there is none.</td></tr>
<tr><td><code>purpose</code></td><td><code>'info' | 'form' | 'required'</code></td><td>active sheet's <code>purpose</code></td><td>How the whole flow may be dismissed. <code>info</code> allows Escape, a scrim click, and a swipe; <code>form</code> allows Escape only; <code>required</code> blocks every implicit path.</td></tr>
<tr><td><code>hasScrim</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Draws one scrim for the entire flow. It stays up while steps change and only goes away when the flow closes. Without it the page behind stays interactive and scrolling.</td></tr>
</tbody></table>
</div>

## Events

- `update:activeSheet(value: string | null)`: fires with the step the switcher wants to show, or `null` to close. This is the `v-model:active-sheet` binding.
- `cancel(event: Event)`: fires when the dialog receives a native cancel request, before the flow closes. Call `event.preventDefault()` on the event to keep it open.

## Slots

- `default`: the `BottomSheet` steps. Each one needs a unique `sheet-id` and its own `label`.
