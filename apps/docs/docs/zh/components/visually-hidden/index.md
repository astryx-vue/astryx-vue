---
layout: component-docs
title: 视觉隐藏
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
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




## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 用于为纯图标按钮和控件提供屏幕阅读器可播报的无障碍名称。 |
| <Badge variant="success">推荐</Badge> | 以块级元素（as="div"）渲染，并设置 aria-live，用于播报拖放或结果数量等动态更新。 |
| <Badge variant="error">避免</Badge> | 用它对所有人隐藏内容。内容仍保留在无障碍树中。如需完全移除，应使用条件渲染或 hidden。 |
| <Badge variant="error">避免</Badge> | 在其中放置交互控件。内容不可见，也无法接收指针输入。 |

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

