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
import { useLayer, useLayerTeleportTarget } from '@astryx-vue/core'

const layer = useLayer({ mode: 'context', placement: 'below', lightDismiss: true })
// Dialog 打开时浮层挂进 Dialog 里面，其余情况挂到 body。
const teleportTarget = useLayerTeleportTarget()
</script>

<template>
  <button :ref="layer.anchorRef" type="button" @click="layer.show()">
    Show layer
  </button>
  <Teleport :to="teleportTarget">
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

### 关闭：一次只关最上面那一层

所有浮层共用一个关闭栈。按 Escape、或者点在浮层外面，都只关最上面那一层：Dialog 里开一个下拉菜单，第一次 Escape 只关菜单，Dialog 还在；再按一次才关 Dialog。点在菜单外面、Dialog 里面，也只关菜单。

点浮层自己的触发器不算「点外面」，那一下交给触发器自己开关，所以不会出现「先被点外面关掉、又被点击重新打开」的闪一下。输入法拼字过程中按 Escape 是取消拼字，不关浮层。

菜单这类要逐层退栈的浮层，可以用 `useDismiss` 的 `onEscape` 单独处理 Escape，点击外面仍然整层关闭。

### 落在哪里

浮层平时挂在 `body`。Dialog 打开时它是一个原生模态层，挂在外面的浮层会被遮罩挡住、也点不到，所以 Dialog 会提供自己内部的挂载点，浮层优先挂进去。`useLayerTeleportTarget()` 会把这目标算好（没有就是 `'body'`），直接给 `Teleport` 用：

```vue
<Teleport :to="teleportTarget">
```

### 文字样式

浮层离开原来的位置之后，仍然会继承触发器所在位置的排版。给浮层根元素加上 `astryx-layer` 类，字号、字重、行高、对齐、字距、换行这些会回到正文的基准，容器内边距系统的变量也会在这里归零。组件自己的 `Popover`、`Tooltip`、`HoverCard`、`DropdownMenu`、`ContextMenu`、`TabMenu`、`Selector` 已经自动带上这些重置。

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
