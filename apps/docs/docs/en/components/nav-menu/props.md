---
layout: component-docs
title: Nav Menu
outline: false
footer: false
---

## NavMenu Props

<div class="component-api-table" role="region" aria-label="NavMenu Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>-</td><td>Accessible name of the menu.</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Menu width.</td></tr>
      <tr><td><code>focusRequest</code></td><td><code>'first' | 'last' | null</code></td><td><code>null</code></td><td>Moves focus to the first or last item after open.</td></tr>
    </tbody>
  </table>
</div>

## NavMenu events

<div class="component-api-table" role="region" aria-label="NavMenu events" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>close</code></td><td>Fired on Escape. <code>NavDisclosure</code> listens and closes the panel.</td></tr>
    </tbody>
  </table>
</div>

## NavMenuItem Props

<div class="component-api-table" role="region" aria-label="NavMenuItem Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>-</td><td>Item text.</td></tr>
      <tr><td><code>description</code></td><td><code>string</code></td><td>-</td><td>Supporting line under the text.</td></tr>
      <tr><td><code>href</code></td><td><code>string</code></td><td>-</td><td>Renders a link when set.</td></tr>
      <tr><td><code>as</code></td><td><code>NavLinkComponent</code></td><td><code>'a'</code></td><td>Link root.</td></tr>
      <tr><td><code>iconClass</code></td><td><code>string</code></td><td>-</td><td>CSS icon class.</td></tr>
      <tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disabled. Keyboard navigation skips it.</td></tr>
      <tr><td><code>keepOpen</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Leaves the menu open after activation.</td></tr>
      <tr><td><code>isMenuItem</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Uses <code>menuitem</code> inside a menu. Set false in a drawer.</td></tr>
    </tbody>
  </table>
</div>

## NavDisclosure Props

<div class="component-api-table" role="region" aria-label="NavDisclosure Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>-</td><td>Accessible name of the popup.</td></tr>
      <tr><td><code>placement</code></td><td><code>'above' | 'below' | 'start' | 'end'</code></td><td><code>'below'</code></td><td>Position relative to the trigger.</td></tr>
      <tr><td><code>alignment</code></td><td><code>'start' | 'center' | 'end'</code></td><td><code>'start'</code></td><td>Cross-axis alignment.</td></tr>
      <tr><td><code>hover</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Opens after a hover delay and closes after the pointer leaves.</td></tr>
      <tr><td><code>showDelay</code></td><td><code>number</code></td><td><code>150</code></td><td>Hover open delay, in milliseconds.</td></tr>
      <tr><td><code>hideDelay</code></td><td><code>number</code></td><td><code>200</code></td><td>Pointer-leave close delay, in milliseconds.</td></tr>
    </tbody>
  </table>
</div>

## NavHeadingMenu Props

<div class="component-api-table" role="region" aria-label="NavHeadingMenu Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>-</td><td>Accessible name of the menu.</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Menu width, also passed through as item padding.</td></tr>
      <tr><td><code>minWidth</code></td><td><code>number | string</code></td><td>-</td><td>Overrides the width that comes from the size. A number is pixels.</td></tr>
      <tr><td><code>focusRequest</code></td><td><code>'first' | 'last' | null</code></td><td>-</td><td>Moves focus to the first or last item after open. A heading menu slot passes this in.</td></tr>
    </tbody>
  </table>
</div>

## NavHeadingMenu events

<div class="component-api-table" role="region" aria-label="NavHeadingMenu events" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>close</code></td><td>Fired on Escape.</td></tr>
    </tbody>
  </table>
</div>

## NavHeadingMenuItem Props

<div class="component-api-table" role="region" aria-label="NavHeadingMenuItem Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>-</td><td>Primary text. The default slot wins when it is set.</td></tr>
      <tr><td><code>description</code></td><td><code>string</code></td><td>-</td><td>Supporting line under the text.</td></tr>
      <tr><td><code>href</code></td><td><code>string</code></td><td>-</td><td>Renders a link when set.</td></tr>
      <tr><td><code>as</code></td><td><code>NavLinkComponent</code></td><td><code>'a'</code></td><td>Link root.</td></tr>
      <tr><td><code>iconClass</code></td><td><code>string</code></td><td>-</td><td>CSS icon class.</td></tr>
      <tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disabled. Arrow keys and typeahead skip it.</td></tr>
    </tbody>
  </table>
</div>
