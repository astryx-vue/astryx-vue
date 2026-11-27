---
title: SVGIcon
---

# SVGIcon

根据图形角色渲染多层级 SVG 图标，支持多种变体、语义颜色和光学描边补偿。

::: tip 日常图标请用 Icon
界面里的普通图标，推荐用 core 的 [Icon](/components/icon)（Iconify 方案，见[图标指南](/guide/icons)）。SVGIcon 只在同一个图形要切换 linear、bold、twotone 等变体时才需要，而且图形要写成标好每条路径角色的 `SVGIconDef`。
:::

<script setup lang="ts">
import { labSvgIcon, labWeightedSvgIcon } from '../../../../components/lab-demos'
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

## 跟随字重的图标

`WeightedSVGIcon` 每个字重（300 到 700）带一张图，显示和周围文字字重对得上的那一张，所以粗体文字里的图标自己画粗的版本，不用传任何属性。图本身是静态的，由 CSS 选出字重区间包含当前字重的那一张。

<ClientOnly><DemoExample :demo="labWeightedSvgIcon" description="同一个铃铛图标，挨着 300 到 700 字重的文字。" locale="zh" title="跟随字重的图标" /></ClientOnly>

```ts
import { bellWeightedIcon, WeightedSVGIcon } from '@astryx-vue/lab'
```

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `icon` | `WeightedIconDef` | 必填 | 图标：每个字重区间一张图。 |
| `size` | `'xsm' \| 'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸，和 `SVGIcon` 一样。 |
| `color` | `SVGIconColor` | `'primary'` | 语义颜色，和 `SVGIcon` 一样。 |
| `weight` | `300 \| 400 \| 500 \| 600 \| 700` | 跟随文字 | 固定画某个字重。祖先设 `--astryx-icon-weight` 可以固定一整棵子树。 |
| `sprite` | `boolean` | `false` | 引用页面上 `WeightedIconSprite` 里的 symbol，不在这里内联画。 |

字重由一个很小的探针字体从周围文字读出来，图标会把它加进自己所在的文档（页面、iframe 或弹出窗口），每个文档一次。字体解码之前、以及不支持容器查询的浏览器里，图标按 400 字重画。两张图之间的字重（比如 450）显示相邻两张里的一张。

同一个图标在页面上重复很多次（比如列表行）时，在页面上渲染一次 `WeightedIconSprite` 放进用到的图标，再给每个图标传 `sprite`：每个实例只是一个 `<use>` 引用，图只在页面上出现一次。自己的图标用 `buildWeightedIcon(name, { 300: svg, 400: svg, ... }, { weights })` 构建：相邻字重的图相同就共用一层，`weights` 只保留字阶够得到的字重，其余字重显示最近保留的那张。15 个示例图标（`bellWeightedIcon`、`homeWeightedIcon` 等，汇总成 `weightedStarterIcons`）只是这种格式的样例，不是完整图标集。
