---
layout: component-docs
title: Nav Item
outline: false
footer: false
---

## NavItem Props

<div class="component-api-table" role="region" aria-label="NavItem Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>-</td><td>Visible text. Becomes the accessible name in icon-only mode.</td></tr>
      <tr><td><code>href</code></td><td><code>string</code></td><td>-</td><td>Renders a link when set and the item is not disabled.</td></tr>
      <tr><td><code>as</code></td><td><code>NavLinkComponent</code></td><td><code>'a'</code></td><td>Link root, for example <code>RouterLink</code>.</td></tr>
      <tr><td><code>target</code></td><td><code>string</code></td><td>-</td><td>Link target. <code>_blank</code> also adds <code>noopener noreferrer</code>.</td></tr>
      <tr><td><code>rel</code></td><td><code>string</code></td><td>-</td><td>Link rel.</td></tr>
      <tr><td><code>isSelected</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Current page. Sets <code>aria-current="page"</code>.</td></tr>
      <tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Renders a button that is removed from tab order.</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Height and padding.</td></tr>
      <tr><td><code>iconClass</code></td><td><code>string</code></td><td>-</td><td>CSS icon class, such as <code>i-carbon-home</code>.</td></tr>
      <tr><td><code>selectedIconClass</code></td><td><code>string</code></td><td>-</td><td>Replaces <code>iconClass</code> while selected.</td></tr>
      <tr><td><code>isIconOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows the icon only. The label stays for assistive tech.</td></tr>
      <tr><td><code>block</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Stretches to the row width.</td></tr>
      <tr><td><code>plain</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Drops the item chrome so a parent can paint it.</td></tr>
      <tr><td><code>expanded</code></td><td><code>boolean</code></td><td>-</td><td>Whether a nested group is open. Omitted when unset.</td></tr>
      <tr><td><code>controls</code></td><td><code>string</code></td><td>-</td><td>Id written to <code>aria-controls</code>.</td></tr>
      <tr><td><code>hasPopup</code></td><td><code>string</code></td><td>-</td><td>Popup type written to <code>aria-haspopup</code>.</td></tr>
    </tbody>
  </table>
</div>

## NavItem events

<div class="component-api-table" role="region" aria-label="NavItem events" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>click</code></td><td>Fired on click. A disabled item prevents the default action first.</td></tr>
    </tbody>
  </table>
</div>

## NavItem slots

<div class="component-api-table" role="region" aria-label="NavItem slots" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>default</code></td><td>Replaces the visible label.</td></tr>
      <tr><td><code>icon</code></td><td>Icon content. Used ahead of the glyph from <code>iconClass</code>.</td></tr>
      <tr><td><code>selectedIcon</code></td><td>Icon shown while selected.</td></tr>
      <tr><td><code>end</code></td><td>Trailing content, such as a chevron or count.</td></tr>
    </tbody>
  </table>
</div>

## NavIcon Props

<div class="component-api-table" role="region" aria-label="NavIcon Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>iconClass</code></td><td><code>string</code></td><td>-</td><td>CSS icon class drawn on the round badge.</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Badge diameter.</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td>-</td><td>Accessible name. Without it the badge is hidden from assistive tech.</td></tr>
    </tbody>
  </table>
</div>
