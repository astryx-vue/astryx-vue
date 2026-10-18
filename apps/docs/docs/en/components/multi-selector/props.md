---
layout: component-docs
title: Multi Selector
outline: false
footer: false
---

## MultiSelector Props

<div class="component-api-table" role="region" aria-label="MultiSelector Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>modelValue</code></td><td><code>(string | number)[]</code></td><td><code>[]</code></td><td>Selected values.</td></tr>
      <tr><td><code>options</code></td><td><code>MultiSelectorOption[]</code></td><td>Required</td><td>Strings, option objects, dividers, or sections.</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td>Required</td><td>Field label.</td></tr>
      <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>Select…</code> / <code>请选择</code></td><td>Placeholder when nothing is selected.</td></tr>
      <tr><td><code>searchable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show a search field in the menu.</td></tr>
      <tr><td><code>selectAll</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show a select-all row. Disabled options are skipped.</td></tr>
      <tr><td><code>triggerDisplay</code></td><td><code>'count' | 'labels' | 'badges'</code></td><td><code>'count'</code></td><td>How the closed trigger shows the selection.</td></tr>
      <tr><td><code>maxBadges</code></td><td><code>number</code></td><td><code>3</code></td><td>How many badges or labels stay visible before <code>+N</code>. Width can collapse them further.</td></tr>
      <tr><td><code>clearable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show a clear button.</td></tr>
      <tr><td><code>hasClear</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows a clear button when values are selected. <code>clearable</code> is the older name; either one turns it on.</td></tr>
      <tr><td><code>checkboxPosition</code></td><td><code>'start' | 'end'</code></td><td><code>'start'</code></td><td>Where the check mark sits.</td></tr>
      <tr><td><code>variant</code></td><td><code>'input' | 'ghost'</code></td><td><code>'input'</code></td><td><code>input</code> has a border. <code>ghost</code> fits a toolbar.</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disable the field.</td></tr>
      <tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>—</td><td>Why the field is disabled. With <code>disabled</code>, hovering or keyboard focus shows a tooltip and the trigger stays focusable through <code>aria-disabled</code>; it still cannot open the list. Do not wrap a disabled selector in a tooltip: it would swallow the hover. <code>disabledReason</code> is the older name.</td></tr>
      <tr><td><code>disabledReason</code></td><td><code>string</code></td><td>—</td><td>Reason for the disabled state. The control stays focusable. Same as <code>disabledMessage</code>.</td></tr>
      <tr><td><code>isDefaultOpen</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Starts with the list open on mount.</td></tr>
      <tr><td><code>status</code></td><td><code>'default' | 'success' | 'warning' | 'error'</code></td><td><code>'default'</code></td><td>Status style.</td></tr>
      <tr><td><code>statusMessage</code></td><td><code>string</code></td><td>—</td><td>Status text under the field.</td></tr>
      <tr><td><code>statusVariant</code></td><td><code>'attached' | 'detached' | 'tooltip'</code></td><td><code>'attached'</code></td><td>Where the status message sits. Ghost detaches an attached message. Tooltip keeps it on the icon inside the field.</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Size.</td></tr>
      <tr><td><code>name</code></td><td><code>string</code></td><td>—</td><td>Form field name. Each selected value is submitted once.</td></tr>
      <tr><td><code>isReadOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Read-only. The selection stays, can be focused and submitted, and cannot be opened or cleared. It does not dim.</td></tr>
      <tr><td><code>isLoading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows a spinner in the trigger. The create row and the empty state stay hidden.</td></tr>
      <tr><td><code>formatValue</code></td><td><code>(items) =&gt; string</code></td><td>—</td><td>Custom closed text. Used by count and labels only. Badges ignore it. An empty selection does not call it.</td></tr>
      <tr><td><code>hasCreate</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Use with search. When the text matches no label, ignoring case, the first row creates it.</td></tr>
      <tr><td><code>handleRef</code></td><td><code>Ref | (handle) =&gt; void</code></td><td>—</td><td>Open, close, or ask whether the menu is open. Pass a function from a template. Open does nothing when read-only or disabled.</td></tr>
      <tr><td><code>emptyText</code></td><td><code>string</code></td><td>No matches / 无匹配项</td><td>Shown when the list itself has no options.</td></tr>
      <tr><td><code>emptySearchText</code></td><td><code>string</code></td><td>No results found / 未找到结果</td><td>Shown when a search matches nothing.</td></tr>
    </tbody>
  </table>
</div>

## MultiSelector Emits

<div class="component-api-table" role="region" aria-label="MultiSelector Emits" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Parameters</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>update:modelValue</code></td><td><code>value: (string | number)[]</code></td><td>Emitted when the selection changes.</td></tr>
      <tr><td><code>change</code></td><td><code>value, change?</code></td><td>Emitted when the selection changes. A create also passes <code>{ type: 'create', query }</code>.</td></tr>
      <tr><td><code>search</code></td><td><code>query: string</code></td><td>Emitted when the search text changes.</td></tr>
      <tr><td><code>openChange</code></td><td><code>isOpen: boolean</code></td><td>Emitted when the menu opens or closes.</td></tr>
      <tr><td><code>click</code></td><td><code>event: MouseEvent</code></td><td>Emitted for a click on the trigger, after the menu toggles. It cannot cancel the toggle.</td></tr>
      <tr><td><code>focus</code></td><td><code>event: FocusEvent</code></td><td>Emitted when the trigger takes focus.</td></tr>
      <tr><td><code>keydown</code></td><td><code>event: KeyboardEvent</code></td><td>Emitted for keys on the trigger that the built-in keyboard model leaves alone. Keys it handles and cancels are not emitted.</td></tr>
    </tbody>
  </table>
</div>

## MultiSelector Slots

<div class="component-api-table" role="region" aria-label="MultiSelector Slots" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Parameters</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>icon</code></td><td>—</td><td>Icon at the start of the trigger.</td></tr>
      <tr><td><code>option</code></td><td><code>{ option, selected, active }</code></td><td>Custom option.</td></tr>
      <tr><td><code>empty</code></td><td>—</td><td>Custom empty state.</td></tr>
      <tr><td><code>trigger</code></td><td><code>{ id, onClick, onKeyDown, onFocus, aria-haspopup, aria-expanded, aria-controls, aria-busy, triggerRef }</code></td><td>Replaces the whole field and trigger with your own control (a glyph in a row, a chip, an icon button). Spread the bindings onto it and pass <code>triggerRef</code> as <code>:ref</code> so the list anchors to it. The field chrome (label, status, clear, spinner) is not rendered.</td></tr>
    </tbody>
  </table>
</div>
