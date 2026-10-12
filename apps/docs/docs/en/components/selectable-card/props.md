---
layout: component-docs
title: Selectable Card
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="SelectableCard Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>-</td><td>Accessible name of the hidden checkbox.</td></tr>
      <tr><td><code>isSelected</code></td><td><code>boolean</code></td><td>-</td><td>Whether the card is selected. Bind with <code>v-model:isSelected</code>.</td></tr>
      <tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>The card ignores activation.</td></tr>
      <tr><td><code>variant</code></td><td><code>CardVariant</code></td><td><code>'default'</code></td><td>Background variant. A selected card uses that hue for the ring.</td></tr>
      <tr><td><code>elevation</code></td><td><code>CardElevation</code></td><td><code>'none'</code></td><td>Resting shadow. The selection ring is composed with it.</td></tr>
      <tr><td><code>padding</code></td><td><code>SpacingStep</code></td><td>-</td><td>Padding forwarded to <code>Card</code>.</td></tr>
      <tr><td><code>width</code></td><td><code>number | string</code></td><td>-</td><td>Width. Numbers are pixels.</td></tr>
      <tr><td><code>height</code></td><td><code>number | string</code></td><td>-</td><td>Height. Numbers are pixels.</td></tr>
      <tr><td><code>maxWidth</code></td><td><code>number | string</code></td><td>-</td><td>Maximum width.</td></tr>
    </tbody>
  </table>
</div>

## Events

<div class="component-api-table" role="region" aria-label="SelectableCard Events" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Payload</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr><td><code>update:isSelected</code></td><td><code>boolean</code></td><td>The next selected state.</td></tr>
      <tr><td><code>change</code></td><td><code>boolean</code></td><td>Emitted with <code>update:isSelected</code>.</td></tr>
    </tbody>
  </table>
</div>

## Slots

The default slot is the card body. Nested buttons and links keep their own activation.
