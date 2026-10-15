---
layout: component-docs
title: 覆盖层
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { overlayBottomStrip, overlayHoverReveal } from '../../../../components/demos/overlay'
</script>

## 使用方法

`Overlay` 把一段内容叠在另一段有边界的内容上面，并用一层遮罩压暗或提亮底层的画面，让叠上去的内容看得清楚。底层可以是一张图片、一段视频、一张卡片，或任何自带边界的区块；叠上去的内容通常只有一个按钮或一行标签。用来做图库里的"快速查看"、视频上的播放按钮、封面图上的标题，都很合适。

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Overlay } from '@astryx-vue/core/Overlay'
</script>

<template>
  <Overlay>
    <img src="/fjord.jpg" alt="Fjord at dusk">
    <template #content>
      <Button label="Quick view" size="sm" variant="secondary" />
    </template>
  </Overlay>
</template>
```

默认插槽是底层内容，`content` 插槽是要叠上去的内容；没有 `content` 插槽时只渲染底层内容，遮罩不会出现。默认遮罩是深色，它同时把遮罩内部的内容切换到"深色表面"这一套语义：文字、图标和按钮都会换成适合深色背景的颜色，所以你不必手写任何白色样式。`scrim="light"` 反过来处理浅色遮罩，`scrim={false}` 不画遮罩，只保留叠放的内容和位置。

遮罩出现的方式有三种。`showOn` 完全由 CSS 驱动：默认的 `always` 一直可见，`hover` 在指针悬停时出现，`focus` 只在容器内有焦点时出现。`isOpen` 由 JavaScript 控制，优先级最高，用 `v-model:isOpen` 绑定：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <Overlay v-model:is-open="isOpen">
    <img src="/fjord.jpg" alt="Fjord at dusk">
    <template #content>
      <Button label="Close" size="sm" variant="secondary" @click="isOpen = false" />
    </template>
  </Overlay>
</template>
```

`hover` 模式下，键盘把焦点移进容器同样会让遮罩出现，所以只用键盘的用户不会漏掉叠上去的按钮；焦点离开时它会收回去。触屏设备没有"悬停"这件事，所以这一模式下改成点一下底层内容打开、再点一下关闭。如果这一下点在容器里本来就有的按钮或链接上，那一下属于那个元素，不会顺带切换遮罩。

`position` 决定遮罩覆盖的范围：`fill` 铺满整块内容，`bottom` 和 `top` 是贴在一条边上的横条，出现和消失时会从那条边滑进滑出。`align` 决定内容在遮罩里的对齐方式，`start` 靠起始边，`end` 靠结束边，`center` 居中。

容器会照抄底层内容的圆角，再按同样圆角把遮罩裁掉，所以遮罩不会盖住圆角。`Overlay` 是贴着内容本身的覆盖层，不是浮在页面上的浮层：需要锚定在元素旁边的浮层用 `Popover`，需要模态对话框用 `Dialog`。

如果容器已经存在，只想给它加上同样的行为，可以直接用 `useOverlay`。它返回要挂在容器上的属性，以及要渲染在容器内部的 `OverlayScrim`：

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { OverlayScrim, useOverlay } from '@astryx-vue/core/Overlay'

const { containerRef, containerProps, scrimProps } = useOverlay({ showOn: 'hover' })
</script>

<template>
  <div ref="containerRef" v-bind="containerProps">
    <img src="/fjord.jpg" alt="Fjord at dusk">
    <OverlayScrim v-bind="scrimProps">
      <Button label="Quick view" size="sm" variant="secondary" />
    </OverlayScrim>
  </div>
</template>
```

容器上要同时挂 `containerProps`（它带来定位、裁剪和点按切换）和 `containerRef`，遮罩要渲染在这个容器内部，悬停和焦点的祖先选择器才找得到它。返回的属性是响应式的：`showOn`、`isOpen` 这些选项传 `ref` 或 `computed` 时，遮罩会跟着变；传普通值时它们只在初始化时读一次。


<ComponentAnatomy />

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 只把属于这块内容自己的动作或标签放进来：快速查看、播放、封面标题。 |
| <Badge variant="success">推荐</Badge> | 叠上去的内容保持精简。遮罩上放得越多，底层的画面越看不清，文字也越难读。 |
| <Badge variant="success">推荐</Badge> | 需要键盘用户也能看到时用 `showOn="hover"`：它同时响应悬停和焦点，而不只是鼠标。 |
| <Badge variant="success">推荐</Badge> | 遮罩的深浅按底层画面选，而不是按页面主题选。深色照片上用深色遮罩，浅色照片上用浅色遮罩。 |
| <Badge variant="error">避免</Badge> | 用它承载需要用户先回答才能继续的内容。那属于 `Dialog`。 |
| <Badge variant="error">避免</Badge> | 在遮罩里塞长文本或多行表单。遮罩的空间是给一行字或一个按钮的。 |
| <Badge variant="error">避免</Badge> | 用它做锚定在元素旁边的浮层。`Popover`、`Tooltip`、`Dialog` 才是那类需求的工具。 |

## 示例

<DemoExample
  :demo="overlayBottomStrip"
  description="底部一条横条放徽章和两行字，图片其余部分仍然看得见。"
  locale="zh"
  title="底部横条"
/>

<DemoExample
  :demo="overlayHoverReveal"
  description="Quick view 按钮在图片被悬停或聚焦之前保持隐藏。"
  locale="zh"
  title="悬停显示"
/>
