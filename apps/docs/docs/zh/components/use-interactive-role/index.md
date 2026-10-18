---
layout: component-docs
title: useInteractiveRole
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## 使用方法

把「这个多态组件到底渲染成什么」收在一处决定：有地址就是链接，没地址但有点击就是按钮，都没有就是一段普通内容。一个组件时而当链接、时而当按钮、时而只是内容的，都该走这里；Token、Thumbnail、Item 都是这么做的。

```ts
import { useInteractiveRole } from '@astryx-vue/core'
```

点击这一项收的是布尔值，不是处理函数本身：Vue 里「函数」和「取值函数」分不开，传 `() => props.onClick` 会被当场调用掉，所以写成 `hasOnClick: () => props.onClick != null`。

上游还会读父级给的「触发上下文」（Popover、DropdownMenu 之类），让组件不用改就自动成为新浮层的合法触发器。这个移植版的浮层不支持用子元素当触发器，没有这份上下文可读，所以判断停在点击这一层。

## 建议

| 指引 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 按返回的角色挑元素，只有 `"link"` 才渲染 `a`，键盘和中键新开标签这些行为就由浏览器负责。 |
| <Badge variant="success">推荐</Badge> | `isDisabled` 原样传进去，不要自己先把 href 丢掉；判断角色时它会自己忽略停用的地址。 |
| <Badge variant="error">不要</Badge> | 在组件里再写一套 href / 点击谁优先的判断；所有组件都该用同一个顺序。 |
