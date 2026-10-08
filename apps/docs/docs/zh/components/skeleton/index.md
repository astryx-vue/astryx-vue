---
layout: component-docs
title: 骨架屏
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
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




## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 骨架屏的尺寸和形状要与加载内容一致，形成逼真的占位效果。 |
| <Badge variant="success">推荐</Badge> | 为多个骨架屏设置 index 属性，形成自然的波浪动画。 |
| <Badge variant="error">不要</Badge> | 内容尺寸未知时使用骨架屏。应改用 Spinner。 |
| <Badge variant="error">不要</Badge> | 在同一内容区域同时使用 Spinner 和骨架屏。应只选一种加载模式。 |
| <Badge variant="error">不要</Badge> | 长时间显示骨架屏。加载时间过长时，应显示错误或空状态。 |

## 示例

按照最终内容的尺寸和结构组合占位形状。

<DemoExample
  :demo="skeletonProfile"
  description="让每个占位块贴近最终内容的尺寸与形状，并用 index 依次错开脉冲动画。"
  locale="zh"
  title="内容占位"
/>

