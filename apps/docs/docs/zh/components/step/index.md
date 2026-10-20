---
layout: component-docs
title: 步骤
outline: false
footer: false
---

<script setup lang="ts">
import { stepContentSlot, stepIndicator, stepStates } from '../../../../components/demos/step'
</script>

## 使用方法

步骤条里的一步。它画出一段进度条、一个指示器，还有带说明的名称。它算完成、进行中还是没开始，全看父级 `Stepper` 的 `activeStep` 和它自己的序号，不用自己设。

`step` 是序号，从 0 开始。默认插槽的内容放在说明下面、可点击的那一行外面，所以里面的表单和按钮还能各自点。`end` 在名称这一行的末尾追加内容，`icon` 换掉内置的指示器图形。

```vue
<script setup lang="ts">
import { Step, Stepper } from '@astryx-vue/core/Stepper'
import { ref } from 'vue'

const active = ref(1)
</script>

<template>
  <Stepper :active-step="active" @step-click="active = $event">
    <Step label="购物车" :step="0" />
    <Step label="配送" :step="1" />
    <Step label="付款" :step="2" />
  </Stepper>
</template>
```

## 示例

常见的用法和不同的状态。

<DemoExample :demo="stepContentSlot" title="内容插槽" description="塞进 Step 的内容画在说明下面，缩进对齐的是名称而不是指示器，并且在可点击的那一行外面，所以里面的按钮仍然是它自己的点击目标。真实流程里，一般用这一步是不是进行中来决定要不要显示内容，垂直步骤条就是这样变成可展开的。" locale="zh" />

<DemoExample :demo="stepIndicator" title="指示器" description="indicator 能接受的全部写法：默认的 auto、一直显示序号、塞一个自定义节点，还有干脆不显示。每一格都放在自己那个已完成的 Step 上，所以唯一的差别就是这一个属性。所有写法都占同样 16px 的方框，所以完成时把数字换成勾，旁边的文字也不会跟着跳。最后一格说明自定义节点可以是活的：进行中的那一步放一个 Spinner，颜色用 inherit，跟别的图形一样蘸上这一步的色调。" locale="zh" />

<DemoExample :demo="stepStates" title="各种状态" description="单独一步能落到的每一种状态，每格是它自己那条步骤条里的一步。完成、当前、未开始都是拿序号和父级的 activeStep 比出来的，不能直接设；isDisabled 和 status 才是这一步自己声明的两个。状态和进度是两条轴，所以已完成的步骤也可以带一个警告。" locale="zh" />
