---
layout: component-docs
title: useInputContainer
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## 使用方法

让输入框外面那一圈也能点：点在图标、内边距、状态图标这些没有交互的地方时，把焦点交给里面的输入框或文本域。底座是 `useClickableContainer`，所以清空按钮、日历开关、链接这些嵌套的控件点上去还是它们自己的事，不会把焦点从输入框抢走。输入类型会自己判断：文本类的输入框收 `.focus()`，复选框、单选框、文件这类收 `.click()`。

```ts
import { useInputContainer } from '@astryx-vue/core'
```

外层的包装元素和里面的输入框各挂一个 `ref`，再把 `onClick` 挂到包装元素的 `@click`、`onMouseUp` 挂到 `@mouseup`。第一次点击时这个函数会给包装元素加上 `data-pressable-container`，嵌套的可点容器因此不会抢同一次点击。


## 建议

| 指引 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 用在把输入框包起来的组件里（TextInput、NumberInput、TimeInput、TextArea），让整块容器都能点。 |
| <Badge variant="success">推荐</Badge> | `onClick` 和 `onMouseUp` 都挂到外层那个元素上，交互才完整。 |
| <Badge variant="error">不要</Badge> | 用在没有外层包装的裸输入框上；输入框本来就铺满可点区域，套上去没有好处。 |
