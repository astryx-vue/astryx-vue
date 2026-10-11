---
layout: component-docs
title: Tokenizer
outline: false
footer: false
---

## Tokenizer Props

<div class="component-api-table" role="region" aria-label="Tokenizer Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>modelValue</code></td><td><code>T[]</code></td><td><code>[]</code></td><td>Selected items.</td></tr>
      <tr><td><code>searchSource</code></td><td><code>SearchSource&lt;T&gt;</code></td><td>Required</td><td>Static or async source.</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td>Required</td><td>Field label.</td></tr>
      <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>Add…</code> / <code>添加…</code></td><td>Input placeholder.</td></tr>
      <tr><td><code>creatable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Enter turns the typed text into a new token.</td></tr>
      <tr><td><code>overflow</code></td><td><code>'none' | 'unfocused-inline' | 'unfocused-layer'</code></td><td><code>'none'</code></td><td>Whether blur collapses the tokens to one line with <code>+N</code>.</td></tr>
      <tr><td><code>maxEntries</code></td><td><code>number</code></td><td>—</td><td>Maximum number of tokens. The input becomes read-only at the limit.</td></tr>
      <tr><td><code>debounceMs</code></td><td><code>number</code></td><td><code>150</code></td><td>Wait after typing before searching.</td></tr>
      <tr><td><code>showOnFocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show results on focus before the user types.</td></tr>
      <tr><td><code>clearable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show a clear-all button.</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disable the field.</td></tr>
      <tr><td><code>disabledReason</code></td><td><code>string</code></td><td>—</td><td>Reason for the disabled state. The control stays focusable.</td></tr>
      <tr><td><code>status</code></td><td><code>'default' | 'success' | 'warning' | 'error'</code></td><td><code>'default'</code></td><td>Status style.</td></tr>
      <tr><td><code>statusMessage</code></td><td><code>string</code></td><td>—</td><td>Status text under the field.</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Size.</td></tr>
      <tr><td><code>name</code></td><td><code>string</code></td><td>—</td><td>Form field name. Each selected id is submitted once.</td></tr>
    </tbody>
  </table>
</div>

## Tokenizer Emits

<div class="component-api-table" role="region" aria-label="Tokenizer Emits" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Parameters</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>update:modelValue</code></td><td><code>value: T[]</code></td><td>Emitted when the selected items change.</td></tr>
      <tr><td><code>change</code></td><td><code>value: T[]</code>, <code>change: TokenizerChange</code></td><td>Includes the change type: <code>add</code>, <code>create</code>, <code>remove</code>, or <code>clear</code>.</td></tr>
      <tr><td><code>search</code></td><td><code>query: string</code></td><td>Emitted when the query changes.</td></tr>
      <tr><td><code>openChange</code></td><td><code>isOpen: boolean</code></td><td>Emitted when the menu opens or closes.</td></tr>
    </tbody>
  </table>
</div>

## Tokenizer Slots

<div class="component-api-table" role="region" aria-label="Tokenizer Slots" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Parameters</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>icon</code></td><td>—</td><td>Icon at the start of the field.</td></tr>
      <tr><td><code>end</code></td><td>—</td><td>Content at the end of the field.</td></tr>
      <tr><td><code>token</code></td><td><code>{ item, remove }</code></td><td>Custom selected token.</td></tr>
      <tr><td><code>item</code></td><td><code>{ item, isActive, isSelected }</code></td><td>Custom menu row.</td></tr>
      <tr><td><code>empty</code></td><td>—</td><td>Custom empty state.</td></tr>
    </tbody>
  </table>
</div>
