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

把一串分步的底部弹窗放进同一个对话框里。用 `v-model:active-sheet` 指向某张 `BottomSheet` 的 `sheet-id` 就打开或切到那一步，指向 `null` 就整段关掉。

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

每一张子面板都要有自己的 `sheet-id` 和一个非空的 `label`。对话框的名字优先用切换器自己的 `label`，没写就取当前那张的 `label`，所以整段流程从头到尾只有一个无障碍名称。只有 `sheet-id` 和 `active-sheet` 对上的那一张可以交互；换页时上一张还留在底下，但已经不可交互，等新的一张落定之后才撤掉，所以切步骤的时候遮罩不会闪一下。

`purpose` 决定整段流程怎么被关掉，和 `Dialog` 一致。不传就跟着当前那张走：`info` 允许 Escape、点遮罩和下滑，`form` 只允许 Escape，免得把填到一半的内容丢掉，`required` 堵住所有隐式关闭。`hasScrim` 默认是 `true`，整段流程共用一层遮罩：换页时它一直留着，只有整段关掉才消失，这样多步流程看起来才是一块完整的表面，而不是好几个对话框连着弹。

按 Escape 会请求关闭。在此之前先发 `cancel` 事件，参数就是原生的 cancel 事件；在它上面调 `event.preventDefault()` 就能留住这段流程。

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
