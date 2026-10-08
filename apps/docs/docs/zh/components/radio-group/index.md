---
layout: component-docs
title: 单选组
outline: false
footer: false
---

<script setup lang="ts">
import { radioBasic, radioStates } from '../../../../components/demos/radio'
</script>

## 使用方法

`RadioGroup` 是单选场景的容器组件，用来包裹一组互斥的 `Radio` 选项。它通过 `provide/inject` 把共享的 name、当前选中值和选择方法下发给每个子项，子项只需声明自己的 `value` 和 `label`：

```vue
<script setup lang="ts">
import { Radio, RadioGroup } from '@astryx-vue/core/Radio'
import { shallowRef } from 'vue'

const size = shallowRef('md')
</script>

<template>
  <RadioGroup v-model="size" label="Size">
    <Radio value="sm" label="Small" />
    <Radio value="md" label="Medium" />
    <Radio value="lg" label="Large" />
  </RadioGroup>
</template>
```

## 示例

<DemoExample :demo="radioBasic" title="基本用法" description="RadioGroup 统一持有当前选中值：点击任一选项，v-model 即随之更新，无需在子项上逐个绑定。" locale="zh" />

<DemoExample :demo="radioStates" title="禁用选项" description="无论是通过 options 传入的选项，还是直接书写的 Radio 子项，都可以单独禁用，互不影响。" locale="zh" />

## 键盘与无障碍

- 整组渲染为一个 `role="radiogroup"` 容器，屏幕阅读器按单选组语义朗读。
- 组标签通过 `aria-labelledby` 与容器关联。
- 必须提供组 `label`，它是整组的无障碍名称。
- 设置 `isRequired` 会显示必填提示，并启用原生必填校验。
- 处于错误状态时，组会自动设置 `aria-invalid`。

## 使用建议

- 需要自定义选项布局或渲染时，使用 RadioGroup 直接组合 Radio 子项。
- 选项结构简单、无需定制布局时，改用 [RadioList](/components/radio-list) 会更省事。
