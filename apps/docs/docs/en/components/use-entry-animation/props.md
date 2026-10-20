---
layout: component-docs
title: useEntryAnimation
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useEntryAnimation parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>preset</code></td>
        <td><code>'slideDown' | 'slideUp' | 'fadeIn' | 'scaleIn'</code></td>
        <td><code>'slideDown'</code></td>
        <td>Animation preset to apply on mount. <code>slideDown</code> drops in from above, <code>slideUp</code> rises from below, <code>fadeIn</code> only fades, and <code>scaleIn</code> fades while scaling up.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useEntryAnimation returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>entryClass</code></td>
        <td><code>string | null</code></td>
        <td>A shared motion class for the entry animation, or <code>null</code> if the element was rendered on initial page load (no animation needed). One of <code>astryx-motion-slide-in-below</code>, <code>astryx-motion-slide-in-above</code>, <code>astryx-motion-fade-in</code>, or <code>astryx-motion-scale-in</code>.</td>
      </tr>
    </tbody>
  </table>
</div>
