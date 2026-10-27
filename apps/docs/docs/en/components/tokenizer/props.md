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
      <tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Helper text under the label.</td></tr>
      <tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>Tooltip text on an info icon next to the label.</td></tr>
      <tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Hides the label visually while keeping it accessible. <code>labelHidden</code> is the older name; either one hides it.</td></tr>
      <tr><td><code>containerClass</code> / <code>controlClass</code></td><td><code>class</code></td><td>—</td><td>Field shell and input box. A root class lands on the box, not the native input. Item actions behave like Typeahead.</td></tr>
      <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>Add…</code> / <code>添加…</code></td><td>Input placeholder. Shown only while no tokens are selected.</td></tr>
      <tr><td><code>hasCreate</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Let users turn free text into a new token. A "Create …" row appears for text that matches nothing else, and the change type is <code>create</code>.</td></tr>
      <tr><td><code>creatable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Legacy name for <code>hasCreate</code>. Either one turns it on.</td></tr>
      <tr><td><code>overflow</code></td><td><code>'none' | 'unfocused-inline' | 'unfocused-layer'</code></td><td><code>'none'</code></td><td>Whether blur collapses the tokens to one line with <code>+N</code>.</td></tr>
      <tr><td><code>maxEntries</code></td><td><code>number</code></td><td>—</td><td>Maximum number of tokens. The input becomes read-only at the limit.</td></tr>
      <tr><td><code>debounceMs</code></td><td><code>number</code></td><td><code>150</code></td><td>Wait after typing before searching.</td></tr>
      <tr><td><code>minQueryLength</code></td><td><code>number</code></td><td><code>1</code></td><td>Shortest query that gets searched, counted in visible characters. Below it nothing is searched and the menu stays closed — unless <code>hasCreate</code> is on, because a "Create …" row comes from the typed text and costs no search.</td></tr>
      <tr><td><code>hasEntriesOnFocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show results on focus before the user types.</td></tr>
      <tr><td><code>showOnFocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Legacy name for <code>hasEntriesOnFocus</code>. Either one turns it on.</td></tr>
      <tr><td><code>hasAutoFocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Focus the input on mount.</td></tr>
      <tr><td><code>menuWidth</code></td><td><code>number</code></td><td>—</td><td>Requested dropdown width in pixels. Never narrower than the field, and clamped to the viewport.</td></tr>
      <tr><td><code>maxMenuItems</code></td><td><code>number</code></td><td><code>10</code></td><td>Maximum number of results in the menu. A "Create …" row is offered on top of them.</td></tr>
      <tr><td><code>hasClear</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show a clear-all button that removes every token.</td></tr>
      <tr><td><code>clearable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Legacy name for <code>hasClear</code>. Either one turns it on.</td></tr>
      <tr><td><code>emptySearchText</code></td><td><code>string | null</code></td><td><code>'No results found'</code> / <code>'未找到结果'</code></td><td>Text shown when the query matched nothing. <code>null</code> means "not given" and falls through to the default; an empty string renders nothing. For rich content use the <code>empty</code> slot.</td></tr>
      <tr><td><code>emptyText</code></td><td><code>string | null</code></td><td>—</td><td>Legacy name for <code>emptySearchText</code>.</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disable the field and every token interaction.</td></tr>
      <tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>—</td><td>Explains why the field is disabled. With <code>disabled</code>, the input stays focusable through <code>aria-disabled</code> and <code>readonly</code>, and the message shows as a tooltip on hover or keyboard focus.</td></tr>
      <tr><td><code>disabledReason</code></td><td><code>string</code></td><td>—</td><td>Legacy name for <code>disabledMessage</code>.</td></tr>
      <tr><td><code>status</code></td><td><code>'default' | 'success' | 'warning' | 'error'</code></td><td><code>'default'</code></td><td>Status style.</td></tr>
      <tr><td><code>statusMessage</code></td><td><code>string</code></td><td>—</td><td>Status text under the field.</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Input and token size.</td></tr>
      <tr><td><code>required</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Marks the field as required.</td></tr>
      <tr><td><code>optional</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows an optional indicator on the label.</td></tr>
      <tr><td><code>name</code></td><td><code>string</code></td><td>—</td><td>Form field name. Each selected id is submitted once.</td></tr>
      <tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>Width of the whole field (number = pixels, string used as-is).</td></tr>
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
      <tr><td><code>changeQuery</code></td><td><code>query: string</code></td><td>Emitted when the query text changes.</td></tr>
      <tr><td><code>search</code></td><td><code>query: string</code></td><td>Legacy name for <code>changeQuery</code>. Both fire.</td></tr>
      <tr><td><code>openChange</code></td><td><code>isOpen: boolean</code></td><td>Emitted when the menu opens or closes.</td></tr>
      <tr><td><code>focus</code></td><td><code>event: FocusEvent</code></td><td>Emitted when focus enters the field from outside.</td></tr>
      <tr><td><code>blur</code></td><td><code>event: FocusEvent</code></td><td>Emitted when focus leaves the whole field, not just the input.</td></tr>
    </tbody>
  </table>
</div>

## Tokenizer Slots

<div class="component-api-table" role="region" aria-label="Tokenizer Slots" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Parameters</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>icon</code></td><td>—</td><td>Icon at the start of the field, before any token.</td></tr>
      <tr><td><code>end</code></td><td>—</td><td>Content at the end of the field, such as a button or a result count.</td></tr>
      <tr><td><code>token</code></td><td><code>{ item, remove }</code></td><td>Custom selected token. Replaces the default <code>Token</code>.</td></tr>
      <tr><td><code>item</code></td><td><code>{ item, isActive, isSelected }</code></td><td>Custom menu row. Replaces the default <code>TypeaheadItem</code>.</td></tr>
      <tr><td><code>empty</code></td><td>—</td><td>Custom empty state.</td></tr>
    </tbody>
  </table>
</div>

Native attributes and listeners that are not listed above land on the input element, so `@keydown`, `@paste` and `aria-*` work as they would on a plain `<input>`. A `keydown` listener runs before the internal token navigation; call `event.preventDefault()` to skip it.
