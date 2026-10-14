---
layout: component-docs
title: 单选按钮
outline: false
footer: false
---

<script setup lang="ts">
import { radioBasic, radioStates } from '../../../../components/demos/radio'
</script>

## 使用方法

`Radio` 表示一组互斥选项中的单个选项，需要配合 `RadioGroup` 使用：选中状态由 RadioGroup 通过 `provide/inject` 统一管理，单个 Radio 只需声明自己的值和标签。最基本的用法如下：

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

<DemoExample :demo="radioBasic" title="基本用法" description="把 Radio 作为子项放进 RadioGroup，再用 v-model 绑定当前选中的值，选中状态即由组统一管理。" locale="zh" />


<DemoExample :demo="radioStates" title="禁用选项" description="给单个选项设置 isDisabled 即可将其禁用，组内其他选项不受影响，仍可正常选择。" locale="zh" />

## 键盘操作

焦点进入单选组之后，组内的选项沿用浏览器原生单选按钮的键盘行为，无需额外的按键约定：

- Tab：聚焦单选组，焦点落在当前选中的选项上。整组在 Tab 顺序中只占一个停留点。
- 方向键：在组内移动当前选中的选项。
- Space：选中当前聚焦的选项。

## 使用建议

单选组适合让用户在少量互斥的选项之间做出一次选择。选项变多之后，这种形式就不再合适。

- 选项数量较少、彼此互斥时，使用单选组让用户一眼看清全部可选项。
- 选项超过 7 个左右时，改用下拉选择更省空间，也更便于扫读。

无论选项多少，都要提供组标签 `label`：它是整组单选按钮的无障碍名称，屏幕阅读器依赖它朗读。
