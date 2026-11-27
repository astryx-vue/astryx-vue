---
layout: component-docs
title: useOutlineFromDOM
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useOutlineFromDOM parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>container</code></td>
        <td><code>Ref&lt;HTMLElement | null | undefined&gt;</code></td>
        <td>required</td>
        <td>The element that holds the headings. The hook reads <code>h1</code> through <code>h6</code> inside it.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useOutlineFromDOM return value" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>items</code></td>
        <td><code>Ref&lt;OutlineItem[]&gt;</code></td>
        <td>One item per heading that has both an id and text, in document order, ready for <code>Outline</code>'s <code>items</code>. <code>id</code> is the heading's id, <code>label</code> is its trimmed text, and <code>level</code> is its depth from 1 to 6.</td>
      </tr>
    </tbody>
  </table>
</div>
