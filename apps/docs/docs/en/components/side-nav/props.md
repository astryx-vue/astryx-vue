---
layout: component-docs
title: Side Nav
outline: false
footer: false
---

## SideNav Props

<div class="component-api-table" role="region" aria-label="SideNav Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>Localized “Sidebar”</td><td>Accessible name of the navigation landmark.</td></tr>
      <tr><td><code>collapsible</code></td><td><code>boolean | SideNavCollapsible</code></td><td><code>false</code></td><td>Allows the icon rail. An object can set the initial state, the built-in button, and a hotkey.</td></tr>
      <tr><td><code>isCollapsed</code></td><td><code>boolean</code></td><td>-</td><td>Controlled collapsed state for <code>v-model:is-collapsed</code>.</td></tr>
    </tbody>
  </table>
</div>

## SideNav events

<div class="component-api-table" role="region" aria-label="SideNav events" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>update:isCollapsed</code></td><td>Collapsed state change for <code>v-model:is-collapsed</code>.</td></tr>
      <tr><td><code>collapsedChange</code></td><td>Fired whenever the collapsed state changes.</td></tr>
    </tbody>
  </table>
</div>

## SideNav slots

<div class="component-api-table" role="region" aria-label="SideNav slots" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>default</code></td><td>Main navigation, usually sections and items.</td></tr>
      <tr><td><code>header</code></td><td>Brand block at the top.</td></tr>
      <tr><td><code>top</code></td><td>Extra content under the brand block.</td></tr>
      <tr><td><code>footer</code></td><td>Footer content, above the collapse button.</td></tr>
      <tr><td><code>footerIcons</code></td><td>Icons on the same row as the collapse button.</td></tr>
    </tbody>
  </table>
</div>

## SideNavSection Props

<div class="component-api-table" role="region" aria-label="SideNavSection Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>title</code></td><td><code>string</code></td><td>-</td><td>Group title. Stays available to assistive tech when collapsed.</td></tr>
      <tr><td><code>subtitle</code></td><td><code>string</code></td><td>-</td><td>Supporting line under the title.</td></tr>
      <tr><td><code>isHeaderHidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Hides the title visually.</td></tr>
    </tbody>
  </table>
</div>

## SideNavItem Props

<div class="component-api-table" role="region" aria-label="SideNavItem Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>-</td><td>Item name.</td></tr>
      <tr><td><code>href</code></td><td><code>string</code></td><td>-</td><td>Destination. With children, the label navigates and the chevron collapses.</td></tr>
      <tr><td><code>as</code></td><td><code>NavLinkComponent</code></td><td><code>'a'</code></td><td>Link root.</td></tr>
      <tr><td><code>iconClass</code></td><td><code>string</code></td><td>-</td><td>CSS icon class. Items without an icon are omitted while collapsed.</td></tr>
      <tr><td><code>isSelected</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Current page.</td></tr>
      <tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disables the item.</td></tr>
      <tr><td><code>collapsible</code></td><td><code>boolean | object</code></td><td>-</td><td>Whether children can collapse. <code>false</code> keeps them open.</td></tr>
    </tbody>
  </table>
</div>

## SideNavHeading Props

<div class="component-api-table" role="region" aria-label="SideNavHeading Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>heading</code></td><td><code>string</code></td><td>-</td><td>Product or app name.</td></tr>
      <tr><td><code>headingHref</code></td><td><code>string</code></td><td>-</td><td>Link for the main title.</td></tr>
      <tr><td><code>superheading</code></td><td><code>string</code></td><td>-</td><td>Small line above the title.</td></tr>
      <tr><td><code>subheading</code></td><td><code>string</code></td><td>-</td><td>Small line below the title.</td></tr>
      <tr><td><code>as</code></td><td><code>NavLinkComponent</code></td><td><code>'a'</code></td><td>Link root.</td></tr>
    </tbody>
  </table>
</div>
