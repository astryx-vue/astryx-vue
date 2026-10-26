---
title: 页面布局
---

# 页面布局

搭界面要从外往里搭。先把页面的骨架和每一块占多大地方定下来，再往里填内容。反过来做，先写内容再补容器，最后每一段都会自己发明一个盒子，页面就变成一列层层包着的卡片。

下面四步，一步一步往里走。

1. 选外壳：整页用 `AppShell`，还是页面里的一块用 `Layout`。
2. 分区域：页眉、正文、页脚、侧边各放什么。
3. 对齐：所有区域共用一条内容线。
4. 调间距：先定间距，再决定要不要密度更紧的组件。

## 第一步：选外壳

整页的外框交给 `AppShell`。它管顶栏、侧导航、横幅、正文，还会在窄屏把侧导航收进抽屉。

```vue
<script setup lang="ts">
import { AppShell } from '@astryx-vue/core/AppShell'
// TopBar、Nav、PageBody 换成你自己的组件
import TopBar from './TopBar.vue'
import Nav from './Nav.vue'
import PageBody from './PageBody.vue'
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

`AppShell` 的插槽有 `topNav`、`sideNav`、`banner`、默认的正文，以及窄屏抽屉用的 `mobileNav`。

`contentPadding` 是正文区的内边距，用间距刻度写。不传就贴边，由里面的 `Layout` 自己管边距——所以外壳和内层不要同时加内边距，不然会叠成两倍。

页面里的一块——一张卡片、一个对话框、Tab 里的一栏——用 `Layout`。`Layout` 不负责整页，它只在自己的范围里分区域。

## 第二步：分区域

`Layout` 最多分五块，默认插槽是正文，其余是具名插槽：

| 插槽 | 放什么 |
| --- | --- |
| `header` | 这一块的标题和主操作 |
| `start` | 起始边的侧栏或面板 |
| 默认插槽 | 主要内容，通常包一层 `LayoutContent` |
| `end` | 结束边的侧栏或面板 |
| `footer` | 提交、取消这类必须一直够得着的按钮 |

```vue
<script setup lang="ts">
import { Layout, LayoutContent, LayoutFooter, LayoutHeader } from '@astryx-vue/core/Layout'
import { Button } from '@astryx-vue/core/Button'
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

`height` 取 `fill`（默认）时，`Layout` 撑满容器，只有正文在中间滚动，页眉和页脚留在原地。取 `auto` 时随内容长高，整页一起滚。

页眉、页脚、正文都齐了以后，把它们之间的线交给 `defaultHasDividers` 一次开，不用每个区域各写一个 `hasDivider`。

## 第三步：对齐同一条内容线

`Layout` 的 `padding` 只写一次，它落在所有区域上：页眉、正文、页脚、两侧面板的左右内边距用的是同一个值。所以它们的文字自然对齐在同一条竖线上。
这条线会被两种写法打断，都很好躲：

- 在 `LayoutContent` 里再包一层带 `padding` 的 `div`，正文就比页眉往里缩了一截。
- 在页眉里自己写 `padding`，页眉就比正文往外多了一截。

要缩进某一块，用那个区域组件自己的 `padding`，或者干脆用 `HStack` 加 `gap`，别在区域外面再套一层盒子。

正文太长不好读时，用 `contentWidth` 限制宽度：数字按像素，也可以写 `'100%'`、`'40rem'`。宽度收紧以后，正文在中间居中，上下的分隔线还是拉满整行。

## 第四步：排局部，调间距

区域里再往下分，就该 `HStack`、`VStack`、`Grid` 出场了。它们只负责摆放，不画边框也不给底色。

```vue
<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Grid } from '@astryx-vue/core/Grid'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Button } from '@astryx-vue/core/Button'
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

`gap`、`padding` 收的是间距刻度：`2` 就是 `--astryx-spacing-2`，也就是 8px。写刻度而不是写 `16px`，主题换了、根字号变了，间距会跟着一起动。

`Grid` 的 `columns` 写数字就是固定那么多列（日历那种一周七格适合这么写）；写 `{ minWidth, max }` 就是按容器宽度自动增减列数。

间距定完，再看密度。同样一块内容，可以调的不止间距：

- 表格、列表这类一行一条的密集数据，用行和分隔线，不要每条包一张卡片。
- `Card` 留给独立的小部件、图集和设置分组。
- 侧栏、抽屉、卡片里放不下完整版式时，换成紧凑形态的组件（例如 `EmptyState` 的 `isCompact`）。

## 该做与不该做

| 指引 | 实践 |
| --- | --- |
| 推荐 | 先定外壳和区域，再写内容。 |
| 推荐 | 内边距只写一次，写在 `Layout` 或 `AppShell` 上。 |
| 推荐 | 区域之间的边界用分隔线，不用留白硬撑。 |
| 避免 | 每个区域各写一套 `padding`，文字线对不齐。 |
| 避免 | 每一块内容都包一张 `Card`，页面变成一列盒子。 |
| 避免 | 用 `div` 加内联 `margin` 代替 `HStack`、`VStack`、`Grid`。 |

## 接下来

- 窄屏下每个区域怎么变：见 [响应式布局](/guide/responsive)。
- 页眉页脚固定、侧边详情面板：见 [应用模式](/guide/patterns)。
- `Layout`、`AppShell`、`Stack`、`Grid` 的完整属性：见 [布局组件](/components/layout)、[AppShell](/components/app-shell)、[Stack](/components/stack)、[Grid](/components/grid)。
