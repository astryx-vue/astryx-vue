---
layout: component-docs
title: 堆叠项
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { stackItemFill } from '../../../../components/demos/stack-item'
</script>

## 使用方法

`Stack` 把子项排成一行或者一列，间距始终一致。子项之间的距离交给 `gap` 属性，不用自己算。

```ts
import { StackItem } from '@astryx-vue/core/Stack'
```

某个子项需要单独定尺寸时，用 `StackItem` 把它包一层。`size` 默认是 `static`，保持它本来该多大；改成 `fill`，它就把其他项剩下的空间占满。`crossAlignSelf` 只改这一项在交叉轴上的对齐，不影响同层其他项。`isScrollable` 让这一项自己成为一块滚动区域。

这层包装还顺手清掉了 flex 的默认最小尺寸（`min-width` 和 `min-height` 归零），所以里面塞一长串内容也不会把整行撑宽。

```vue
<script setup lang="ts">
import { HStack, StackItem } from '@astryx-vue/core/Stack'
</script>

<template>
  <HStack :gap="3">
    <StackItem size="static">
      固定宽度
    </StackItem>
    <StackItem size="fill">
      占满剩余空间
    </StackItem>
  </HStack>
</template>
```

<ComponentAnatomy />

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 用 `gap` 属性控制项目间距，而不是给子元素手动添加外边距，间距更容易保持一致。 |
| <Badge variant="success">推荐</Badge> | 希望某个项目拉伸并填满剩余空间时，给它包一层 `size="fill"` 的 `StackItem`，其余项目仍保持固有尺寸。 |
| <Badge variant="error">避免</Badge> | 为了换行而嵌套堆叠布局，优先给 `Stack` 设置 `wrap="wrap"` 让项目自动换行，结构会更扁平。 |

## 示例

<DemoExample :demo="stackItemFill" title="填满剩余空间" description="一个固定宽度的项，旁边是一个占满剩余空间的项。子项需要单独控制尺寸时，就用 StackItem 包一层。" locale="zh" />
