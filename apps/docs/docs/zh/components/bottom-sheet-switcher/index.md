---
layout: component-docs
title: 底部弹窗切换器
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { bottomSheetSwitcherReviewFlow } from '../../../../components/demos/bottom-sheet-switcher'
</script>

## 使用方法

`BottomSheetSwitcher` 已废弃。请把每一步写成一张独立的 `BottomSheet`，用 `isOpen` 控制，由一个说明哪一步开着的状态值统一管理；在开着的那步里往下走时，新的一步会用同样的交接动画原地替换它（见[底部弹窗](/components/bottom-sheet)的「替换」一节）。切换器照常能用，到以后某个小版本才会移除。

它管理一串分步的底部弹窗，每一步各用一个原生对话框呈现。用 `v-model:active-sheet` 指向某张 `BottomSheet` 的 `sheet-id` 就打开或切到那一步，指向 `null` 就整段关掉。

```vue
<script setup lang="ts">
import { BottomSheet, BottomSheetSwitcher } from '@astryx-vue/core/BottomSheet'
import { ref } from 'vue'

const activeSheet = ref<string | null>(null)
</script>

<template>
  <button type="button" @click="activeSheet = 'details'">
    开始结账
  </button>
  <BottomSheetSwitcher v-model:active-sheet="activeSheet">
    <BottomSheet sheet-id="details" label="订单信息">
      <p>确认一下订单。</p>
    </BottomSheet>
    <BottomSheet sheet-id="review" label="核对">
      <p>付款前再核对一遍。</p>
    </BottomSheet>
  </BottomSheetSwitcher>
</template>
```

每一张子面板都要有自己的 `sheet-id` 和一个非空的 `label`。每一步对话框的名字优先用切换器自己的 `label`，没写就取那一步的 `label`。只有 `sheet-id` 和 `active-sheet` 对上的那一张可以交互。换步时，新的一步在自己的对话框里从下面升到上一步上面；上一步比它高时，同时往下移到新的一步停下的顶边；两边都走完后，上一步才淡出并关掉。上一步从一开始就不能操作，交接期间由它拿着遮罩，所以切步骤的时候遮罩不会闪一下。`id` 和 `data-testid` 落在当前那步的对话框上。带遮罩的流程在底部面板的叠放里算一层：在它上面打开一张独立面板会叠上去，换步不会改变流程所在的位置。

`purpose` 决定整段流程怎么被关掉，和 `Dialog` 一致。不传就跟着当前那张走：`info` 允许 Escape、点遮罩和下滑，`form` 只允许 Escape，避免把填到一半的内容丢掉，`required` 阻止所有隐式关闭。`hasScrim` 默认是 `true`，整段流程共用一层遮罩：换页时它一直留着，只有整段关掉才消失，这样多步流程看起来才是一块完整的表面，而不是好几个对话框连着弹。

按 Escape 会请求关闭。在此之前先发 `cancel` 事件，参数就是原生的 cancel 事件；在它上面调 `event.preventDefault()` 就能留住这段流程。

流程关闭时，或者切换器在某一步打开着时被移除，原本在里面的焦点会回到流程打开时的那个元素，带不带遮罩都一样。每一步打开时先落到它第一个可用的 `data-autofocus` 字段上，没有就落在这一步的面板上。服务端渲染时就开着的流程在水合后直接呈现静止状态，没有进场动画。

```ts
import { BottomSheet, BottomSheetSwitcher } from '@astryx-vue/core/BottomSheet'
```

<ComponentAnatomy />

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 只在后一步依赖前一步、而且同一时间只需要看一步时使用。 |
| <Badge variant="success">推荐</Badge> | 给每张子面板一个不重复的 `sheet-id` 和非空的 `label`，按关闭要求选好各自的 `purpose`；带遮罩的流程请按 [WAI-ARIA 对话框（模态）模式](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)来做。 |
| <Badge variant="error">避免</Badge> | 把需要互相对照的信息拆到几张面板里。这种情况用整页布局，让相关内容能同时看到。 |
| <Badge variant="error">避免</Badge> | 需要多张面板同时可交互或同时可见时使用切换器。`active-sheet` 本来就是只让一步可交互。 |

## 示例

常见的用法和不同的状态。

<DemoExample :demo="bottomSheetSwitcherReviewFlow" title="核对流程" description="两步的表单流程：先核对设置，再确认保存，也可以退回上一步，全程不换对话框。" locale="zh" />
