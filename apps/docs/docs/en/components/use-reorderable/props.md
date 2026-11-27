---
layout: component-docs
title: useReorderable
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useReorderable parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>MaybeRefOrGetter&lt;ReorderableOptions&gt;</code></td>
        <td>—</td>
        <td>Configuration object. Each move reads its latest value. <code>createReorderable</code> takes the same fields as a plain object.</td>
      </tr>
      <tr>
        <td><code>options.onReorder</code></td>
        <td><code>(move: { key: TKey, to: number }) =&gt; void</code></td>
        <td>—</td>
        <td>Called once per committed move (a drop, or each move in reorder mode) with the moved item's key and its index after the move, in the full order of the list's items. Apply it by rendering the items in their new order. A cancelled move calls nothing.</td>
      </tr>
      <tr>
        <td><code>options.isReorderable</code></td>
        <td><code>(key: TKey) =&gt; boolean</code></td>
        <td>—</td>
        <td>Whether the item with this key can move. An item it rejects shows no handle and cannot be picked up; one at either end of the list also bounds the others, so nothing drops beyond it and a keyboard move into it is refused. Every item moves without it.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useReorderable returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td>(return value)</td>
        <td><code>Reorderable&lt;TKey&gt;</code></td>
        <td>The list's reorder behavior: pass it as <code>List</code>'s <code>reorderable</code>, with an <code>itemKey</code> on each <code>ListItem</code>. Its one method, <code>start(key)</code>, enters reorder mode for that item from your own UI: the focus moves to its handle. One object may serve several lists, each reordering on its own; <code>start</code> then uses the one mounted last.</td>
      </tr>
    </tbody>
  </table>
</div>
