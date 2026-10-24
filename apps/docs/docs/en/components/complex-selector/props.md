---
layout: component-docs
title: Complex Selector
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="ComplexSelector Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>-</td><td>Field label. It also names the popup.</td></tr>
      <tr><td><code>modelValue</code></td><td><code>Value</code></td><td>-</td><td>Current value. Bind with <code>v-model</code>.</td></tr>
      <tr><td><code>triggerLabel</code></td><td><code>string</code></td><td>-</td><td>Text on the trigger. Falls back to <code>placeholder</code>.</td></tr>
      <tr><td><code>placeholder</code></td><td><code>string</code></td><td>Select…</td><td>Shown when <code>triggerLabel</code> is empty.</td></tr>
      <tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Hide the visible label. The accessible name stays.</td></tr>
      <tr><td><code>description</code></td><td><code>string</code></td><td>-</td><td>Supporting text under the label.</td></tr>
      <tr><td><code>isOptional</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Marks the field optional.</td></tr>
      <tr><td><code>isRequired</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Marks the field required.</td></tr>
      <tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>The trigger does not open.</td></tr>
      <tr><td><code>isLoading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows a spinner on the trigger.</td></tr>
      <tr><td><code>status</code></td><td><code>FieldStatusInput</code></td><td>-</td><td>Error, warning, or success message.</td></tr>
      <tr><td><code>statusVariant</code></td><td><code>'attached' | 'detached' | 'tooltip'</code></td><td><code>'attached'</code></td><td>Where the status message sits.</td></tr>
      <tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>-</td><td>Tooltip on the label.</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Trigger size.</td></tr>
      <tr><td><code>width</code></td><td><code>number | string</code></td><td>-</td><td>Field width. Numbers are pixels.</td></tr>
      <tr><td><code>placement</code></td><td><code>PopoverPlacement</code></td><td><code>'below'</code></td><td>Where the popup opens.</td></tr>
      <tr><td><code>alignment</code></td><td><code>'start' | 'center' | 'end'</code></td><td><code>'start'</code></td><td>Popup alignment along the placement axis.</td></tr>
      <tr><td><code>startIcon</code></td><td><code>string | Component</code></td><td>-</td><td>Icon at the start of the built-in trigger.</td></tr>
      <tr><td><code>variant</code></td><td><code>'input' | 'secondary' | 'ghost'</code></td><td><code>'input'</code></td><td><code>input</code> is the bordered field. <code>secondary</code> matches a secondary button. <code>ghost</code> matches a toolbar button. On the latter two, an attached status becomes detached.</td></tr>
      <tr><td><code>containerClass</code> / <code>controlClass</code></td><td><code>class</code></td><td>—</td><td>The shell takes <code>container*</code> and the root class. The built-in button takes <code>control*</code>. A custom trigger ignores both and warns in development.</td></tr>
      <tr><td><code>renderTrigger</code></td><td><code>(props) =&gt; VNode</code></td><td>-</td><td>Replaces the field and the built-in trigger. Spread <code>props</code> onto your control. The <code>trigger</code> slot does the same job.</td></tr>
      <tr><td><code>handleRef</code></td><td><code>Ref | (handle) =&gt; void</code></td><td>-</td><td>Receives <code>open</code>, <code>close</code>, <code>toggle</code>, and <code>isOpen</code>. A template <code>ref</code> exposes the same methods.</td></tr>
      <tr><td><code>changeAction</code></td><td><code>(value) =&gt; void | Promise&lt;void&gt;</code></td><td>-</td><td>Runs after the value changes. While it is pending the trigger shows a spinner.</td></tr>
    </tbody>
  </table>
</div>

## Events

<div class="component-api-table" role="region" aria-label="ComplexSelector Events" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Payload</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr><td><code>update:modelValue</code></td><td><code>Value</code></td><td>The value passed to <code>commit</code>.</td></tr>
      <tr><td><code>change</code></td><td><code>Value</code></td><td>Emitted with <code>update:modelValue</code>.</td></tr>
      <tr><td><code>click</code></td><td><code>event: MouseEvent</code></td><td>Emitted for a click on the trigger, before the popup opens. Call <code>event.preventDefault()</code> to keep it closed. With the <code>trigger</code> slot or <code>renderTrigger</code> it runs after the toggle and cannot cancel it.</td></tr>
      <tr><td><code>keydown</code></td><td><code>event: KeyboardEvent</code></td><td>Emitted for keys on the trigger after the built-in handling, and receives every key, including the ArrowDown that opens the popup. With a custom trigger, keys the built-in handling cancels are not emitted.</td></tr>
      <tr><td><code>openChange</code></td><td><code>isOpen: boolean</code></td><td>Emitted whenever the surface opens or closes, however it happened: trigger, keyboard, light dismiss, Escape, <code>close()</code>, or the imperative handle.</td></tr>
    </tbody>
  </table>
</div>

## Slot

The default slot receives `value`, `commit`, `close`, and `state`. `state` is `{ isOpen, isBusy, triggerId, contentId }`. `value` includes a pending optimistic value.
