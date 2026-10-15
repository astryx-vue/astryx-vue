---
layout: component-docs
title: Dropdown Menu Radio Item
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="DropdownMenuRadioItem Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>value</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>The value this option represents. The item must sit inside a radio group; otherwise it throws while it is set up.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string | number</code></td>
        <td>-</td>
        <td>Primary text.</td>
      </tr>
      <tr>
        <td><code>description</code></td>
        <td><code>string | number</code></td>
        <td>-</td>
        <td>Secondary line under the label.</td>
      </tr>
      <tr>
        <td><code>icon</code></td>
        <td><code>string | Component</code></td>
        <td>-</td>
        <td>Icon before the label. Use the <code>icon</code> slot for anything else.</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Disables this option. It stays in the group and cannot be selected.</td>
      </tr>
    </tbody>
  </table>
</div>

The row's role is `menuitemradio`. Whether it closes the menu is decided by the group. Trailing content goes in the `endContent` slot.
