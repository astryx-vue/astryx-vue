---
layout: component-docs
title: Metadata List
outline: false
footer: false
---

## Props

### MetadataList

<div class="component-api-table" role="region" aria-label="MetadataList Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>columns</code></td>
        <td><code>'multi' | 'single' | number</code></td>
        <td><code>'single'</code></td>
        <td>One column keeps the label beside the value. A number or <code>multi</code> stacks the label above the value. <code>multi</code> fills tracks of at least 280px.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>{ position?: 'start' | 'top', width?: number | string }</code></td>
        <td>beside the value for one column, above it otherwise</td>
        <td><code>width</code> sizes the label track and only applies when the label sits beside the value. Numbers are pixels.</td>
      </tr>
      <tr>
        <td><code>maxNumOfItems</code></td>
        <td><code>number</code></td>
        <td>-</td>
        <td>Items past this count sit behind a show more control. Ignored when the list is horizontal.</td>
      </tr>
      <tr>
        <td><code>orientation</code></td>
        <td><code>'vertical' | 'horizontal'</code></td>
        <td><code>'vertical'</code></td>
        <td>Horizontal flow wraps pairs in a row and ignores <code>columns</code>, <code>label</code>, and <code>maxNumOfItems</code>.</td>
      </tr>
      <tr>
        <td><code>title</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Plain title above the pairs. Use the <code>title</code> slot for rich content.</td>
      </tr>
    </tbody>
  </table>
</div>

### MetadataListItem

<div class="component-api-table" role="region" aria-label="MetadataListItem Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>The name of the field. The default slot is the value. The <code>icon</code> slot draws a leading icon.</td>
      </tr>
    </tbody>
  </table>
</div>

## Theming

`packages/core/styles/metadata-list.css` reads semantic tokens. Labels use the body size at medium weight and the secondary text color. Values use the primary text color. Side-by-side pairs have an 8px row gap and a 16px column gap, and the value row is at least 24px tall. Stacked pairs use a 2px gap. The title has 12px of space below it. The show more control uses the accent color.

## Native attributes

Attributes fall through to the root `<dl>` and to each item's `<dt>` or wrapping element.
