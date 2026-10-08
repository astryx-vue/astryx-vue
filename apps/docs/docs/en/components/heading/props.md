---
layout: component-docs
title: Heading
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Heading Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>level</code></td>
        <td><code>HeadingLevel</code></td>
        <td>-</td>
        <td>Heading level (1–6). Determines the semantic element (h1–h6).</td>
      </tr>
      <tr>
        <td><code>type</code></td>
        <td><code>HeadingType</code></td>
        <td>-</td>
        <td>Visual type variant that overrides the default level styling. Optional: <code>display-1</code>, <code>display-2</code>, <code>display-3</code>, <code>body</code>, <code>large</code>, <code>label</code>, <code>supporting</code>.</td>
      </tr>
      <tr>
        <td><code>color</code></td>
        <td><code>HeadingColor</code></td>
        <td><code>'primary'</code></td>
        <td>Text color. Optional: <code>primary</code>, <code>secondary</code>, <code>accent</code>, <code>inherit</code>.</td>
      </tr>
      <tr>
        <td><code>weight</code></td>
        <td><code>HeadingWeight</code></td>
        <td>-</td>
        <td>Font weight override. Optional: <code>regular</code>, <code>medium</code>, <code>semibold</code>, <code>bold</code>.</td>
      </tr>
      <tr>
        <td><code>display</code></td>
        <td><code>HeadingDisplay</code></td>
        <td><code>'block'</code></td>
        <td>Display type: <code>block</code> or <code>inline</code>.</td>
      </tr>
      <tr>
        <td><code>maxLines</code></td>
        <td><code>number</code></td>
        <td><code>0</code></td>
        <td>Maximum lines before truncation. 0 means no truncation.</td>
      </tr>
    </tbody>
  </table>
</div>

## Native attributes

The root element is `<h1>` through `<h6>`.

The following are passed to the root element:

- HTML attributes.
- `aria-*` attributes.
- `data-*` attributes.
- `class`.
- `style`.
