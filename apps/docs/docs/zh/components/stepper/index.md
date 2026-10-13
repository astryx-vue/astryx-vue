---
layout: component-docs
title: 步骤条
outline: false
footer: false
---

<script setup lang="ts">
import {
  stepperCheckout,
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

<DemoExample :demo="stepperCheckout" description="从 Cart 到 Confirm。完成的步骤是勾，当前步是环，后面的步骤是数字。" locale="zh" title="步骤条" />

## 示例

<DemoExample :demo="stepperCustom" description="垂直步骤条，每一步占页面的一块。内容插槽只在当前步渲染。" locale="zh" title="自定义内容" />
<DemoExample :demo="stepperNarrow" description="宽度 320px 时，四步都低于 112px 的 minimumStepWidth，收成当前步，并带 Previous 和 Next。" locale="zh" title="窄水平收起" />
<DemoExample :demo="stepperIndicators" description="无指示器、自动、数字和自定义图标。自动模式按进度显示勾、环或数字。" locale="zh" title="指示器模式" />
<DemoExample :demo="stepperHorizontal" description="数字圆标落在同一条线上，标签居中放在圆标下面。" locale="zh" title="轨道上的水平步骤" />
<DemoExample :demo="stepperOnTrack" description="圆标落在垂直轨道上，标签和说明在圆标旁边。" locale="zh" title="轨道上的垂直步骤" />
<DemoExample :demo="stepperStatus" description="成功、错误和强调色只作用在指示器上。背景检查这一步是可选的。" locale="zh" title="校验状态" />
