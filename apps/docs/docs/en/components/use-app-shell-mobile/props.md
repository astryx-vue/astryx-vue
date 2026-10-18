---
layout: component-docs
title: useAppShellMobile
outline: false
footer: false
---

## Returns

<div class="component-api-table" role="region" aria-label="useAppShellMobile returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>isMobile</code></td>
        <td><code>boolean</code></td>
        <td>Whether the current viewport is below the AppShell mobile navigation breakpoint. Use this to synchronize AppShell-adjacent mobile UI with the same breakpoint as mobile nav.</td>
      </tr>
      <tr>
        <td><code>isMobileNavOpen</code></td>
        <td><code>boolean</code></td>
        <td>Whether the AppShell-managed mobile navigation drawer is open.</td>
      </tr>
      <tr>
        <td><code>mobileNavId</code></td>
        <td><code>string | undefined</code></td>
        <td>DOM id of the mobile navigation drawer, set by AppShell. Point <code>aria-controls</code> of a custom toggle at this so screen-reader users know which element the toggle expands. Undefined outside an AppShell that manages the drawer.</td>
      </tr>
      <tr>
        <td><code>toggleMobileNav</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Toggle the AppShell-managed mobile navigation drawer. No-ops when mobile nav is disabled.</td>
      </tr>
      <tr>
        <td><code>openMobileNav</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Open the AppShell-managed mobile navigation drawer. No-ops when mobile nav is disabled.</td>
      </tr>
      <tr>
        <td><code>closeMobileNav</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Close the AppShell-managed mobile navigation drawer.</td>
      </tr>
      <tr>
        <td><code>isMobileNavEnabled</code></td>
        <td><code>boolean</code></td>
        <td>Whether AppShell mobile navigation is enabled and managed by AppShell. False when <code>mobileNav</code> is <code>false</code>, there is no nav content, or a fully custom <code>mobileNav</code> slot owns the drawer.</td>
      </tr>
      <tr>
        <td><code>hasAutoToggle</code></td>
        <td><code>boolean</code></td>
        <td>Whether AppShell auto-toggle behavior is enabled. False when <code>mobileNav.hasToggle</code> is set to <code>false</code>; combine with <code>isMobile</code> and <code>isMobileNavEnabled</code> before rendering custom toggles.</td>
      </tr>
      <tr>
        <td><code>hasSideNav</code></td>
        <td><code>boolean</code></td>
        <td>Whether the AppShell has a <code>sideNav</code> slot. Mobile navigation is only managed when there is nav content to show.</td>
      </tr>
    </tbody>
  </table>
</div>

The returned object is stable and reactive. Read the fields in a template or a computed and they follow the AppShell as the viewport changes.
