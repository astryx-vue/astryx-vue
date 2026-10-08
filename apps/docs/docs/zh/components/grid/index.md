---
layout: component-docs
title: 网格布局
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { gridAlignment, gridBasic, gridColumns, gridSpan } from '../../../../components/demos/grid'
</script>

## 使用方法

`Grid` 用 CSS 网格把子元素排进行和列，解决的是二维布局：卡片墙、仪表盘面板，以及任何需要多列对齐的区域。一维排布交给 `Stack` 系列，只有当行和列都要对齐时才换成 `Grid`。

给出列配置就能开始使用：

```vue
<script setup lang="ts">
import { Grid } from '@astryx-vue/core/Grid'
</script>

<template>
  <Grid :columns="3" :gap="4">
    <div>第一项</div>
    <div>第二项</div>
    <div>第三项</div>
  </Grid>
</template>
```

`columns` 传数字表示固定列数，每一列等宽。传对象则表示响应式列：`minWidth` 是每列的最小宽度（像素），网格按可用宽度自己决定能放几列，窄屏时自动减少列数。

```vue
<template>
  <Grid :columns="{ minWidth: 280 }" :gap="4">
    <div>第一项</div>
    <div>第二项</div>
  </Grid>
</template>
```

响应式配置里还有两个可选项。`repeat` 决定最后一行没排满时留下的空隙如何处理：`'fill'`（默认）保留空的轨道，所以每列宽度始终一致；`'fit'` 收起空轨道，让实际存在的列把整行撑满。`max` 限制最多几列，避免大屏上每一列被拉得过宽。列数上限加在轨道的最小尺寸上而不是最大尺寸上，因此列数不会超过 `max`，而排不满时留下的列依然会撑满整行，右侧不会出现空白。

`gap` 控制行列间距，`rowGap` 与 `columnGap` 可以分别在行、列方向覆盖它，取值都来自 Astryx 的间距刻度。`rowHeight` 用像素固定隐式行高，配合 `GridSpan` 的 `rows` 可以做出跨若干行的布局。

需要某一项跨列或跨行时，用 `GridSpan` 包一层。它的 `columns` 给数字表示跨几列，给 `'full'` 表示跨越整行；`rows` 表示跨几行。

```vue
<template>
  <Grid :columns="4" :gap="3">
    <GridSpan :columns="2">
      跨两列的项目
    </GridSpan>
    <div>普通项目</div>
    <GridSpan columns="full">
      跨越整行
    </GridSpan>
  </Grid>
</template>
```

`width`、`height`、`maxWidth`、`minHeight` 控制容器自身的尺寸，数字按像素处理，字符串原样使用。`align` 控制项目在行内的垂直对齐（`align-items`），`justify` 控制水平对齐（`justify-items`），两者默认都是 `stretch`，也就是撑满所在的单元格。

列模板写在容器的 CSS 变量 `--astryx-grid-template-columns` 上，而不是内联的 `grid-template-columns` 声明。因此在自有样式或媒体查询里重写这个变量、或者直接重写 `grid-template-columns`，都能生效。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 布局需要随屏幕宽度变化时用响应式列（`:columns="{ minWidth: 280 }"`），让网格自己决定列数，不必再写媒体查询。 |
| <Badge variant="success">推荐</Badge> | 大屏上用 `max` 给列数封顶。没有上限时每一列会被拉得很宽，一行里的内容彼此离得太远。 |
| <Badge variant="success">推荐</Badge> | 需要每列宽度一致时保留默认的 `repeat: 'fill'`；希望不足一行的项目撑开剩余空间时改用 `'fit'`。 |
| <Badge variant="success">推荐</Badge> | 间距交给 `gap`，容器自身的尺寸交给 `width`、`maxWidth` 等属性，不要在子元素上再加外边距。 |
| <Badge variant="error">避免</Badge> | 手写 `display: grid` 和 `grid-template-columns` 并自己计算间距，`Grid` 已经把这些处理好了。 |
| <Badge variant="error">避免</Badge> | 用允许换行的 `HStack` 冒充网格。一维排布用 `Stack`，行和列都要对齐时才用 `Grid`。 |
| <Badge variant="error">避免</Badge> | 用 `columns` 的对象形式表达固定列数。固定列数直接传数字，语义更清楚。 |

## 示例

<DemoExample
  :demo="gridBasic"
  description="响应式列：网格按可用宽度自己决定列数，窄屏时自动折行。用对象形式给出每列的最小宽度即可。"
  locale="zh"
  title="响应式列"
/>

<DemoExample
  :demo="gridColumns"
  description="固定列数：传数字得到等宽的列，rowGap 与 columnGap 需要分别控制时按轴覆盖 gap。"
  locale="zh"
  title="固定列数"
/>

<DemoExample
  :demo="gridSpan"
  description="用 GridSpan 让某一项跨越多列：columns 给数字表示列数，给 'full' 则跨越整行。"
  locale="zh"
  title="跨越列与行"
/>

<DemoExample
  :demo="gridAlignment"
  description="align 控制项目在行内的垂直对齐，justify 控制水平对齐。默认都是 stretch，也就是撑满单元格。"
  locale="zh"
  title="对齐方式"
/>
