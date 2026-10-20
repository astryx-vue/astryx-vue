---
layout: component-docs
title: 可滚动区域
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { scrollableAreaInlineRail, scrollableAreaOverscroll, scrollableAreaStickyHeaders, scrollableAreaStickyPassthrough, scrollableAreaTwoAxis } from '../../../../components/demos/scrollable-area'
</script>

## 使用方法

`ScrollableArea` 是一个原生滚动视口，里面有一块被观察的内容盒。只有请求的轴确实溢出时，它才会进入 Tab 顺序。`label` 必填。

```vue
<script setup lang="ts">
import { ScrollableArea } from '@astryx-vue/core/ScrollableArea'
</script>

<template>
  <ScrollableArea label="笔记" :height="240">
    <p>很长的内容</p>
  </ScrollableArea>
</template>
```

`axis` 取 `block`（默认）、`inline` 或 `both`。组件按书写模式和方向把逻辑轴映射到物理轴。`overscroll` 取 `allow` 或 `contain`。`stickyContainment` 取 `whenScrollable` 或 `always`。内边距写在内容盒上，默认是 0。`isFullBleed` 让视口逃出祖先的内边距，内容的内边距不变。

溢出还没量到时，请求的轴用 `overflow: clip`。量到溢出后，溢出的轴改成 `auto`。`always` 即使内容装得下，也把这个视口留作 sticky 边界。容差是 1px。

视口和内容盒已经存在时，用 `useScrollableArea` 做同样的测量。`useScrollOverflow` 报告一个横向滚动容器的起始边和结束边有没有被挡住。


## 配合 ScrollbarsProvider

外层套了 [`ScrollbarsProvider`](/components/scrollbars-provider) 时，`ScrollableArea` 会自动换成自绘的覆盖式滚动条，不用改任何代码。不套就还是原生滚动条。

某一块想保留原生滚动条，给它写 `:scrollbars="false"`。

<ComponentAnatomy />

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 每块区域都写短标签，说明键盘用户会滚到什么。 |
| <Badge variant="success">推荐</Badge> | 没有特别要求时保持 `overscroll="allow"`。只有嵌套区域需要停住手势时才用 `contain`。 |
| <Badge variant="error">避免</Badge> | 再套一层 overflow 容器。滚动只交给这一个视口。 |
| <Badge variant="error">避免</Badge> | 藏起滚动条，却不提供别的办法到达溢出的内容。 |

## 示例

<DemoExample :demo="scrollableAreaInlineRail" description="axis 为 inline 时卡片横向滚动。isFullBleed 让轨道贴到面板边缘，第一张卡片仍和标题对齐。" locale="zh" title="横向滑轨" />

<DemoExample :demo="scrollableAreaOverscroll" description="overscroll allow 把已经滚到底的手势交给后面的面板。contain 则停在这一节的边缘。" locale="zh" title="过度滚动" />

<DemoExample :demo="scrollableAreaStickyHeaders" description="滚动视口是粘性定位的包含块，分组标签会钉在列表顶部。" locale="zh" title="粘性分组标题" />

<DemoExample :demo="scrollableAreaStickyPassthrough" description="内容放得下的一节会把粘性标签交出去。下一节用 stickyContainment always 把标签留在自己的盒子里。" locale="zh" title="粘性穿透" />

<DemoExample :demo="scrollableAreaTwoAxis" description="axis 为 both 时，内容在行向上按 max-content 排布，一块看板可以同时横竖滚动。" locale="zh" title="双轴看板" />
