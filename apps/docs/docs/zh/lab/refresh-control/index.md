---
title: useRefreshControl
---

# useRefreshControl

给 app 自己的滚动容器加下拉刷新，照着 iOS 的 UIRefreshControl 做：内容到顶后再往下拉，露出上面的指示器；拉过触发点，手指还按着就开始刷新；松手后内容停在指示器下面，刷新结束再滑回顶部。

手指能拉，触控板在顶部的双指滚动也能拉。鼠标或笔的拖动留给浏览器选文字，鼠标滚轮的一格格也不会拉。

<script setup lang="ts">
import { labRefreshControl } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labRefreshControl" description="在手机上把列表拉过顶部，或在触控板上双指往下滚；按钮也能刷新。" locale="zh" title="下拉刷新" /></ClientOnly>

## 导入

```ts
import { REFRESH_REVEAL_VAR, useRefreshControl } from '@astryx-vue/lab'
```

## 用法

滚动容器、被拉的内容和指示器都由你来写，hook 只负责让它们动起来：

- `contentRef` 绑到包住滚动内容的元素上，被拉动的就是它。它要放在一个能上下滚动、内容装不下的容器里；页面本身的顶部永远留给浏览器。
- `indicatorRef` 绑到指示器上，比如一个 `Spinner`。指示器是一条 60px 高的带子，放在一个骑在内容上沿、裁掉溢出的盒子底部。hook 会让它逆着内容移动，所以它一直钉在滚动容器顶部。
- 下拉露出指示器多少（0 到 1）写在 `REFRESH_REVEAL_VAR` 这个 CSS 变量上，指示器可以拿它当不透明度。

```vue
<script setup lang="ts">
const pull = useRefreshControl({
  onRefresh: () => fetchInbox(),
  announce: '正在刷新',
})
</script>

<template>
  <div style="height: 100%; overflow-y: auto">
    <div :ref="pull.contentRef" style="position: relative" :aria-busy="pull.isRefreshing.value || undefined">
      <InboxList />
      <div style="position: absolute; inset-inline: 0; bottom: 100%; height: 100lvh; overflow: hidden; pointer-events: none">
        <div :ref="pull.indicatorRef" aria-hidden="true" style="position: absolute; inset-inline: 0; bottom: 0; height: 60px; display: flex; align-items: center; justify-content: center">
          <span :style="{ opacity: `var(${REFRESH_REVEAL_VAR}, 0)` }">
            <Spinner size="lg" shade="subtle" label="正在刷新" />
          </span>
        </div>
      </div>
    </div>
  </div>
  <Button label="刷新" @click="pull.refresh()" />
</template>
```

`onRefresh` 返回 Promise 时，刷新一直持续到它落定（失败也算结束）。想自己管刷新状态，就传 `isRefreshing`：`true` 开始，`false` 结束，这时 hook 不会为它调 `onRefresh`；拉出来的刷新如果父组件不接手，下一次更新时就结束。

下拉没有键盘或读屏的等价操作，所以一定要另给一个刷新办法，比如调 `refresh()` 的按钮。

## 动效

| 动作 | 效果 |
| --- | --- |
| 往下拉 | 先走 10px 的门槛，然后内容一比一跟着手指，直到 60px；再往下越拉越费劲。 |
| 拉过触发点 | 触发距离是滚动容器高度的 0.198 倍，最少 73px。手指还按着就开始刷新，之后内容又一比一跟手，直到越过顶部 120px。 |
| 指示器 | 露出程度按曲线 `cubic-bezier(0.42, 0, 0.58, 1)` 从 0 走到 1，正好在触发点露全。 |
| 松手 | 内容带着手指抬起时的速度，用临界阻尼弹簧（0.5s，不过冲）落到 60px 的内边距上，或者落回顶部；落回顶部时指示器沿着同一条曲线淡掉。 |
| 刷新结束 | 内容按主题的 `--astryx-duration-medium`（默认 300ms）滑回顶部，曲线是 UIKit 默认的 easeInEaseOut。没有这个变量时直接回到顶部。 |
| 手指接住回落 | 回落停在当时的位置，指示器留着当时显示的样子，接着拉或者接着落。 |
| 减少动态效果 | 手指松手的回落改为交叉淡化；指示器不淡出，等内容落定后再复位。 |

这些距离、曲线和弹簧照抄 iOS 26 实测值；只有结束的时长跟主题走。

## 参数

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `onRefresh` | `() => unknown` | 下拉触发或调 `refresh()` 时调用。返回 Promise 时（不受控）刷新持续到它落定。 |
| `isRefreshing` | `MaybeRefOrGetter<boolean \| undefined>` | 受控的刷新状态。不给时由 `onRefresh` 的 Promise 决定。 |
| `isDisabled` | `MaybeRefOrGetter<boolean \| undefined>` | 关掉下拉。进行中的刷新照常继续。 |
| `announce` | `MaybeRefOrGetter<string \| undefined>` | 刷新开始时礼貌播报的话，用 app 自己的语言。不给就不播。 |

| 返回值 | 类型 | 说明 |
| --- | --- | --- |
| `contentRef` | `(element: unknown) => void` | 绑到被拉的内容上。 |
| `indicatorRef` | `(element: unknown) => void` | 绑到指示器上。 |
| `isRefreshing` | `Readonly<Ref<boolean>>` | 是否正在刷新。 |
| `refresh` | `() => void` | 不用下拉开始一次刷新：内边距直接出现，容器跟着滚，看不出移动。 |

## 使用建议

- 用在按时间排的列表上，比如收件箱、动态流：往下拉就是「看看有没有新的」。
- 滚动容器要能滚：内容装得下的容器不会下拉，把滚动交给外层。
- 刷新时给内容加 `aria-busy`，读屏能知道内容在更新。
