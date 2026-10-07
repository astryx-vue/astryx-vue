---
layout: component-docs
title: 堆叠布局
outline: false
footer: false
---

<script setup lang="ts">
import { stackDirections, stackHStack, stackItem, stackVStack } from '../../../../components/demos/stack'
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
import { HStack, Stack, StackItem, VStack } from '@astryx-vue/core/Stack'
</script>
```

## 示例

常见的方向与空间分配配置。

<DemoExample
  :demo="stackDirections"
  description="direction 为 horizontal 时子元素从左到右排列。为 vertical 时从上到下排列。Stack 默认使用 vertical。"
  locale="zh"
  title="Stack — 方向"
/>

<DemoExample
  :demo="stackHStack"
  description="HStack 固定使用水平方向，相当于 direction 为 horizontal 的 Stack。"
  locale="zh"
  title="HStack — 基础"
/>

<DemoExample
  :demo="stackVStack"
  description="VStack 固定使用垂直方向，相当于 direction 为 vertical 的 Stack。"
  locale="zh"
  title="VStack — 基础"
/>

<DemoExample
  :demo="stackItem"
  description="StackItem 默认为 static。设为 fill 时占据堆叠容器中的剩余空间。"
  locale="zh"
  title="StackItem — 尺寸"
/>

