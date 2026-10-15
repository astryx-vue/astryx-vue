---
layout: component-docs
title: Dropdown Menu Checkbox Item
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="DropdownMenuCheckboxItem Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>modelValue</code></td>
        <td><code>boolean</code></td>
        <td>-</td>
        <td>Whether the row is checked. Pair it with <code>v-model</code>. The data array uses <code>checked</code> instead.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string | number</code></td>
        <td>-</td>
        <td>Primary text. Use the <code>label</code> slot for rich content.</td>
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
        <td>Icon before the label: a CSS icon class, or a component that draws one. Use the <code>icon</code> slot for anything else.</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Disables the row. It stays in the accessibility tree, the arrows skip it, and a click does not toggle it.</td>
      </tr>
      <tr>
        <td><code>hasCloseOnSelect</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Whether toggling closes the menu. Checkbox rows stay open.</td>
      </tr>
    </tbody>
  </table>
</div>

The row's role is `menuitemcheckbox`, and the checked state is `aria-checked`. The mark is decorative and does not take the click. Trailing content such as a shortcut hint goes in the `endContent` slot.
