---
layout: component-docs
title: Clickable Card
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="ClickableCard Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>-</td><td>Accessible name of the hidden control.</td></tr>
      <tr><td><code>href</code></td><td><code>string</code></td><td>-</td><td>Address the card navigates to. Leave it unset to handle <code>click</code> instead.</td></tr>
      <tr><td><code>target</code></td><td><code>string</code></td><td>-</td><td>Browsing context for <code>href</code>. <code>_blank</code> opens a new tab.</td></tr>
      <tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>The card ignores activation.</td></tr>
      <tr><td><code>variant</code></td><td><code>CardVariant</code></td><td><code>'default'</code></td><td>Background variant, forwarded to <code>Card</code>.</td></tr>
      <tr><td><code>elevation</code></td><td><code>CardElevation</code></td><td><code>'none'</code></td><td>Resting shadow: none, low, med, or high.</td></tr>
      <tr><td><code>padding</code></td><td><code>SpacingStep</code></td><td>-</td><td>Padding forwarded to <code>Card</code>.</td></tr>
      <tr><td><code>width</code></td><td><code>number | string</code></td><td>-</td><td>Width. Numbers are pixels.</td></tr>
      <tr><td><code>height</code></td><td><code>number | string</code></td><td>-</td><td>Height. Numbers are pixels.</td></tr>
      <tr><td><code>maxWidth</code></td><td><code>number | string</code></td><td>-</td><td>Maximum width.</td></tr>
    </tbody>
  </table>
</div>

## Events

<div class="component-api-table" role="region" aria-label="ClickableCard Events" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Payload</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr><td><code>click</code></td><td><code>MouseEvent</code></td><td>The surface was activated. Nested controls do not emit it.</td></tr>
    </tbody>
  </table>
</div>

## Slots

The default slot is the card body.
