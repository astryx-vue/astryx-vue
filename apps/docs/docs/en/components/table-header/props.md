---
layout: component-docs
title: Table Header
outline: false
footer: false
---

## Props

`TableHeader` takes no props. The header rows come from the default slot.

## Slots

<div class="component-api-table" role="region" aria-label="TableHeader slots" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>default</code></td><td>The rows of the <code>&lt;thead&gt;</code>. Each row is a <code>TableRow</code>, and its cells are <code>TableHeaderCell</code>.</td></tr>
    </tbody>
  </table>
</div>

## Native attributes

The root element is `<thead>`.

The root element receives:

- HTML attributes.
- `aria-*` attributes.
- `data-*` attributes.
- `class`.
- `style`.
- Native event listeners.
