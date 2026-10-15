---
layout: component-docs
title: 步骤条
outline: false
footer: false
---

<script setup lang="ts">
import {
  stepperCustom,
  stepperHorizontal,
  stepperIndicators,
  stepperNarrow,
  stepperOnTrack,
  stepperStatus,
} from '../../../../components/demos/stepper'
</script>

## 使用方法

`Stepper` 列出一个流程里的步骤。`activeStep` 是从 0 开始的当前步。它前面的步骤已完成，当前步进行中，后面的还没开始。

步骤可以不按顺序点时，传入 `@step-click`。回调拿到从 0 开始的序号，只有这时步骤才会渲染成按钮。默认的 `separated` 在水平步骤上方画轨道，圆标和标签排在同一行。`indicatorPosition="on-track"` 把圆标嵌进连接线，标签居中放在圆标下面。`indicator` 默认是 `auto`：完成的步骤是勾，当前步是环，后面的步骤是数字。

`horizontalOptions.minimumStepWidth` 默认是 `112`。水平步骤条窄于「112 × 步骤数」时会自动收起，只留当前步，并带 Previous 和 Next。轨道还在。`collapsedVariant` 默认是 `withLabelAndControls`，并跳过禁用的步骤。`withLabel` 不显示这两个按钮，`hiddenLabel` 只留轨道。

```vue
<script setup lang="ts">
import { Step, Stepper } from '@astryx-vue/core/Stepper'
import { ref } from 'vue'

const active = ref(2)
</script>

<template>
  <Stepper
    :active-step="active"
    :horizontal-options="{ minimumStepWidth: 112 }"
    @step-click="active = $event"
  >
    <Step label="Cart" :step="0" />
    <Step label="Shipping" :step="1" />
    <Step label="Payment" :step="2" />
    <Step label="Review" :step="3" />
    <Step label="Confirm" :step="4" />
  </Stepper>
</template>
```



<ComponentAnatomy />

## 示例

<DemoExample :demo="stepperCustom" description="垂直步骤各自占页面的一块。内容可以是表单、摘要或横幅，并且只渲染当前步骤。" locale="zh" title="自定义内容" />

<DemoExample :demo="stepperIndicators" description="none 只靠轨道和标签表示进度。auto 用勾、环或数字。number 始终显示序号。也可以换成自定义图标。" locale="zh" title="指示器模式" />

<DemoExample :demo="stepperHorizontal" description="水平轨道上，指示器嵌进连接线，数字像一串珠子。标签居中放在节点下面。" locale="zh" title="轨道上的水平步骤" />

<DemoExample :demo="stepperOnTrack" description="垂直轨道上，指示器落在连续的连接线上，标签和说明放在节点旁边。" locale="zh" title="轨道上的垂直步骤" />

<DemoExample :demo="stepperStatus" description="校验流程里，成功、错误和强调色只改变指示器。连接线的颜色不受状态影响。" locale="zh" title="校验状态" />

<DemoExample :demo="stepperNarrow" description="宽度 320px 时，四步低于 112px 的最小宽度，收成当前步骤，并带上一步和下一步。" locale="zh" title="窄水平收起" />
