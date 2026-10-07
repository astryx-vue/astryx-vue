---
layout: component-docs
title: 视觉隐藏
outline: false
footer: false
---

<script setup lang="ts">
import { visuallyHiddenContext, visuallyHiddenLiveRegion } from '../../../../components/demos/visually-hidden'
</script>


## 使用方法

从独立入口导入 `VisuallyHidden`。默认插槽为必需项：

```vue
<script setup lang="ts">
import { VisuallyHidden } from '@astryx-vue/core/VisuallyHidden'
</script>

<template>
  <a href="/articles/accessibility">
    了解更多
    <VisuallyHidden>关于无障碍基础组件</VisuallyHidden>
  </a>
</template>
```

## 示例

为辅助技术补充视觉界面没有表达的上下文与动态状态。

<DemoExample
  :demo="visuallyHiddenContext"
  description="在简短链接后补充只供屏幕阅读器读取的上下文，避免链接脱离页面后含义不明。"
  locale="zh"
  title="补充上下文"
/>

<DemoExample
  :demo="visuallyHiddenLiveRegion"
  description="使用块级根元素和 aria-live 播报视觉界面中的动态更新。隐藏内容仍保留在无障碍树中。"
  locale="zh"
  title="实时播报"
/>

