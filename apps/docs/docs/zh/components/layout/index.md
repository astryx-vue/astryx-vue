---
layout: component-docs
title: 布局
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { layoutCard, layoutContentOnly, layoutContentWidth, layoutDualPanel, layoutFullBleed, layoutSidebar } from '../../../../components/demos/layout'
</script>

## 使用方法

`Layout` 最多排五个区域：页眉、起始边、正文、结束边、页脚。默认插槽是正文，其余是具名插槽。页面外框交给 `AppShell`；`Layout` 用在页面内部、卡片或对话框里。内容只是一行或一列时用 `HStack` 或 `VStack`。

```vue
<script setup lang="ts">
import { Layout, LayoutContent, LayoutHeader } from '@astryx-vue/core/Layout'
</script>

<template>
  <Layout>
    <template #header>
      <LayoutHeader has-divider>
        订单
      </LayoutHeader>
    </template>
    <LayoutContent>
      选择一笔订单。
    </LayoutContent>
  </Layout>
</template>
```

`height` 取 `fill` 或 `auto`。`fill` 撑满容器，正文在中间滚动；`auto` 随内容长高。`contentWidth` 限制正文宽度并居中，分隔线仍然拉满。百分比、`fit-content`、`max-content`、`min-content` 或裸 `var()` 走约束宽度。`padding` 只作用于这一层，不会传给嵌套的 `Layout`。页眉或页脚没有写 `hasDivider` 时，用 `defaultHasDividers`。

`LayoutHeader`、`LayoutFooter`、`LayoutContent`、`LayoutPanel` 是四个区域组件。面板的 `width` 传数字时按像素。宽度由 `ResizeHandle` 控制时，把 `useResizable` 返回的 `props` 传给 `resizable`。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 页眉、侧栏或页脚需要固定，正文单独滚动时用 Layout。 |
| <Badge variant="success">推荐</Badge> | 滚动放在 `LayoutContent` 上，页眉和页脚留在外面。 |
| <Badge variant="error">避免</Badge> | 用 Layout 当应用外框。顶部和侧边导航用 AppShell。 |
| <Badge variant="error">避免</Badge> | 面板分隔线和拖拽分隔条的线画在同一条边上。 |

## 示例

<DemoExample
  :demo="layoutCard"
  description="固定高度的卡片。页眉和页脚不动，正文滚动。"
  locale="zh"
  title="卡片"
/>

<DemoExample
  :demo="layoutContentOnly"
  description="只有正文，没有页眉和页脚。"
  locale="zh"
  title="仅正文"
/>

<DemoExample
  :demo="layoutContentWidth"
  description="contentWidth 为 360 时正文居中。分隔线仍然拉满。"
  locale="zh"
  title="内容宽度"
/>

<DemoExample
  :demo="layoutDualPanel"
  description="正文两侧各有一块面板。"
  locale="zh"
  title="双侧面板"
/>

<DemoExample
  :demo="layoutFullBleed"
  description="LayoutContent 的 padding 为 0 时，Section 可以铺到卡片边缘。"
  locale="zh"
  title="通栏"
/>

<DemoExample
  :demo="layoutSidebar"
  description="起始边是 role 为 navigation 的面板，页脚放操作按钮。"
  locale="zh"
  title="侧栏"
/>
