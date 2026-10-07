---
layout: component-docs
title: 开关
outline: false
footer: false
---

<script setup lang="ts">
import { switchBasic, switchSizes, switchStates } from '../../../../components/demos/switch'
</script>

## 使用方法

`Switch` 用于切换单个布尔状态。

```vue
<script setup lang="ts">
import { Switch } from '@astryx-vue/core/Switch'
import { shallowRef } from 'vue'

const enabled = shallowRef(false)
</script>

<template>
  <Switch v-model="enabled" label="Notifications" />
</template>
```

## 示例

<DemoExample :demo="switchBasic" title="基本用法" description="使用 v-model 绑定布尔值。标签和说明通过 Field 自动关联。" locale="zh" />

<DemoExample :demo="switchSizes" title="尺寸" description="提供 sm、md、lg 三种尺寸。" locale="zh" />

<DemoExample :demo="switchStates" title="禁用与只读" description="提供 disabledMessage 时，禁用开关仍可聚焦并查看原因。" locale="zh" />

## 键盘操作

- Tab：聚焦开关。
- Space：切换选中状态。
- Escape：关闭禁用原因提示。

## 使用建议

- 开关用于即时生效的二元选项，不用于表单提交场景。
- `isRequired` 只提供必填提示，不执行校验。
