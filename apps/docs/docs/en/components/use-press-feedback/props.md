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
      <tr>
        <td><code>options.isContainer</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>The element is a pressable container (a list row, a Token, a clickable card) that holds other controls. A finger pressing one of those controls does not run the container's action, so the container shows no press.</td>
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
        <td>Spread with <code>v-bind</code> on the element that paints the press: the <code>data-astryx-pressable</code> marker, plus <code>class: 'astryx-pressable'</code> by default. Under a finger the controller writes <code>data-astryx-press="on"</code> while the press is believed and <code>"fading"</code> for the release. The default style paints <code>--astryx-color-overlay-pressed</code> at the press's strength on the first frame and fades it on the theme's exit duration, keeping <code>:active</code> for a mouse. With <code>isContainer</code> it also carries the container marker <code>data-astryx-press-container</code>.</td>
      </tr>
      <tr>
        <td><code>pressActionProps</code></td>
        <td><code>Record&lt;string, string&gt;</code></td>
        <td>Spread with <code>v-bind</code> on a pressable container's own action element (a row's invisible link or button, a Token's main button): the <code>data-astryx-press-action</code> marker, so a finger pressing it still presses the container.</td>
      </tr>
    </tbody>
  </table>
</div>
