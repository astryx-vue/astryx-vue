---
layout: component-docs
title: 纯图标按钮
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
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




## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 让 aria-label 足够具体。标有 “Delete conversation” 的垃圾桶图标，比只写 “Delete” 更便于屏幕阅读器用户理解。 |
| <Badge variant="success">推荐</Badge> | 添加提示框。即使是齿轮图标，也可能表示 Settings、Preferences 或 Configure。 |
| <Badge variant="success">推荐</Badge> | 在工具栏和紧凑区域使用 ghost 变体，减少视觉干扰。 |
| <Badge variant="error">不要</Badge> | 操作无法仅凭图标看出时，使用 IconButton。应改用带文字的 Button。 |
| <Badge variant="error">不要</Badge> | 省略提示框。标签只供屏幕阅读器使用，明眼用户还需要悬停提示。 |

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

