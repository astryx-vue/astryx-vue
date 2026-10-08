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

`IconButton` 是一个只含图标的方形按钮，适合工具栏、列表操作等空间紧凑、含义明确的场景。由于按钮没有可见文字，必须通过 `label` 提供无障碍名称，辅助技术才能识别它的用途：

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

astryx-vue 不自带图标集，图形由你提供：图标插槽可以放任意 CSS 图标类（UnoCSS、Tailwind 或你自己的类名），也可以放你自己的组件。UnoCSS 的图标预设会让图形铺满容器，而按钮已经为这个盒子定好了尺寸，所以这里写一个 `<span class="i-carbon-search" />` 就够了；放到别处时，记得给承载类名的元素一个尺寸。

如果操作的含义无法凭图标一眼看出，请改用带文字的 [Button](/components/button)。




## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 让 `label` 尽量具体：标有 “Delete conversation” 的垃圾桶图标，比只写 “Delete” 更便于屏幕阅读器用户理解按钮的作用。 |
| <Badge variant="success">推荐</Badge> | 为按钮加上提示框。即便是常见的齿轮图标，在不同产品中也可能表示 Settings、Preferences 或 Configure，悬停提示能减少用户的猜测。 |
| <Badge variant="success">推荐</Badge> | 在工具栏和紧凑区域使用 ghost 变体，视觉重量更轻，不会干扰旁边的正文内容。 |
| <Badge variant="error">避免</Badge> | 避免在操作含义不直观时仍然只放图标：用户看不出按钮能做什么，这类操作应改用带文字的 Button。 |
| <Badge variant="error">避免</Badge> | 避免省略提示框：`label` 只供屏幕阅读器使用，普通用户还需要悬停或键盘聚焦时的文字提示。 |

## 示例

<DemoExample
  :demo="iconButtonActionBar"
  description="工具栏中常用一组低强调的纯图标按钮，把常见操作紧凑排开，同时保持界面轻量。"
  locale="zh"
  title="操作栏"
/>

<DemoExample
  :demo="iconButtonFloating"
  description="纯图标按钮最常见的形态就是悬浮操作按钮，配合 elevation=&quot;high&quot; 的阴影，让它从内容上方清晰地浮起。"
  locale="zh"
  title="悬浮操作"
/>

<DemoExample
  :demo="iconButtonAsync"
  description="处理异步操作时，按钮会自动显示加载图标并阻止重复触发，完成后恢复可点击。"
  locale="zh"
  title="异步状态"
/>

<DemoExample
  :demo="iconButtonTooltips"
  description="tooltip 在悬停或键盘聚焦时向用户解释图标的含义，但它是补充说明，不能替代必需的 label。"
  locale="zh"
  title="提示文本"
/>

