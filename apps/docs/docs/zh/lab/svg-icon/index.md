---
title: SVGIcon
---

# SVGIcon

根据图形角色渲染多层级 SVG 图标，支持多种变体、语义颜色和光学描边补偿。

::: tip 日常图标请用 Icon
界面里的普通图标，推荐用 core 的 [Icon](/components/icon)（Iconify 方案，见[图标指南](/guide/icons)）。SVGIcon 只在同一个图形要切换 linear、bold、twotone 等变体时才需要，而且图形要写成标好每条路径角色的 `SVGIconDef`。
:::

<script setup lang="ts">
import { labSvgIcon } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labSvgIcon" description="同一个 Home 图形分别以 linear、bold、twotone、bulk 和 broken 变体显示。" locale="zh" title="图标变体" /></ClientOnly>

## 导入

```ts
import { homeIcon, SVGIcon } from '@astryx-vue/lab'
```

`homeIcon`、`bellIcon` 等 16 个图形（合集为 `starterIcons`）是演示这种分层格式的样例，不是完整的图标库；实际使用时传入自己的 `SVGIconDef`。

## 属性

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `icon` | `SVGIconDef` | 必填 | 图形定义，包含主层和可选次层。 |
| `variation` | `'linear' \| 'bold' \| 'twotone' \| 'bulk' \| 'broken'` | `'linear'` | 变体预设。 |
| `size` | `'xsm' \| 'sm' \| 'md' \| 'lg'` | `'md'` | 图标尺寸。 |
| `color` | `'primary' \| 'secondary' \| 'disabled' \| 'accent' \| 'positive' \| 'negative' \| 'warning' \| 'inherit'` | `'primary'` | 语义颜色。 |
| `strokeWidth` | `number` | 随尺寸 | 直接指定描边宽度。 |

`IconShape` 的 `role` 为 `'fill'` 或 `'stroke'`，决定图形在不同变体下的表现。未提供无障碍名称时图标默认装饰性隐藏；传入 `aria-label` 或 `aria-labelledby` 后会使用 `role="img"`。
