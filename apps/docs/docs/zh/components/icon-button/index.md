---
layout: component-docs
title: 纯图标按钮
outline: false
footer: false
---

<script setup lang="ts">
import { iconButtonActionBar, iconButtonAsync, iconButtonFloating, iconButtonTooltips } from '../../../../components/demos/icon-button'
</script>


## 使用方法

`IconButton` 只显示图标。图标必须清楚表达操作用途。必须用 `label` 提供无障碍名称：

```vue
<script setup lang="ts">
import { IconButton } from '@astryx-vue/core/IconButton'
</script>

<template>
  <IconButton label="搜索">
    <span class="i-carbon-search" />
  </IconButton>
</template>
```

图标无法说明操作用途时，使用带文字的 [Button](/components/button)。

## 示例

<DemoExample
  :demo="iconButtonActionBar"
  description="在工具栏中使用低强调的纯图标按钮，让常见操作紧凑排列。"
  locale="zh"
  title="操作栏"
/>

<DemoExample
  :demo="iconButtonFloating"
  description="纯图标按钮是常见的悬浮操作形态。用 elevation=&quot;high&quot; 让它从内容上方明确浮起。"
  locale="zh"
  title="悬浮操作"
/>

<DemoExample
  :demo="iconButtonAsync"
  description="异步操作期间会显示加载图标并阻止重复触发。完成后可以再次操作。"
  locale="zh"
  title="异步状态"
/>

<DemoExample
  :demo="iconButtonTooltips"
  description="tooltip 为看得见界面的用户解释图标含义，但不能代替必需的 label。"
  locale="zh"
  title="提示文本"
/>

