---
layout: lab-docs
title: SVGIcon
---

# SVGIcon

Renders layered SVG definitions with variants, semantic colors, and optical stroke compensation. Unlike core's Iconify integration, this component exposes per-shape variant control.

<script setup lang="ts">
import { labSvgIcon } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labSvgIcon" description="The same Home definition in linear, bold, twotone, bulk, and broken variants." locale="en" title="Icon variants" /></ClientOnly>

## Import

```ts
import { homeIcon, SVGIcon } from '@astryx-vue/lab'
```

The package includes `starterIcons` and definitions such as `bellIcon` and `homeIcon`; custom `SVGIconDef` objects are also supported.

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` | `SVGIconDef` | Required | Shape definition with primary and optional secondary layers. |
| `variation` | `'linear' \| 'bold' \| 'twotone' \| 'bulk' \| 'broken'` | `'linear'` | Variant preset. |
| `size` | `'xsm' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Icon size. |
| `color` | `'primary' \| 'secondary' \| 'disabled' \| 'accent' \| 'positive' \| 'negative' \| 'warning' \| 'inherit'` | `'primary'` | Semantic color. |
| `strokeWidth` | `number` | Size-dependent | Explicit stroke width. |

An `IconShape` has a `'fill'` or `'stroke'` role that controls its treatment across variants. Icons are decorative by default; `aria-label` or `aria-labelledby` opts into `role="img"`.
