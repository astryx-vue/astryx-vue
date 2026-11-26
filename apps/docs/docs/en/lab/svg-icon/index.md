---
title: SVGIcon
---

# SVGIcon

Renders layered SVG definitions with variants, semantic colors, and optical stroke compensation.

::: tip Use Icon for everyday icons
For regular interface icons, use core's [Icon](/en/components/icon) (the Iconify approach, see the [icons guide](/en/guide/icons)). SVGIcon is only needed when one shape must switch between variants such as linear, bold, and twotone, and the shape has to be written as an `SVGIconDef` that marks each path's role.
:::

<script setup lang="ts">
import { labSvgIcon } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labSvgIcon" description="The same Home definition in linear, bold, twotone, bulk, and broken variants." locale="en" title="Icon variants" /></ClientOnly>

## Import

```ts
import { homeIcon, SVGIcon } from '@astryx-vue/lab'
```

The 16 shapes such as `homeIcon` and `bellIcon` (collected as `starterIcons`) are samples of this layered format, not a full icon set; pass your own `SVGIconDef` in real use.

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` | `SVGIconDef` | Required | Shape definition with primary and optional secondary layers. |
| `variation` | `'linear' \| 'bold' \| 'twotone' \| 'bulk' \| 'broken'` | `'linear'` | Variant preset. |
| `size` | `'xsm' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Icon size. |
| `color` | `'primary' \| 'secondary' \| 'disabled' \| 'accent' \| 'positive' \| 'negative' \| 'warning' \| 'inherit'` | `'primary'` | Semantic color. |
| `strokeWidth` | `number` | Size-dependent | Explicit stroke width. |

An `IconShape` has a `'fill'` or `'stroke'` role that controls its treatment across variants. Icons are decorative by default; `aria-label` or `aria-labelledby` opts into `role="img"`.
