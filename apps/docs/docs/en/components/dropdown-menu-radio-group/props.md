---
layout: component-docs
title: Dropdown Menu Radio Group
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="DropdownMenuRadioGroup Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>modelValue</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>The selected value. Pair it with <code>v-model</code>. Leave it unset when nothing is selected yet. The data array uses <code>value</code> as well.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Accessible name of the group, so the options are announced as one set.</td>
      </tr>
      <tr>
        <td><code>hasCloseOnSelect</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>Whether choosing a value closes the menu. A radio group closes.</td>
      </tr>
    </tbody>
  </table>
</div>

The options are [Dropdown Menu Radio Item](/en/components/dropdown-menu-radio-item) children. The group renders `role="group"` and puts `label` on `aria-label`.
