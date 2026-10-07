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

`RadioGroup` 是一组互斥选项的容器。它通过 `provide/inject` 向子 `Radio` 提供名称、选中值和选择方法。

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

<DemoExample :demo="radioBasic" title="基本用法" description="RadioGroup 管理子 Radio 的选中状态。" locale="zh" />

<DemoExample :demo="radioStates" title="禁用选项" description="options 中的选项或 Radio 子项都可以单独禁用。" locale="zh" />

## 键盘与无障碍

- 整个组共享一个 `role="radiogroup"`。
- 使用 `aria-labelledby` 关联组标签。
- 必须提供组 `label`。
- `isRequired` 启用原生必填校验。
- 错误状态设置 `aria-invalid`。

## 使用建议

- 需要自定义选项布局时使用 RadioGroup 配合 Radio 子项。
- 选项结构简单时，使用 [RadioList](/components/radio-list) 更快捷。
