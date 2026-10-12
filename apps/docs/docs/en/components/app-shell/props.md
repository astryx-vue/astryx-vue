---
layout: component-docs
title: App Shell
outline: false
footer: false
---

## App Shell Props

<div class="component-api-table" role="region" aria-label="App Shell Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>variant</code></td>
        <td><code>'wash' | 'surface' | 'section' | 'elevated'</code></td>
        <td><code>'elevated'</code></td>
        <td>Page background. <code>elevated</code> with both a top nav and a side nav, on a wide viewport, puts the content on a rounded backdrop.</td>
      </tr>
      <tr>
        <td><code>contentPadding</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>Padding of the content region. Omit it and the content is flush.</td>
      </tr>
      <tr>
        <td><code>height</code></td>
        <td><code>'fill' | 'auto'</code></td>
        <td><code>'fill'</code></td>
        <td><code>fill</code> uses <code>100dvh</code>. An inline height overrides that length.</td>
      </tr>
      <tr>
        <td><code>mobileNav</code></td>
        <td><code>false | AppShellMobileNav</code></td>
        <td>-</td>
        <td><code>false</code> turns the drawer off. An object sets <code>breakpoint</code> (<code>sm</code> 640, <code>md</code> 768, <code>lg</code> 1024, <code>xl</code> 1280, <code>2xl</code> 1536, or <code>none</code>), <code>isOpen</code>, and <code>hasToggle</code>.</td>
      </tr>
      <tr>
        <td><code>mobileNavOpen</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td><code>v-model:mobile-nav-open</code>. The component also emits <code>mobileNavOpenChange</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

`SpacingStep` accepts `0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10`. The default breakpoint is <code>md</code>, and the query is <code>(width &lt; Npx)</code>. <code>hasToggle</code> defaults to true.

## Slots

<div class="component-api-table" role="region" aria-label="App Shell Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>Page content, rendered in the main region.</td>
      </tr>
      <tr>
        <td><code>topNav</code></td>
        <td>The top bar, usually a <code>TopNav</code>. On a narrow viewport its items move into the shell drawer.</td>
      </tr>
      <tr>
        <td><code>sideNav</code></td>
        <td>The side bar, usually a <code>SideNav</code>. Below the breakpoint it renders inside the drawer instead of beside the content.</td>
      </tr>
      <tr>
        <td><code>banner</code></td>
        <td>A banner between the navigation and the content.</td>
      </tr>
      <tr>
        <td><code>mobileNav</code></td>
        <td>Replaces the default drawer.</td>
      </tr>
    </tbody>
  </table>
</div>

## useAppShellMobile

Import it from <code>@astryx-vue/core</code>. It returns the nearest shell:

<div class="component-api-table" role="region" aria-label="useAppShellMobile" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>isMobile</code></td>
        <td><code>boolean</code></td>
        <td>True when the viewport is below the shell breakpoint.</td>
      </tr>
      <tr>
        <td><code>isMobileNavOpen</code></td>
        <td><code>boolean</code></td>
        <td>Whether the drawer is open.</td>
      </tr>
      <tr>
        <td><code>isMobileNavEnabled</code></td>
        <td><code>boolean</code></td>
        <td>False outside a shell, or when <code>mobileNav</code> is false.</td>
      </tr>
      <tr>
        <td><code>hasAutoToggle</code></td>
        <td><code>boolean</code></td>
        <td>Whether the shell draws the menu button.</td>
      </tr>
      <tr>
        <td><code>hasSideNav</code></td>
        <td><code>boolean</code></td>
        <td>Whether the side nav slot is set.</td>
      </tr>
      <tr>
        <td><code>mobileNavId</code></td>
        <td><code>string</code></td>
        <td>Id of the drawer. Top nav items teleport into <code>#${id}-items</code>.</td>
      </tr>
      <tr>
        <td><code>toggleMobileNav</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Toggles the drawer. A no-op outside a shell.</td>
      </tr>
      <tr>
        <td><code>openMobileNav</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Opens the drawer.</td>
      </tr>
      <tr>
        <td><code>closeMobileNav</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Closes the drawer.</td>
      </tr>
    </tbody>
  </table>
</div>

The main region is <code>#astryx-app-shell-main</code>, a <code>div</code> with <code>role="main"</code> and <code>tabindex="-1"</code>. The skip link label follows the active locale.

## Native attributes

`AppShell` renders a `<div>`. HTML attributes, <code>aria-*</code>, <code>data-*</code>, <code>class</code>, and <code>style</code> go to that element. <code>class</code> is merged. The root sets <code>data-variant</code> and <code>data-height</code>.
