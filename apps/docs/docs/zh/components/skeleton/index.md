---
layout: component-docs
title: 骨架屏
outline: false
footer: false
---

<script setup lang="ts">
import { skeletonProfile } from '../../../../components/demos/skeleton'
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
import { Skeleton } from '@astryx-vue/core/Skeleton'
</script>

<template>
  <div aria-busy="true" aria-label="正在加载内容" role="status">
    <Skeleton :height="20" :width="200" />
  </div>
</template>
```

## 示例

按照最终内容的尺寸和结构组合占位形状。

<DemoExample
  :demo="skeletonProfile"
  description="让每个占位块贴近最终内容的尺寸与形状，并用 index 依次错开脉冲动画。"
  locale="zh"
  title="内容占位"
/>

