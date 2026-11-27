---
layout: component-docs
title: useReorderable
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useReorderablePlaylist } from '../../../../components/demos/use-reorderable'
</script>

## 使用方法

`useReorderable` 让列表的行可以调整顺序。在 `setup` 里调用一次，把结果交给 `List` 的 `reorderable`，再给每个 `ListItem` 一个来自数据的 `itemKey`。带键的行末尾就会出现一个拖动手柄。

```ts
import { useReorderable } from '@astryx-vue/core'
```

```vue
<script setup lang="ts">
import { useReorderable } from '@astryx-vue/core'
import { List, ListItem } from '@astryx-vue/core/List'
import { ref } from 'vue'

const items = ref([{ id: 'a', label: '收件箱' }, { id: 'b', label: '已发送' }])

const reorderable = useReorderable<string>({
  onReorder: ({ key, to }) => {
    const moved = items.value.find(item => item.id === key)!
    const next = items.value.filter(item => item.id !== key)
    next.splice(to, 0, moved)
    items.value = next
  },
})
</script>

<template>
  <List :reorderable="reorderable">
    <ListItem v-for="item in items" :key="item.id" :item-key="item.id" :label="item.label" />
  </List>
</template>
```

每完成一次移动，`onReorder` 被调用一次，告诉你被挪的那一行的键，和它挪完以后的位置（下标）。你按新顺序把数据渲染出来就行。如果你不改顺序，行会回到原位。

- **手指**：在手柄上按住不动一小会儿，再拖。在手柄上快速一划还是滚动页面。被拿起的行留在原位、变淡，一份副本跟着手指走，一条强调色的线标出它会落在哪。其他行不动；拖到页面边缘附近会自动滚动；松手后各行滑到新位置。主指针是粗指针（触屏）时，手写笔按住不动也一样。
- **鼠标**：按住手柄移动超过 4 像素就开始拖。各行直接落到新位置，不带动画。拖动被取消时一切立刻复原。
- **键盘和点按**：不拖的话，点一下手柄（或按空格、回车）就进入这一行的重排模式。每按一次方向键，行立刻挪一格；按 Escape 或点「完成」退出，挪过的都保留。手柄下方会出现一个提示条，上面有「上移」「下移」「完成」三个按钮，光靠点按也能排。
- **读屏**：每次挪动落定后，会播报这一行现在排第几、前后是谁。往一个不能动的行挪会被拒绝，也会播报。

`isReorderable` 不允许移动的行没有手柄。位于列表两头的这种行还会框住别的行：谁也不能越过它们落下。

想从你自己的界面进入重排模式（比如行菜单里的「移动」），调用 `reorderable.start(key)`，焦点会移到那一行的手柄上。键对应的行不能动或者没挂载时什么也不做，开发环境下会给警告。

`options` 可以是 ref 或 getter：每次移动都读它的最新值，换一个 `onReorder` 不需要重建对象。在组件外面用 `createReorderable(options)`，它接受同样的普通配置，返回同样的对象。

重排的代码跟着这个函数走：没传 `reorderable` 的列表一点都不加载。

## 建议

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 每一行用数据里稳定的键（字符串或数字，<code>:item-key="item.id"</code>），每次移动都马上应用。 |
| <Badge variant="success">推荐</Badge> | 必须固定的行（比如置顶的第一行）用 <code>isReorderable</code> 排除。 |
| <Badge variant="success">推荐</Badge> | 在你自己的界面里也给一个入口，比如行菜单，用 <code>reorderable.start(item.id)</code> 进入重排模式。 |
| <Badge variant="error">避免</Badge> | 用列表下标当键：挪一行，后面每一行的下标都变了。 |

## 示例

<DemoExample
  :demo="useReorderablePlaylist"
  description="拖动手柄，或者点一下手柄再用方向键。Intro 被固定：它没有手柄，谁也不能挪到它上面。"
  locale="zh"
  title="useReorderable — 播放列表"
/>
