---
layout: component-docs
title: Media Theme
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { mediaThemeImageOverlay, mediaThemeLightScrim, mediaThemeOverview } from '../../../../components/demos/media-theme'
</script>

## Usage

`MediaTheme` is the provider for content on an inverted surface: an image overlay, a scrim, a toast, or a tooltip. It sets `data-astryx-media` so text, icons, and buttons use the on-dark or on-light colors. It does not paint a background. Put the surface color on the parent.

`mode` is required: `dark`, `light`, `auto`, or `off`. `auto` measures the parent background and picks the side that reads, or `off` when the surrounding text already clears 3:1. `fallback` is the side used before that measurement, and when the surface cannot be measured. The default is `dark`. `off` keeps the element and drops the media attribute, so children are not remounted.

`useMediaTheme()` returns that resolved mode. Import both from `@astryx-vue/core/Theme`.

```vue
<script setup lang="ts">
import { MediaTheme } from '@astryx-vue/core/Theme'
</script>

<template>
  <div style="background: var(--astryx-color-background-inverted, #171717)">
    <MediaTheme mode="auto">
      <p>Readable on this surface</p>
    </MediaTheme>
  </div>
</template>
```

A theme can add tokens for these surfaces with `onDark` and `onLight` on `defineTheme()`.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use it for content over a dark image, a scrim, or another inverted surface. |
| <Badge variant="success">Do</Badge> | Prefer <code>mode="auto"</code> when the surface color comes from a theme token. |
| <Badge variant="success">Do</Badge> | Set the background on the parent. MediaTheme only flips the token context. |
| <Badge variant="error">Don't</Badge> | Use it for page-wide dark mode. Use <code>Theme</code> with <code>mode="dark"</code> or <code>mode="system"</code>. |

## Examples

<DemoExample
  :demo="mediaThemeOverview"
  description="A compact media overlay showing MediaTheme adapting text, icons, badges, and button variants over an image-backed dark surface."
  locale="en"
  title="MediaTheme — Media Overlay"
/>

<DemoExample
  :demo="mediaThemeImageOverlay"
  description="A common image card pattern: place text and actions over a dark gradient and wrap the overlay content in MediaTheme mode=&quot;dark&quot;."
  locale="en"
  title="MediaTheme — Image Overlay"
/>

<DemoExample
  :demo="mediaThemeLightScrim"
  description="A light scrim over an image. Use MediaTheme mode=&quot;light&quot; so text and ghost buttons use dark-on-light tokens."
  locale="en"
  title="MediaTheme — Light Scrim"
/>
