---
layout: component-docs
title: useImageMode
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useImageMode parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>src</code></td>
        <td><code>MaybeRefOrGetter&lt;string | null | undefined&gt;</code></td>
        <td>—</td>
        <td>Image source URL to analyze. A plain string, a ref, or a getter. When null or undefined, the result is the fallback value. Required.</td>
      </tr>
      <tr>
        <td><code>options</code></td>
        <td><code>MaybeRefOrGetter&lt;UseImageModeOptions&gt;</code></td>
        <td><code>{}</code></td>
        <td>Optional configuration for the analysis. Read on each run, so a getter keeps it current.</td>
      </tr>
      <tr>
        <td><code>options.region</code></td>
        <td><code>ImageSampleRegion</code></td>
        <td>whole image</td>
        <td>Region to sample within the image, using normalized 0-1 coordinates <code>{ x, y, width, height }</code>.</td>
      </tr>
      <tr>
        <td><code>options.threshold</code></td>
        <td><code>number</code></td>
        <td><code>0.5</code></td>
        <td>Luminance threshold for the dark/light split. Below is dark, above is light.</td>
      </tr>
      <tr>
        <td><code>options.fallback</code></td>
        <td><code>'dark' | 'light' | null</code></td>
        <td><code>null</code></td>
        <td>Value returned while loading or on error.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useImageMode return value" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>mode</code></td>
        <td><code>Ref&lt;'dark' | 'light' | null&gt;</code></td>
        <td>Detected luminance mode of the image. Returns <code>null</code> while loading, or the fallback when <code>src</code> is null or undefined.</td>
      </tr>
    </tbody>
  </table>
</div>

The two pieces of the analysis are exported too: `perceptualLightness(r, g, b)` returns the APCA lightness of one color, and `imageModeFromPixels(pixels, threshold)` averages an RGBA buffer into `'dark'` or `'light'`.
