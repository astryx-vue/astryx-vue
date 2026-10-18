---
layout: component-docs
title: useLayer
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useLayerAnchored } from '../../../../components/demos/use-layer'
</script>

## 使用方法

渲染浮层内容的内核：定位、开合、点击外部关闭都在这里。想自己搭 popover、hover card、tooltip 或固定坐标浮层，而现成组件又不够用时，从它开始。

```ts
import { useLayer } from '@astryx-vue/core'
```

`context` 模式跟着锚点元素走；`fixed` 模式放在 `x` / `y` 指定的视口坐标上。开合状态、量出来的坐标、点击外部关闭和浮层 ID 都由它管。它不渲染任何东西：浮层放哪里、长什么样，你自己决定。

```vue
<script setup lang="ts">
import { useLayer } from '@astryx-vue/core'

const layer = useLayer({ mode: 'context', placement: 'below', lightDismiss: true })
</script>

<template>
  <button :ref="layer.anchorRef" type="button" @click="layer.show()">
    Show layer
  </button>
  <Teleport to="body">
    <div
      v-if="layer.isMounted"
      v-show="layer.isOpen"
      :id="layer.id"
      :ref="layer.contentRef"
      :style="layer.contentStyle"
    >
      Anchored layer
    </div>
  </Teleport>
</template>
```

`contentStyle` 里是量出来的 `top` / `left`（fixed 模式还带 `position: fixed`），所以浮层只需要管自己的背景、圆角和阴影。坐标是按视口算的，请把浮层放进 `Teleport` 渲染，这样也顺带躲开了祖先的裁剪和层叠。

## 建议

| 指引 | 做法 |
| --- | --- |
| <Badge variant="success">Do</Badge> | 相对某个触发器定位的浮层用 context 模式；要放在指定坐标上的浮层用 fixed 模式。 |
| <Badge variant="success">Do</Badge> | 常见的浮层形态优先用 `Popover`、`HoverCard`、`Tooltip` 这些更上层的组件。 |
| <Badge variant="success">Do</Badge> | 用 `Teleport` 渲染浮层，躲开祖先的裁剪和层叠；同时保证它落地的地方拿得到需要的主题变量。 |
| <Badge variant="error">Don't</Badge> | 除非整套无障碍行为也由你负责，否则不要在浮层里直接手写 ARIA 模式。 |

## 示例

用 `useLayer` 加自定义表面渲染一个底层锚点浮层。

<DemoExample
  :demo="useLayerAnchored"
  description="用 useLayer 加自定义表面渲染一个底层锚点浮层。"
  locale="zh"
  title="useLayer — Anchored Layer"
/>
