---
layout: component-docs
title: useLightbox
outline: false
footer: false
---

## Options

<div class="component-api-table" role="region" aria-label="useLightbox options" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>media</code></td>
        <td><code>LightboxMedia | readonly LightboxMedia[]</code></td>
        <td>—</td>
        <td>One image or video, or the gallery's array. An array opens as a gallery.</td>
      </tr>
      <tr>
        <td><code>hasZoom</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Lets images zoom, as on <code>Lightbox</code>.</td>
      </tr>
      <tr>
        <td><code>hasAutoPlay</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Plays a video when it is shown in an open viewer.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useLightbox returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>bindings</code></td>
        <td><code>ComputedRef</code></td>
        <td>Props and update listeners for <code>v-bind</code> on <code>Lightbox</code>.</td>
      </tr>
      <tr>
        <td><code>open</code></td>
        <td><code>(index?: number) =&gt; void</code></td>
        <td>Sets the gallery index (default 0) and opens the viewer.</td>
      </tr>
      <tr>
        <td><code>close</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Closes the viewer.</td>
      </tr>
      <tr>
        <td><code>isOpen</code></td>
        <td><code>Ref&lt;boolean&gt;</code></td>
        <td>Whether the viewer is open.</td>
      </tr>
      <tr>
        <td><code>index</code></td>
        <td><code>Ref&lt;number&gt;</code></td>
        <td>The index of the item shown.</td>
      </tr>
      <tr>
        <td><code>getTriggerProps</code></td>
        <td><code>(index: number) =&gt; LightboxTriggerProps</code></td>
        <td>Button role, <code>tabindex</code>, <code>aria-haspopup="dialog"</code>, click, and Enter or Space for a trigger that is not a native button.</td>
      </tr>
      <tr>
        <td><code>triggerProps</code></td>
        <td><code>ComputedRef&lt;LightboxTriggerProps&gt;</code></td>
        <td><code>getTriggerProps</code> for the first item.</td>
      </tr>
    </tbody>
  </table>
</div>
