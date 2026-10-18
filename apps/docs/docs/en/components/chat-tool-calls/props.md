---
layout: component-docs
title: Chat Tool Calls
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="ChatToolCalls props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>calls</code></td><td><code>ChatToolCallItem[]</code></td><td>—</td><td>Tool calls from one assistant turn. An empty array renders nothing. Required. Each item takes <code>name</code>, <code>status</code>, <code>target</code>, <code>duration</code>, <code>node</code>, <code>additions</code>, <code>deletions</code>, <code>stats</code>, <code>errorMessage</code>, <code>key</code>, and <code>detail</code>.</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>localized call count</td><td>Summary shown while a group is expanded.</td></tr>
<tr><td><code>isExpanded</code></td><td><code>boolean</code></td><td>—</td><td>Controlled expanded state of the group, bound with <code>v-model:is-expanded</code>.</td></tr>
<tr><td><code>defaultIsExpanded</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Expanded state used while <code>isExpanded</code> is unbound.</td></tr>
</tbody></table>
</div>

## Events

- `expandedChange(isExpanded: boolean)`: fires with the state the header is asking for. `v-model:is-expanded` also emits `update:isExpanded`.

## Slots

- `detail`: rich detail for one call, receiving `{ call }`. Falls back to `call.detail` when omitted.

## Exposed

- `element`: the root element.

## Types

`ChatToolCallItem`:

| Field | Type | Description |
| --- | --- | --- |
| `name` | `string` | Tool or function name, shown in monospace. Required. |
| `status` | `'pending' \| 'running' \| 'complete' \| 'error'` | Execution status. Omit it and the call is treated as complete. |
| `target` | `string` | What the tool acted on, such as a file path, a command, or a query. |
| `duration` | `string` | Execution time shown on the trailing edge, such as `1.2s`. |
| `node` | `string` | Sandbox or worker name, shown as a neutral badge. |
| `additions` | `number` | Added lines or characters, rendered as `+12`. |
| `deletions` | `number` | Removed lines or characters, rendered as `-3`. |
| `stats` | `string` | Extra plain text after the label. |
| `errorMessage` | `string` | Error detail when `status` is `error`. Spoken to assistive tech and used as the status icon's tooltip. |
| `key` | `string` | Stable identity. Derived from the other fields when omitted. |
| `detail` | `string` | Plain-text detail revealed when the row is expanded. |
