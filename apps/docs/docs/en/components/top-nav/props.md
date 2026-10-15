---
layout: component-docs
title: Top Nav
outline: false
footer: false
---

## TopNav Props

<div class="component-api-table" role="region" aria-label="TopNav Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>Localized “Top navigation”</td><td>Accessible name of the landmark.</td></tr>
      <tr><td><code>mobileQuery</code></td><td><code>string</code></td><td>-</td><td>When this media query matches, leading and center content moves into the mobile nav.</td></tr>
    </tbody>
  </table>
</div>

## TopNav slots

<div class="component-api-table" role="region" aria-label="TopNav slots" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>heading</code></td><td>Brand title. Stays on the bar at narrow widths.</td></tr>
      <tr><td><code>start</code></td><td>Content after the title.</td></tr>
      <tr><td><code>default</code></td><td>Items and menus laid out with <code>start</code>.</td></tr>
      <tr><td><code>center</code></td><td>Centered region. Turns the bar into three columns.</td></tr>
      <tr><td><code>end</code></td><td>Trailing actions. Stays on the bar at narrow widths.</td></tr>
    </tbody>
  </table>
</div>

## TopNavMenu Props

<div class="component-api-table" role="region" aria-label="TopNavMenu Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>-</td><td>Trigger label.</td></tr>
      <tr><td><code>items</code></td><td><code>TopNavMenuItem[]</code></td><td>-</td><td>Data items. The default slot can render <code>NavMenuItem</code> instead.</td></tr>
      <tr><td><code>showDelay</code></td><td><code>number</code></td><td><code>150</code></td><td>Hover open delay, in milliseconds.</td></tr>
      <tr><td><code>hideDelay</code></td><td><code>number</code></td><td><code>200</code></td><td>Pointer-leave close delay, in milliseconds.</td></tr>
    </tbody>
  </table>
</div>

## TopNavMegaMenu Props

<div class="component-api-table" role="region" aria-label="TopNavMegaMenu Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>-</td><td>Trigger label and accessible name of the panel.</td></tr>
      <tr><td><code>showDelay</code></td><td><code>number</code></td><td><code>150</code></td><td>Hover open delay, in milliseconds.</td></tr>
      <tr><td><code>hideDelay</code></td><td><code>number</code></td><td><code>250</code></td><td>Pointer-leave close delay, in milliseconds.</td></tr>
    </tbody>
  </table>
</div>

Put `TopNavMegaMenuItem` in the default slot and `TopNavMegaMenuFeaturedCard` in `featured`. Inside the drawer the same content becomes an accordion and is not a menu.

## TopNavHeading Props

<div class="component-api-table" role="region" aria-label="TopNavHeading Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>heading</code></td><td><code>string</code></td><td>-</td><td>Product or app name. Optional when the heading is only a logo.</td></tr>
      <tr><td><code>href</code></td><td><code>string</code></td><td>-</td><td>Link for the main title. Same as <code>headingHref</code>, which wins when both are set.</td></tr>
      <tr><td><code>headingHref</code></td><td><code>string</code></td><td>-</td><td>Link for the main title.</td></tr>
      <tr><td><code>superheading</code></td><td><code>string</code></td><td>-</td><td>Small line above the title.</td></tr>
      <tr><td><code>superheadingHref</code></td><td><code>string</code></td><td>-</td><td>Link for the line above the title.</td></tr>
      <tr><td><code>subheading</code></td><td><code>string</code></td><td>-</td><td>Small line below the title.</td></tr>
      <tr><td><code>subheadingHref</code></td><td><code>string</code></td><td>-</td><td>Link for the line below the title.</td></tr>
      <tr><td><code>logoLabel</code></td><td><code>string</code></td><td>-</td><td>Accessible name when the logo is a link and has no readable text beside it. Falls back to <code>heading</code>.</td></tr>
      <tr><td><code>as</code></td><td><code>NavLinkComponent</code></td><td><code>'a'</code></td><td>Link root used when an address is set. It receives <code>href</code> and <code>to</code>.</td></tr>
    </tbody>
  </table>
</div>

When only the main title has a link and there is no menu, the whole heading is one link. When there is a menu and no links, the whole heading opens the menu. When both are present, each line navigates on its own and only the chevron opens the menu.

## TopNavHeading slots

<div class="component-api-table" role="region" aria-label="TopNavHeading slots" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>logo</code></td><td>Mark in front of the title. Same place as <code>icon</code>; <code>logo</code> wins.</td></tr>
      <tr><td><code>icon</code></td><td>Icon in front of the title.</td></tr>
      <tr><td><code>end</code></td><td>Trailing content on the title row, such as a badge.</td></tr>
      <tr><td><code>menu</code></td><td>Popup menu, usually a <code>NavHeadingMenu</code>. The scope provides <code>close</code> and <code>focusRequest</code>.</td></tr>
    </tbody>
  </table>
</div>

## TopNavMegaMenuFeaturedCard Props

<div class="component-api-table" role="region" aria-label="TopNavMegaMenuFeaturedCard Props" tabindex="0">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>title</code></td><td><code>string</code></td><td>-</td><td>Card title.</td></tr>
      <tr><td><code>description</code></td><td><code>string</code></td><td>-</td><td>Supporting line under the title.</td></tr>
      <tr><td><code>href</code></td><td><code>string</code></td><td>-</td><td>Makes the whole card a link. With <code>linkLabel</code>, the link moves to the bottom of the card.</td></tr>
      <tr><td><code>image</code></td><td><code>string</code></td><td>-</td><td>Image shown above the text.</td></tr>
      <tr><td><code>imageAlt</code></td><td><code>string</code></td><td>-</td><td>Alternative text. Without it the image is decorative and skipped by assistive tech.</td></tr>
      <tr><td><code>linkLabel</code></td><td><code>string</code></td><td>-</td><td>Action text at the bottom of the card.</td></tr>
      <tr><td><code>linkHref</code></td><td><code>string</code></td><td>-</td><td>Destination of the action. Falls back to <code>href</code>.</td></tr>
      <tr><td><code>as</code></td><td><code>NavLinkComponent</code></td><td><code>'a'</code></td><td>Link root.</td></tr>
    </tbody>
  </table>
</div>
