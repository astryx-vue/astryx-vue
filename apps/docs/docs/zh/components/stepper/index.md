---
layout: component-docs
title: 步骤条
outline: false
footer: false
---

<script setup lang="ts">
import {
  stepperCheckout,
  stepperForm,
  stepperHorizontal,
  stepperIndicators,
  stepperOnTrack,
  stepperStatus,
  stepperVertical,
} from '../../../../components/demos/stepper'
</script>

## 使用方法

`Stepper` 列出一个流程里的步骤。`activeStep` 是从 0 开始的当前步。它前面的步骤已完成，当前步进行中，后面的还没开始。

步骤可以不按顺序点时，传入 `@step-click`。回调拿到从 0 开始的序号，只有这时步骤才会渲染成按钮。`indicatorPosition="on-track"` 把标记画在连接线上。`separated` 在水平步骤上方画一条进度条。`hasCollapsibleLabels` 在水平步骤条窄于 480px 时，只留下当前步骤的文字。

```vue
<script setup lang="ts">
import { Step, Stepper } from '@astryx-vue/core/Stepper'
import { ref } from 'vue'

const active = ref(2)
</script>

<template>
  <Stepper :active-step="active" indicator-position="on-track" @step-click="active = $event">
    <Step indicator="number" label="Cart" :step="0" />
    <Step indicator="number" label="Shipping" :step="1" />
    <Step indicator="number" label="Payment" :step="2" />
  </Stepper>
</template>
```

`indicator` 可以是 `auto`、`number` 或 `none`。`auto` 会按进度显示勾、圆环或数字。`status` 只给指示器换色。`icon` 插槽替换指示器里的图形。

## 示例

<DemoExample :demo="stepperCheckout" description="一条水平的结账进度。Cart、Shipping、Payment、Review、Confirm 都带序号，可以点选。" locale="zh" title="结账进度" />
<DemoExample :demo="stepperVertical" description="垂直的引导列表，每一步下面有一行说明。" locale="zh" title="垂直引导" />
<DemoExample :demo="stepperHorizontal" description="从 Workspace 到 Launch，进度条和文字分开。" locale="zh" title="水平进度" />
<DemoExample :demo="stepperIndicators" description="同一组步骤，分别用自动指示器、数字和自定义图标。" locale="zh" title="指示器" />
<DemoExample :demo="stepperForm" description="项目信息、环境和部署。表单放在当前步骤里。" locale="zh" title="多步表单" />
<DemoExample :demo="stepperOnTrack" description="同一份引导列表，指示器落在垂直轨道上。" locale="zh" title="轨道上的垂直步骤" />
<DemoExample :demo="stepperStatus" description="成功、错误和强调色只作用在指示器上。背景检查这一步是可选的。" locale="zh" title="校验状态" />
