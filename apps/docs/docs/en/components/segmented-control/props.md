---
layout: component-docs
title: Segmented Control
outline: false
footer: false
---

## SegmentedControl Props

<div class="component-api-table" role="region" aria-label="SegmentedControl Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>modelValue</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>The selected segment's value. Required, and bound with <code>v-model</code>. The segment whose <code>value</code> matches it is the selected one.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Accessible name for the radio group, applied as <code>aria-label</code>. Never rendered visually. Required.</td>
      </tr>
      <tr>
        <td><code>size</code></td>
        <td><code>SegmentedControlSize</code></td>
        <td><code>'md'</code></td>
        <td>Size of the control, which sets the height of every segment. Optional: <code>sm</code>, <code>md</code>, <code>lg</code>.</td>
      </tr>
      <tr>
        <td><code>layout</code></td>
        <td><code>SegmentedControlLayout</code></td>
        <td><code>'hug'</code></td>
        <td>How the segments spend the available width. <code>hug</code> sizes to content, capped at the container so narrow labels truncate; <code>fill</code> stretches the segments equally across the container.</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Whether the entire control is disabled. No segment can be selected, and the control leaves the tab order.</td>
      </tr>
      <tr>
        <td><code>disabledMessage</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Why the control is disabled, shown in a tooltip on hover and on keyboard focus. Together with <code>isDisabled</code> the control keeps <code>aria-disabled</code> instead of dropping out of the tab order, so the reason reaches keyboard and assistive technology while selection stays blocked. Use it instead of wrapping a disabled control in a Tooltip.</td>
      </tr>
    </tbody>
  </table>
</div>

## SegmentedControl events

<div class="component-api-table" role="region" aria-label="SegmentedControl Events" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>update:modelValue</code></td>
        <td>Fired when the selection changes, backing the <code>v-model</code> binding. Clicking the already selected segment does not fire it.</td>
      </tr>
      <tr>
        <td><code>change</code></td>
        <td>Fired when the selection changes, for work that follows a switch such as loading data.</td>
      </tr>
    </tbody>
  </table>
</div>

## SegmentedControl Slots

<div class="component-api-table" role="region" aria-label="SegmentedControl Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>The <code>SegmentedControlItem</code> children, in the order they appear.</td>
      </tr>
    </tbody>
  </table>
</div>

## SegmentedControlItem Props

<div class="component-api-table" role="region" aria-label="SegmentedControlItem Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>value</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Unique value for this segment, matched against the control's <code>v-model</code>. Required.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>The segment's name, rendered as its visible text and used as the accessible name when the label is hidden. Required.</td>
      </tr>
      <tr>
        <td><code>isLabelHidden</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Whether the label is visually hidden, leaving only the icon. The label still becomes <code>aria-label</code>.</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Whether this single segment is disabled. It keeps its place in the row but cannot be selected, and the arrow keys and tab order skip it.</td>
      </tr>
    </tbody>
  </table>
</div>

## SegmentedControlItem Slots

<div class="component-api-table" role="region" aria-label="SegmentedControlItem Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>icon</code></td>
        <td>Artwork shown before the label, usually an icon class or your own SVG. It is hidden from assistive technology, since the segment already carries a name.</td>
      </tr>
    </tbody>
  </table>
</div>

## Native attributes

The root element is a `div`, and each segment is a `button`.

The following go to the root element:

- HTML attributes.
- `aria-*` attributes (<code>aria-label</code>, <code>aria-disabled</code>, and <code>aria-describedby</code> are derived from `label` and `isDisabled` and cannot be overridden).
- `data-*` attributes.
- `class`.
- `style`.

A `class` on `SegmentedControlItem` is merged with the component's own class names. `role`, `aria-checked`, `aria-disabled`, `aria-label` (written only when `isLabelHidden` is set), `tabindex`, and `data-value` are computed by the component and override native attributes of the same name.
