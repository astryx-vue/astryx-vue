---
layout: component-docs
title: usePressFeedback
outline: false
footer: false
---

## Parameters

This composable takes no parameters.

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
        <td>The marker attribute to spread on the element that paints the press (<code>data-astryx-pressable</code>). The styles this hook brings along paint <code>--astryx-color-overlay-pressed</code> at the press's strength on the first frame of a believed press and fade it over the release, keeping <code>:active</code> for a mouse.</td>
      </tr>
    </tbody>
  </table>
</div>
