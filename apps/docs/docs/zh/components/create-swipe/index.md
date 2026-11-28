---
layout: component-docs
title: createSwipe
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { createSwipeMail } from '../../../../components/demos/create-swipe'
</script>

## 使用方法

`createSwipe` 给列表行加上横滑露出的操作，就像手机上邮件行一滑露出「归档」「删除」。把它造出的值传给 `ListItem` 或 `Item` 的 `swipe`。

```ts
import { createSwipe } from '@astryx-vue/core/Swipe'
```

```vue
<script setup lang="ts">
import { List, ListItem } from '@astryx-vue/core/List'
import { createSwipe } from '@astryx-vue/core/Swipe'

const mailSwipe = createSwipe({
  trailing: [
    { id: 'archive', label: '归档', onActivate: ({ itemKey }) => archive(itemKey) },
    { id: 'delete', label: '删除', onActivate: ({ itemKey }) => remove(itemKey), variant: 'destructive', hasRemoval: true },
  ],
})
</script>

<template>
  <List>
    <ListItem v-for="message in messages" :key="message.id" :item-key="message.id" :label="message.subject" :swipe="mailSwipe" />
  </List>
</template>
```

`leading` 是把行往行内末尾拖（从左往右书写时是往右）露出的，`trailing` 是往开头拖露出的。操作按从里到外排，最外侧的写在最后。每个 `onActivate` 收到操作的 `id` 和行的 `itemKey`，所以在模块顶层定义一份就能服务所有行。`createSwipe` 是普通函数，不是组合式函数：它不碰 DOM，放在模块顶层、服务端都安全。处理函数要读组件状态时，把它放进 `computed`。

- **手指、笔或触控板**：行跟着拖动走。松手时动得快就顺着方向走，慢的话过了面板一半就停开。一甩永远不会触发操作。
- **全滑**：拖过确认点，行会往前冲一段，最外侧的操作盖住空出来的地方。这时松手，等行滑出原来的位置就触发它；往回退则合上。一侧有两个及以上操作时，只有从停开的行开始的拖动才会触发。
- **`hasRemoval`**：操作触发后行停在外面，不弹回来，方便应用把它删掉。
- **合上**：点行的内容、在行外按下、滚动或按 Escape，开着的行都会合上。
- **`swipeBehavior: 'commit'`**：不会停开。全滑把行滑出去，触发这一侧唯一的操作；一侧有两个及以上操作时一个都不触发，开发环境下会警告。
- **减少动效**：拖动照样跟手；松手和确认改成淡入淡出，不再滑动。

鼠标拖不动行，所以每个操作都要在行里另有入口，比如 `endContent` 里的按钮。禁用的行、作为行内控件放大点击区的行、角色是 `option` 或菜单项的行都不能横滑。行上的 `swipeActions` 和 `swipeBehavior` 属性还能用，但已弃用。

## 建议

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 在模块顶层定义一份，处理函数里用 <code>itemKey</code> 找到是哪一行。 |
| <Badge variant="success">推荐</Badge> | 每个操作不靠横滑也能用到，比如 <code>endContent</code> 里的按钮或行菜单。 |
| <Badge variant="success">推荐</Badge> | 会删掉这一行的操作加上 <code>hasRemoval</code>，行停在外面等列表把它拿走。 |
| <Badge variant="error">避免</Badge> | 给 <code>commit</code> 的一侧放多个操作：一个都不会触发。 |

## 示例

<DemoExample
  :demo="createSwipeMail"
  description="往右滑标为已读，往左滑露出归档和删除，一滑到底直接删除。每行的按钮让鼠标和键盘也能做同样的事。"
  locale="zh"
  title="createSwipe — 收件箱"
/>
