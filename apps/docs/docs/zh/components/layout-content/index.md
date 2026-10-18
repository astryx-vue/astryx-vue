---
layout: component-docs
title: 布局正文
outline: false
footer: false
---

<script setup lang="ts">
import { layoutContentBasic } from '../../../../components/demos/layout-content'
</script>

## 使用方法

可滚动的主内容区域。

```ts
import { LayoutContent } from '@astryx-vue/core/Layout'
```

`LayoutContent` 拿走 `Layout` 里剩下的那块地：页眉、页脚和面板占完以后的空间归它；它自己带内边距，内容比这块地高的时候就在它里面滚动，页眉和页脚待在原地不动。

`isScrollable` 默认是开的。整个页面一起滚动、这块只需要跟着内容长高时，把它关掉。`padding` 会盖掉外层 `Layout` 传下来的内边距，写 `padding: 0` 就是通栏。`label` 和 `role` 给这块地一个地标角色，读屏软件的地标列表里就能直接跳过来。

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

## 示例

<DemoExample :demo="layoutContentBasic" title="基础" description="固定在顶部的页眉下面是一块可滚动的正文区域。把 LayoutContent 放进 Layout，主内容就自带内边距，内容溢出时也只在这一块里滚动。" locale="zh" />
