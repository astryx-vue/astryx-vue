---
layout: component-docs
title: 视觉隐藏
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { visuallyHiddenContext, visuallyHiddenLiveRegion, visuallyHiddenStructural } from '../../../../components/demos/visually-hidden'
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

<DemoExample
  :demo="visuallyHiddenLiveRegion"
  description="任务被移到下一列时，aria-live 把新位置读出来。看见箭头的人不用听这段话。"
  locale="zh"
  title="实时播报"
/>

<DemoExample
  :demo="visuallyHiddenStructural"
  description="这一组在视觉上已经成块，但没有可见标题。隐藏的 h2 让屏幕阅读器能跳到这里。"
  locale="zh"
  title="结构标题"
/>

<DemoExample
  :demo="visuallyHiddenContext"
  description="箭头只是装饰。涨了还是跌了，写在 VisuallyHidden 里给屏幕阅读器。"
  locale="zh"
  title="补充上下文"
/>

