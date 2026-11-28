---
title: PageControl
---

# PageControl

放在翻页视图下面的一排小圆点，照着 iOS 的 UIPageControl 做：一页一个点，当前页的点最亮。点按当前点的左边或右边，往那边翻一页；手指在点上滑，或者鼠标在点上拖，直接翻到指针下面那一页。

用手指操作时（iOS 和 Android 一样），超过十页的长排变成一个固定宽度的「窗口」，边上的点缩小，提示两边还有；按住不动时点的后面会垫上一块浅色的垫片。用鼠标时长排直接按控件宽度裁掉，拖动时这排不动，松手才挪到当前点。

<script setup lang="ts">
import { labPageControl } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labPageControl" description="上面五页，点按左右或在点上拖动换页；下面 50 页，在手机上能看到窗口和缩小的边缘点。" locale="zh" title="翻页指示" /></ClientOnly>

## 导入

```ts
import { PageControl } from '@astryx-vue/lab'
```

## 用法

页码由你保管，用 `v-model:page` 绑定，从 1 数起。翻页视图和 PageControl 要两头同步：视图滑动时改 `page`，PageControl 要页时也让视图翻过去。

```vue
<script setup lang="ts">
const page = ref(1)
</script>

<template>
  <PageControl v-model:page="page" :total-pages="5" />
</template>
```

拖动时每经过一个点就要一次页，快速扫过可能跳过中间的页。

## 动效

| 动作 | 效果 |
| --- | --- |
| 手指下换页 | 旧的当前点按 250ms 淡出（曲线 `cubic-bezier(0, 0, 0.58, 1)`）；点按要的页淡得更快，125ms。其余的不透明度变化直接切换。 |
| 手指按住 155ms | 点后面出现垫片，其余的点变暗；松手后收起。 |
| 当前页走进窗口边缘 | 窗口等 50ms 后滑一格，用 UIKit 的临界阻尼弹簧（响应 0.15s），不过冲；点同时换成新尺寸。 |
| 手指拖过内容边缘 | 页码自己往前走，越过得越远走得越快（速率是越过距离 × 0.173 页每秒）。 |
| 鼠标 | 没有垫片和淡出，长排在松手时直接挪到当前点。 |
| 减少动态效果 | 当前点立刻换；按住的样子立刻出现，松手时按 200ms 淡出；窗口改为交叉淡化，点在淡化的中点换成新尺寸。 |

这些时长和弹簧照抄 iOS 26 实测值，不跟主题的动效变量走。

## 属性

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `totalPages` | `number` | 必填 | 页数。 |
| `page` | `number` | 必填 | 当前页，从 1 数起。配合 `v-model:page` 使用。 |
| `label` | `string` | `undefined` | 控件的无障碍名称。不给时按读屏语言叫「页码指示」。 |
| `hidesForSinglePage` | `boolean` | `false` | 只有一页时什么都不渲染。 |

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `update:page` | `(page: number)` | 点按、点击、拖动、方向键、Home、End 或辅助技术要翻到的页，从 1 数起。 |
| `change` | `(page: number)` | 和 `update:page` 同时触发。 |

控件是一个横向的滑块（`role="slider"`），读作「第 3 页，共 5 页」。方向键前后翻一页，Home、End 跳到第一页和最后一页。

## 使用建议

- 配合能左右滑动翻页的视图用，比如开屏引导页：它主要用来看「在第几页」，翻页只是顺带。
- 页数少到一眼能数清最好；超过十页时，手指下这排保持固定宽度，只显示一段，随着翻页滚动。
- 不要用它给长长的结果列表分页（用 `Pagination`），也不要用它切换视图（用 `SegmentedControl` 或 `TabList`）。
