---
layout: component-docs
title: Thumbnail
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Thumbnail Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>src</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Image URL. A failed load falls back to the placeholder for that <code>src</code>.</td>
      </tr>
      <tr>
        <td><code>alt</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Alternative text for the image.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Accessible name. Not drawn. Used by the tooltip and the remove button.</td>
      </tr>
      <tr>
        <td><code>isLoading</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Skeleton when there is no <code>src</code>. Spinner over the image when there is one.</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Fades the thumbnail and ignores click and remove.</td>
      </tr>
      <tr>
        <td><code>showRemoveOn</code></td>
        <td><code>'always' | 'hover'</code></td>
        <td><code>'hover'</code></td>
        <td>When the remove button is visible. <code>hover</code> also reveals it on keyboard focus, and keeps it visible for a coarse pointer.</td>
      </tr>
    </tbody>
  </table>
</div>

## Events

| Name | Payload | When |
| --- | --- | --- |
| <code>click</code> | <code>MouseEvent</code> | The preview is activated and the thumbnail is neither disabled nor loading. |
| <code>remove</code> | <code>MouseEvent</code> | The remove button is used. The button is only rendered when this listener is present. |

## Theming

The square is 64px with the element radius and a neutral fill. A 1px border is inset. The placeholder glyph is 24px. The remove button is 20×20, inset by one spacing step from the top and end edges, with an overlay fill and an on-dark icon. A coarse pointer expands the hit area by 2px. Disabled opacity is 0.5.
