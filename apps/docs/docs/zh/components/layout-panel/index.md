---
layout: component-docs
title: 布局面板
outline: false
footer: false
---

<script setup lang="ts">
import { layoutPanelNavigation } from '../../../../components/demos/layout-panel'
</script>

## 使用方法

放导航、设置或者详情检视的侧栏。

```ts
import { LayoutPanel } from '@astryx-vue/core/Layout'
```

`LayoutPanel` 是 `Layout` 侧边那一块，放在 `start` 或 `end` 插槽里。它自己占一块宽度，自己管滚动，跟 `LayoutContent` 互不影响，所以导航列表或者详情检视会一直待着，只有中间那块在动。

`width` 写数字按像素。宽度交给 `ResizeHandle` 拖的时候，改成把 `useResizable` 返回的 `props` 传给 `resizable`，面板宽度就跟着拖拽走。`hasDivider` 画画朝内容的那条边；同一条边上已经有拖拽分隔条在画线了，就别再开。`isScrollable` 默认是开的，这块只需要跟着内容长高时就关掉。

```vue
<script setup lang="ts">
import { Layout, LayoutContent, LayoutPanel } from '@astryx-vue/core/Layout'
import { List, ListItem } from '@astryx-vue/core/List'
</script>

<template>
  <Layout>
    <template #start>
      <LayoutPanel :width="200" role="navigation" label="分区">
        <List>
          <ListItem is-selected label="概览" />
          <ListItem label="分析" />
          <ListItem label="设置" />
        </List>
      </LayoutPanel>
    </template>
    <LayoutContent>
      这里放正文。
    </LayoutContent>
  </Layout>
</template>
```

## 示例

<DemoExample :demo="layoutPanelNavigation" title="导航" description="固定宽度的侧栏放导航列表，右边是主内容。侧栏用 Layout 的 start 或 end 插槽，交给 LayoutPanel。" locale="zh" />
