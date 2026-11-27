---
title: SVGIcon
---

# SVGIcon

Renders layered SVG definitions with variants, semantic colors, and optical stroke compensation.

::: tip Use Icon for everyday icons
For regular interface icons, use core's [Icon](/en/components/icon) (the Iconify approach, see the [icons guide](/en/guide/icons)). SVGIcon is only needed when one shape must switch between variants such as linear, bold, and twotone, and the shape has to be written as an `SVGIconDef` that marks each path's role.
:::

<script setup lang="ts">
import { labSvgIcon, labWeightedSvgIcon } from '../../../../components/lab-demos'
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

## Icons that follow the font weight

`WeightedSVGIcon` holds one drawing per weight (300 to 700) and shows the one that matches the text around it, so an icon in bold text draws its bold version with no prop. The drawings are static; CSS picks the one whose weight range contains the current weight.

<ClientOnly><DemoExample :demo="labWeightedSvgIcon" description="One bell icon beside text from weight 300 to 700." locale="en" title="Weighted icon" /></ClientOnly>

```ts
import { bellWeightedIcon, WeightedSVGIcon } from '@astryx-vue/lab'
```

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` | `WeightedIconDef` | Required | The icon: one drawing per weight range. |
| `size` | `'xsm' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Icon size, as for `SVGIcon`. |
| `color` | `SVGIconColor` | `'primary'` | Semantic color, as for `SVGIcon`. |
| `weight` | `300 \| 400 \| 500 \| 600 \| 700` | Follows the text | Pin the drawing to one weight. An ancestor can set `--astryx-icon-weight` to pin a whole subtree. |
| `sprite` | `boolean` | `false` | Reference the symbol from a `WeightedIconSprite` on the page instead of drawing inline. |

The weight is read from the surrounding text by a tiny probe font that the icon adds to its own document once (the page, an iframe, or a pop-out window). Until it decodes, and in a browser without container queries, the icon draws weight 400. A weight between two drawings, such as 450, shows one of its two neighbours.

Render `WeightedIconSprite` once with the icons a page uses and pass `sprite` to each icon when the same icon repeats many times, such as in list rows: each instance is a `<use>` reference, so the drawings are on the page once. Build your own icon with `buildWeightedIcon(name, { 300: svg, 400: svg, ... }, { weights })`: identical neighbouring drawings share one layer, and `weights` keeps only the weights your type scale can reach, so every other weight shows the nearest kept drawing. The 15 sample icons (`bellWeightedIcon`, `homeWeightedIcon`, and so on, collected as `weightedStarterIcons`) are samples of the format, not a full set.
