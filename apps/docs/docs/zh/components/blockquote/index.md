---
layout: component-docs
title: 引用
outline: false
footer: false
---

<script setup lang="ts">
import { blockquoteCite } from '../../../../components/demos/blockquote'
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
import { Blockquote } from '@astryx-vue/core/Blockquote'
</script>

<template>
  <Blockquote cite="Steve Jobs">
    设计不仅关乎外观与感受，更关乎如何运作。
  </Blockquote>
</template>
```

## 示例

常见的引用与出处配置。

<DemoExample
  :demo="blockquoteCite"
  description="引用可以单独使用。来源已知时，通过 cite 标明作者或出处。"
  locale="zh"
  title="带出处的引用"
/>

