---
title: 页面布局
---

# 页面布局

页面布局应当遵循自外向内的构建原则：先确定页面的整体骨架与各区块尺寸，再填充具体业务内容。如果先编写内容再补充容器，容易导致每块内容各自嵌套额外的包装层，形成多层卡片堆叠的混乱结构。

通常可以按以下四个步骤进行布局：

1. 选外壳：整页采用 `AppShell`，还是局部区域使用 `Layout`。
2. 分区域：规划页眉、正文、页脚及两侧面板的分布。
3. 对齐：保持各区域对齐在统一的内容线上。
4. 调间距：确定间距刻度，按需选择紧凑形态的组件。

## 第一步：选外壳

页面的顶层外框由 `AppShell` 管理。它负责组织顶栏、侧边导航、通告横幅与主要内容区域，并在窄屏视口下自动将侧边导航折叠进抽屉。

```vue
<script setup lang="ts">
import { AppShell } from '@astryx-vue/core/AppShell'
import Nav from './Nav.vue'
import PageBody from './PageBody.vue'
// TopBar、Nav、PageBody 换成你自己的组件
import TopBar from './TopBar.vue'
</script>

<template>
  <AppShell :content-padding="0" :mobile-nav="{ breakpoint: 'md' }">
    <template #topNav>
      <TopBar />
    </template>
    <template #sideNav>
      <Nav />
    </template>
    <PageBody />
  </AppShell>
</template>
```

`AppShell` 提供了 `topNav`、`sideNav`、`banner`、默认主体正文插槽，以及移动端抽屉专用的 `mobileNav` 插槽。

`contentPadding` 接收间距刻度数值。若未传值则默认贴边，此时由内部嵌套的 `Layout` 自行维护内边距。避免在外壳与内层容器上同时设置内边距，防止内边距叠加成双倍间距。

页面里的一块——一张卡片、一个对话框、Tab 里的一栏——用 `Layout`。`Layout` 不负责整页，它只在自己的范围里分区域。

## 第二步：分区域

`Layout` 支持切分为五个区域，默认插槽为主体内容，其余通过具名插槽承载：

| 插槽 | 放什么 |
| --- | --- |
| `header` | 区域标题与主要操作按钮 |
| `start` | 起始边的侧栏或辅助面板 |
| 默认插槽 | 主要内容区域，通常包裹一层 `LayoutContent` |
| `end` | 结束边的侧栏或详情面板 |
| `footer` | 固定在底部的操作按钮（如提交、取消） |

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Layout, LayoutContent, LayoutFooter, LayoutHeader } from '@astryx-vue/core/Layout'
</script>

<template>
  <Layout :padding="4" default-has-dividers>
    <template #header>
      <LayoutHeader>订单详情</LayoutHeader>
    </template>
    <LayoutContent>
      正文内容，超出时只在这一块里滚动。
    </LayoutContent>
    <template #footer>
      <LayoutFooter>
        <Button label="保存" />
      </LayoutFooter>
    </template>
  </Layout>
</template>
```

当 `height` 属性为 `fill`（默认值）时，`Layout` 撑满父容器高度，主体正文在中间独立滚动，页眉与页脚保持固定。设为 `auto` 时高度随内容自适应，与整页同步滚动。

配置各区域后，可通过 `defaultHasDividers` 统一开启各区域之间的分割线，无需在各个子组件上重复声明 `hasDivider`。

## 第三步：对齐统一内容线

`Layout` 上的 `padding` 属性会统一作用于所有子区域：页眉、正文、页脚及两侧面板共享相同的左右内边距基准，因此文本内容在垂直方向上能够自然对齐。

避免在子区域内部人为打断对齐线：

- 在 `LayoutContent` 里再包一层带 `padding` 的 `div`，正文就比页眉往里缩了一截。
- 在页眉里自己写 `padding`，页眉就比正文往外多了一截。

若需单独调整某一块的缩进，使用对应区域组件自带的 `padding` 属性，或者使用 `HStack` 配合 `gap` 布局，避免层层增加包装容器。

当正文行长过宽影响阅读时，可使用 `contentWidth` 约束内容宽度：支持传入像素数值，也可使用 `'100%'`、`'40rem'` 等 CSS 字符串。宽度受限后正文在区域内水平居中，上下分割线依然贯穿全宽。

## 第四步：排局部，调间距

在具体区域内部排列元素时，使用 `HStack`、`VStack` 与 `Grid` 完成定位排版。这些组件仅处理空间排列，不引入多余的边框与背景。

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { Grid } from '@astryx-vue/core/Grid'
import { HStack, VStack } from '@astryx-vue/core/Stack'
// OrderCard 换成你自己的组件
import OrderCard from './OrderCard.vue'
</script>

<template>
  <!-- 一行：标题在左，按钮在右 -->
  <HStack justify="between" align="center" :gap="3">
    <span>最近的订单</span>
    <Button label="刷新" variant="secondary" />
  </HStack>

  <!-- 一列：每两块之间 16px -->
  <VStack :gap="4">
    <OrderCard />
    <OrderCard />
  </VStack>

  <!-- 自动增减列：每列至少 240px，最多 4 列 -->
  <Grid :columns="{ minWidth: 240, max: 4 }" :gap="3">
    <Card v-for="item in items" :key="item.id" />
  </Grid>
</template>
```

`gap` 与 `padding` 接收间距刻度数值：例如 `2` 对应 `--astryx-spacing-2`，即 8px。使用设计令牌刻度而非直接写死 `16px` 等具体数值，可以在全局主题或根字号调整时自动保持比例协调。

`Grid` 的 `columns` 支持固定列数（如日历按周排列），也支持通过 `{ minWidth, max }` 按照容器可用宽度动态增减列数。

确定间距后，需注意界面密度设计：

- 表格与列表等多行密集数据场景，使用行元素配合分割线展示，避免为每行单独包裹卡片。
- `Card` 适合承载独立的仪表盘卡片、图表模块或设置分组。
- 在侧边栏、抽屉等有限空间内，可选用组件的紧凑形态（如 `EmptyState` 的 `isCompact` 属性）。

## 推荐实践与注意事项

| 指引 | 实践 |
| --- | --- |
| 推荐 | 先定外壳和区域，再写内容。 |
| 推荐 | 内边距只写一次，写在 `Layout` 或 `AppShell` 上。 |
| 推荐 | 区域之间的边界用分隔线，不用留白硬撑。 |
| 避免 | 每个区域各写一套 `padding`，文字线对不齐。 |
| 避免 | 每一块内容都包一张 `Card`，页面变成一列盒子。 |
| 避免 | 用 `div` 加内联 `margin` 代替 `HStack`、`VStack`、`Grid`。 |

## 接下来

- 移动端窄屏适配规则请见 [响应式布局](/guide/responsive)。
- 固定页眉页脚与侧边抽屉面板组合模式请见 [应用模式](/guide/patterns)。
- `Layout`、`AppShell`、`Stack`、`Grid` 的完整属性说明见 [布局组件](/components/layout)、[AppShell](/components/app-shell)、[Stack](/components/stack)、[Grid](/components/grid)。
