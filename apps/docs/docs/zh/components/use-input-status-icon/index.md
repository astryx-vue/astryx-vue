---
layout: component-docs
title: useInputStatusIcon
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## 使用方法

决定带边框的输入框里那颗状态图标画什么，让同一状态下这一类输入框长得一样。`attached` 只画一个图形，文案留给下面的状态栏；`detached` 这里什么都不画，因为状态栏自己带了图标；`tooltip` 画一个真按钮，键盘、鼠标、触摸、读屏都能摸到它的说明。给带边框的输入框用它，不要拿它做字段级的提示文案。

```ts
import { useInputStatusIcon } from '@astryx-vue/core'
```

`statusIcon` 是组件、`statusIconProps` 是它的属性，所以在输入框容器里写成 `<component :is="statusIcon" v-bind="statusIconProps" />`。

这个移植版里，无障碍那一半由 `Field` 管：它已经把状态文案渲染成视觉隐藏文本、接进输入框的 `aria-describedby`；信息按钮自己也引用着自己的 tooltip。所以这里不再返回 id。

## 建议

| 指引 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 在输入框容器里渲染 `statusIcon`，属性接 `statusIconProps`。 |
| <Badge variant="success">推荐</Badge> | 该不该画交给它判断，`isInGroup` 和 `statusVariant` 原样传进去，不要在调用处自己分支。 |
| <Badge variant="error">不要</Badge> | 只靠图标传达状态；只有 `tooltip` 这一种带文案，其它还得配状态文案。 |
