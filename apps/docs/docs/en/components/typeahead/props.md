---
layout: component-docs
title: Typeahead
outline: false
footer: false
---

## Typeahead Props

<div class="component-api-table" role="region" aria-label="Typeahead Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>modelValue</code></td><td><code>T | null</code></td><td><code>null</code></td><td>Selected item. An item has at least <code>id</code> and <code>label</code>.</td></tr>
      <tr><td><code>searchSource</code></td><td><code>SearchSource&lt;T&gt;</code></td><td>Required</td><td>Static or async source. An empty query prefers <code>bootstrap</code>.</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td>Required</td><td>Field label. Always available to assistive technology.</td></tr>
      <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>Search…</code> / <code>搜索…</code></td><td>Placeholder. English unless a locale is provided.</td></tr>
      <tr><td><code>debounceMs</code></td><td><code>number</code></td><td><code>150</code></td><td>Wait after typing before searching. Use 0 for local data.</td></tr>
      <tr><td><code>showOnFocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show results on focus before the user types.</td></tr>
      <tr><td><code>maxMenuItems</code></td><td><code>number</code></td><td><code>10</code></td><td>Maximum rows in the menu.</td></tr>
      <tr><td><code>clearable</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Show a clear button.</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disable the field.</td></tr>
      <tr><td><code>disabledReason</code></td><td><code>string</code></td><td>—</td><td>Reason for the disabled state. The control stays focusable.</td></tr>
      <tr><td><code>status</code></td><td><code>'default' | 'success' | 'warning' | 'error'</code></td><td><code>'default'</code></td><td>Status style.</td></tr>
      <tr><td><code>statusMessage</code></td><td><code>string</code></td><td>—</td><td>Status text under the field.</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Size.</td></tr>
      <tr><td><code>emptyText</code></td><td><code>string</code></td><td>Built-in empty text</td><td>Text when there are no results.</td></tr>
      <tr><td><code>name</code></td><td><code>string</code></td><td>—</td><td>Form field name. Submits the selected id.</td></tr>
    </tbody>
  </table>
</div>

## Typeahead Emits

<div class="component-api-table" role="region" aria-label="Typeahead Emits" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Parameters</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>update:modelValue</code></td><td><code>value: T | null</code></td><td>Emitted when the selection is set or cleared.</td></tr>
      <tr><td><code>change</code></td><td><code>value: T | null</code></td><td>Emitted when the selection is set or cleared.</td></tr>
      <tr><td><code>search</code></td><td><code>query: string</code></td><td>Emitted when the query changes.</td></tr>
      <tr><td><code>openChange</code></td><td><code>isOpen: boolean</code></td><td>Emitted when the menu opens or closes.</td></tr>
    </tbody>
  </table>
</div>

## Typeahead Slots

<div class="component-api-table" role="region" aria-label="Typeahead Slots" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Parameters</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>icon</code></td><td>—</td><td>Icon at the start of the input.</td></tr>
      <tr><td><code>item</code></td><td><code>{ item, isActive, isSelected }</code></td><td>Custom menu row.</td></tr>
      <tr><td><code>empty</code></td><td>—</td><td>Custom empty state.</td></tr>
    </tbody>
  </table>
</div>

## createStaticSource

<div class="component-api-table" role="region" aria-label="createStaticSource" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>items</code></td><td><code>T[]</code></td><td>Local items.</td></tr>
      <tr><td><code>keywords</code></td><td><code>(item: T) =&gt; string[]</code></td><td>Extra words included in the substring match.</td></tr>
    </tbody>
  </table>
</div>
