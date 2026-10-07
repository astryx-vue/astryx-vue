---
layout: component-docs
title: 标签
outline: false
footer: false
---

<script setup lang="ts">
import { badgeColors, badgeCounts } from '../../../../components/demos/badge'
</script>


## 使用方法

从独立入口导入组件。组件会加载结构样式。

在应用入口引入主题：

```ts
import '@astryx-vue/themes/neutral.css'
```

组件用法：

```vue
<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

<template>
  <Badge variant="success">
    已完成
  </Badge>
</template>
```

## 示例

常见的标签配置与使用场景。

<DemoExample
  :demo="badgeColors"
  description="使用分类颜色区分类别。分类颜色不表示系统状态。"
  locale="zh"
  title="颜色"
/>

<DemoExample
  :demo="badgeCounts"
  description="标签显示简短计数。数值超过 99 时，可以显示 99+。"
  locale="zh"
  title="计数"
/>

