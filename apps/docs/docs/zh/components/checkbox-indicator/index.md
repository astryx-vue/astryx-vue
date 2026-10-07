---
layout: component-docs
title: 复选指示器
outline: false
footer: false
---

<script setup lang="ts">
import { checkboxIndicatorStates } from '../../../../components/demos/checkbox-indicator'
</script>

## 使用方法

`CheckboxIndicator` 显示未选、选中或半选标记。
组件只提供装饰图形。组件没有输入、焦点或表单行为。

```vue
<script setup lang="ts">
import { CheckboxIndicator } from '@astryx-vue/core/CheckboxIndicator'
</script>

<template>
  <CheckboxIndicator state="indeterminate" size="sm" />
</template>
```

在应用入口引入主题：

```ts
import '@astryx-vue/themes/neutral.css'
```

<DemoExample :demo="checkboxIndicatorStates" title="状态与尺寸" description="sm 为 20px。md 为 24px。禁用状态降低不透明度。" locale="zh" />

需要用户操作时，使用 [CheckboxInput](/components/checkbox-input).
