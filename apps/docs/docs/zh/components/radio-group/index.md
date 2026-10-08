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

`RadioGroup` 把一组互斥的选项组织成一个单选组，辅助技术会把它当成一个整体朗读，而不是若干个互不相关的按钮。下面这些语义和属性都由组件自动处理，你不需要手动声明。

- 整组渲染为一个 `role="radiogroup"` 容器，屏幕阅读器按单选组语义朗读。
- 组标签通过 `aria-labelledby` 与容器关联，所以必须提供组 `label`，它就是整组的无障碍名称。
- 处于错误状态时，组会自动设置 `aria-invalid`。
- 设置 `isRequired` 会显示必填提示，并启用原生必填校验。

键盘方面，组内所有选项共享同一个 `name`，浏览器会把它们当成同一组原生单选按钮：按 `Tab` 键进入这一组时会落在当前选中项上，之后用方向键在选项之间切换。

## 使用建议

下面两条建议用来帮你在 `RadioGroup` 和 [RadioList](/components/radio-list) 之间做选择。两者解决的问题相同——都是在一组互斥的选项里选出一个——区别只在于你对选项布局的控制程度。

- 需要自定义选项布局或渲染时，直接组合 `RadioGroup` 和 `Radio` 子项。
- 选项结构简单、不需要定制布局时，改用 [RadioList](/components/radio-list) 会更省事。
