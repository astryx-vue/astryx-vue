---
layout: component-docs
title: useLongPress
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## 使用方法

检测单指按住不放，并告诉你按在哪里，于是触摸用户也能用到「指针靠右键才有」的那些功能。iOS Safari 在长按后根本不会产生 `contextmenu` 事件，所以它是通往「按坐标定位的浮层」（例如 `ContextMenu`）的唯一触摸途径。手指移动、抬起、多指按下，或者组件卸载，都会取消这次按住。

hook 自己不加任何监听。两种绑法：把返回的 `handlers` 摊到元素上（`<div v-on="longPress.handlers">`）；或者自己驱动——`pointerdown` 时调 `start(point)`，`pointermove` 时调 `moveTo(point)`，`pointerup` 和 `pointercancel` 时调 `cancel`。`ContextMenu` 用的是后一种，并且会跳过鼠标指针，让右键走自己的路。

```ts
import { useLongPress } from '@astryx-vue/core'
```

```vue
<script setup lang="ts">
import { useLongPress } from '@astryx-vue/core'
import { ref } from 'vue'

const isDisabled = ref(false)

const longPress = useLongPress({
  disabled: isDisabled,
  onLongPress: (point) => { openMenuAt(point.x, point.y) },
})
</script>

<template>
  <button type="button" v-on="longPress.handlers">
    按住我
  </button>
</template>
```

## 建议

| 指引 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 用报上来的坐标给打开的浮层定位，让它出现在手指下面。 |
| <Badge variant="success">推荐</Badge> | 和指针的 `contextmenu` 处理一起用，而不是替换它；这个 hook 只管触摸。 |
| <Badge variant="error">避免</Badge> | 把按住不放做成控件的主操作；只能靠长按才能做到的事，用户发现不了。 |
