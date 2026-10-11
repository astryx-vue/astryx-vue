---
layout: component-docs
title: Selector
outline: false
footer: false
---

## Selector Props

<div class="component-api-table" role="region" aria-label="Selector Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>modelValue</code></td><td><code>string | number | null</code></td><td><code>null</code></td><td>Selected value.</td></tr>
      <tr><td><code>options</code></td><td><code>SelectorOption[]</code></td><td>Required</td><td>Options array.</td></tr>
      <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>Select…</code> / <code>请选择</code></td><td>Placeholder text. English by default; Chinese when <code>zh-CN</code> is provided.</td></tr>
      <tr><td><code>searchable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Whether to support search.</td></tr>
      <tr><td><code>clearable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Whether clearable.</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Whether disabled.</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Size.</td></tr>
      <tr><td><code>status</code></td><td><code>'default' | 'error' | 'warning' | 'success'</code></td><td><code>'default'</code></td><td>Status.</td></tr>
    </tbody>
  </table>
</div>

## Selector Emits

<div class="component-api-table" role="region" aria-label="Selector Emits" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Parameters</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>update:modelValue</code></td><td><code>value: string | number | null</code></td><td>Emitted when value changes.</td></tr>
      <tr><td><code>change</code></td><td><code>value: string | number | null</code></td><td>Emitted when value changes.</td></tr>
      <tr><td><code>search</code></td><td><code>query: string</code></td><td>Emitted when search input changes.</td></tr>
    </tbody>
  </table>
</div>

## Selector Slots

<div class="component-api-table" role="region" aria-label="Selector Slots" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Parameters</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>selected</code></td><td><code>{ option: SelectorOption | null }</code></td><td>Customize selected item display.</td></tr>
      <tr><td><code>option</code></td><td><code>{ option: SelectorOption, isActive: boolean, isSelected: boolean }</code></td><td>Customize option display.</td></tr>
      <tr><td><code>empty</code></td><td>—</td><td>Customize empty state.</td></tr>
    </tbody>
  </table>
</div>
