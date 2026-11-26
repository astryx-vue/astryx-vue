---
layout: component-docs
title: useAnimatedLayout
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useAnimatedLayoutFileTree } from '../../../../components/demos/use-animated-layout'
</script>

## 使用方法

一个组件变高或变矮时（比如展开树里的一个目录），它下面的内容会一下子跳到新位置。`useAnimatedLayout` 让这些内容滑过去，而不是跳过去。

用法分两步：把一个容器（滚动区域或面板）交给 `useAnimatedLayout`，拿回一个句柄；再把句柄传给尺寸会变的组件的 `animatedLayout` 属性。

```ts
import { useAnimatedLayout } from '@astryx-vue/core'
```

```vue
<script setup lang="ts">
import { useAnimatedLayout } from '@astryx-vue/core'
import { TreeList } from '@astryx-vue/core/TreeList'
import { useTemplateRef } from 'vue'

const panel = useTemplateRef<HTMLElement>('panel')
const animatedLayout = useAnimatedLayout({ containerRef: panel })
</script>

<template>
  <div ref="panel">
    <TreeList :items="items" :animated-layout="animatedLayout" />
    <p>备注</p>
  </div>
</template>
```

组件尺寸一变，它在容器里后面的内容都按主题的「移动」时长和曲线一起滑到新位置；展开出来的内容从边缘滑入，收起的内容先滑出、让出空间，再消失。展开箭头也按同样的节奏转动。

现在接受句柄的有 `Collapsible`、`TreeList`，以及 `useTableRowExpansion` 的 `animatedLayout` 配置。

- 只有容器里、排在变化组件后面的内容会动。容器外的内容直接落到新位置。
- 固定定位和吸顶（sticky 吸住时）的元素不动，滑动也不会滚动容器。
- 同一帧里同一个容器的多处变化合成一次滑动。
- 系统开启「减弱动态效果」时：触屏上换成短暂的淡入淡出，鼠标环境下直接落到新位置。
- 句柄只创建一次，容器在变化发生时才读取，所以 ref 之后换了元素也没关系。服务端渲染时不碰 DOM。

## 建议

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 把容器设成真正会被挤动的那一块：侧栏、卡片或滚动区域。 |
| <Badge variant="success">推荐</Badge> | 同一个容器里的组件共用一个句柄，它们的变化会合在一起滑。 |
| <Badge variant="error">避免</Badge> | 把整个页面当容器：变化下面的所有内容都会跟着滑，太抢眼。 |

## 示例

<DemoExample
  :demo="useAnimatedLayoutFileTree"
  description="展开、收起目录或下面的说明，后面的内容会滑到新位置。"
  locale="zh"
  title="useAnimatedLayout — 文件树"
/>
