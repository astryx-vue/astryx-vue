---
layout: component-docs
title: 纯图标按钮
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { iconButtonActionBar, iconButtonFloating, iconButtonLoading, iconButtonTooltips } from '../../../../components/demos/icon-button'
</script>


## 使用方法

`IconButton` 是一个只含图标的方形按钮，适合工具栏、列表操作等空间紧凑、含义明确的场景。由于按钮没有可见文字，必须通过 `label` 提供无障碍名称，辅助技术才能识别它的用途：

```vue
<script setup lang="ts">
import { Icon } from '@astryx-vue/core/Icon'
import { IconButton } from '@astryx-vue/core/IconButton'
</script>

<template>
  <IconButton label="搜索">
    <Icon name="carbon:search" />
  </IconButton>
</template>
```

[Icon](/components/icon) 会铺满按钮已经定好的方框，不要再设 `size`。构建里已经会生成的 CSS 图标类仍然可以放进这个槽，不必为此安装 UnoCSS。

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
  description="一排 ghost 图标按钮，组成紧凑的操作条。"
  locale="zh"
  title="操作条"
/>

<DemoExample
  :demo="iconButtonFloating"
  description="悬浮操作按钮。最常见的悬浮按钮是纯图标。这里用 elevation=&quot;high&quot; 抬起。"
  locale="zh"
  title="悬浮"
/>

<DemoExample
  :demo="iconButtonLoading"
  description="点击后显示加载指示，用来反馈异步操作。"
  locale="zh"
  title="加载状态"
/>

<DemoExample
  :demo="iconButtonTooltips"
  description="图标按钮在悬停时用提示说明每个操作。"
  locale="zh"
  title="带提示"
/>
