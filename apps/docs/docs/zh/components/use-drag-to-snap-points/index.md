---
layout: component-docs
title: useDragToSnapPoints
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useDragToSnapPointsDrawer } from '../../../../components/demos/use-drag-to-snap-points'
</script>

## 使用方法

`useDragToSnapPoints` 让一个元素能沿一条轴被拖动，手指抬起时停到某个吸附点上，就像 iOS 的面板停在它的几个档位上：

- 慢慢松手：停到离当前位置最近的吸附点。
- 快速一甩：停到甩的方向上的下一个吸附点。
- 手指正往回走时松手：回到起手时的那个点。

收尾的动画接着松手时的速度走，所以动作是连贯的。

```ts
import { useDragToSnapPoints } from '@astryx-vue/core'
```

```vue
<script setup lang="ts">
import { useDragToSnapPoints } from '@astryx-vue/core'
import { ref, useTemplateRef } from 'vue'

const drawer = useTemplateRef<HTMLElement>('drawer')
const settled = ref(0)

const { settleTo } = useDragToSnapPoints(drawer, {
  axis: 'y',
  snapPoints: [0, 240, 480],
  onSettle: (index) => {
    settled.value = index
  },
})
</script>

<template>
  <div ref="drawer">
    抽屉
  </div>
  <button type="button" @click="settleTo(0)">
    展开
  </button>
</template>
```

`snapPoints` 是沿 `axis` 离元素静止位置的像素偏移，比如 `[0, 240, 480]`，用之前会先排序（`onSettle` 和 `settleTo` 的下标按排序后的顺序数）。它们不是视口高度的比例，这一点和 BottomSheet 的 `snapPoints` 不同。空列表时拖动什么也不做，开发环境下会给出警告。

`onSettle` 在元素停稳到某个吸附点后调用，参数是这个点的下标，每次用到时现读。`settleTo(index)` 不用拖动就把元素停到第 `index` 个点上，是给键盘和按钮用的那条路。

`axis`、`snapPoints`、`flickThreshold` 变了时，拖动会重新创建，除此之外什么也不做：元素留在原地（正在收尾的动画也就地停住），下一次拖动或 `settleTo` 从那里开始。内容相同的新数组不算变化。组合式函数跟着 ref 当前指向的元素走，卸载时移除所有监听，之后不再报告。服务端渲染时不碰 DOM。

不在组件里时（比如普通脚本），用 `createDragToSnapPoints(element, options)`。它接受同样的选项，返回 `{ settleTo, destroy }`；`destroy` 移除所有监听，让元素停在原地。

```ts
import { createDragToSnapPoints } from '@astryx-vue/core'

const drag = createDragToSnapPoints(element, { axis: 'x', snapPoints: [0, 320], onSettle: index => console.log(index) })
drag.settleTo(1)
drag.destroy()
```

系统开启「减弱动态效果」时，触摸拖动后的收尾变成一段很短的淡入，落到吸附点；主指针是粗指针（比如平板）时，任何收尾都这样。其他情况下鼠标或触控笔拖完直接落到终点。`settleTo` 在粗指针设备上淡入，细指针设备上直接落到终点。手指按着的时候，元素照常跟手。

做底部面板请用 BottomSheet 的 `snapPoints`，做横向分页请用 Carousel 的 `hasSnap`。

## 建议

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 不拖也能到达同样的位置：用按钮或按键调用 `settleTo`。 |
| <Badge variant="success">推荐</Badge> | 用 `onSettle` 把停住的下标存进状态，再根据它渲染这个位置代表的内容。 |
| <Badge variant="success">推荐</Badge> | 位置改变了元素显示的内容时，向读屏用户播报这个变化。 |
| <Badge variant="error">避免</Badge> | 用它重做面板或轮播：它们自己的属性已经按大家熟悉的方式吸附了。 |

## 示例

<DemoExample
  :demo="useDragToSnapPointsDrawer"
  description="上下拖动面板，松手后停在展开、半开或露头三档之一；快速一甩会跳到甩的方向上的下一档。按钮不用拖动也能切换档位。"
  locale="zh"
  title="useDragToSnapPoints — 三档面板"
/>
