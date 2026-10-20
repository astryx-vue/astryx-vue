---
layout: component-docs
title: usePressFeedback
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="usePressFeedback parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options.hasOverlay</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>Whether to bring the default press paint (the <code>astryx-pressable</code> class, a layer on <code>::after</code>). Pass false when the component paints the press itself from <code>--_press-paint-image</code> and only needs the marker.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="usePressFeedback returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>pressableProps</code></td>
        <td><code>Record&lt;string, string&gt;</code></td>
        <td>Spread with <code>v-bind</code> on the element that paints the press: the <code>data-astryx-pressable</code> marker, plus <code>class: 'astryx-pressable'</code> by default. Under a finger the controller writes <code>data-astryx-press="on"</code> while the press is believed and <code>"fading"</code> for the release. The default style paints <code>--astryx-color-overlay-pressed</code> at the press's strength on the first frame and fades it over 200 ms, keeping <code>:active</code> for a mouse.</td>
      </tr>
    </tbody>
  </table>
</div>
