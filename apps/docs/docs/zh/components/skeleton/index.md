---
layout: component-docs
title: 骨架屏
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { skeletonCard, skeletonList, skeletonTable } from '../../../../components/demos/skeleton'
</script>


## 使用方法

`Skeleton` 在内容尚未加载完成时渲染占位块，按最终内容的尺寸与形状撑起布局，减轻加载完成时的跳动。它适合内容尺寸已知的场景；尺寸未知时建议改用 `Spinner`。

在应用入口引入主题：

```ts
import '@astryx-vue/themes/neutral.css'
```

组件从独立入口导入，结构样式会随组件自动加载：

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
| <Badge variant="success">推荐</Badge> | 让占位块的尺寸和形状贴近最终内容，加载完成后布局才不会发生明显跳动。 |
| <Badge variant="success">推荐</Badge> | 为同一区域内的多个骨架屏依次设置 `index`，脉冲动画会按顺序错开，形成自然的波浪效果。 |
| <Badge variant="error">避免</Badge> | 在内容尺寸未知时使用骨架屏，占位块无法模拟未知布局，这种情况改用 `Spinner` 更合适。 |
| <Badge variant="error">避免</Badge> | 在同一内容区域混用 `Spinner` 和骨架屏，两种加载模式并存会让界面显得不一致，只选其中一种即可。 |
| <Badge variant="error">避免</Badge> | 让骨架屏长时间停留，加载明显偏慢时应改显错误或空状态，让用户知道当前发生了什么。 |

## 示例

<DemoExample
  :demo="skeletonCard"
  description="一张卡片的占位：圆形头像、名字、一行说明，下面再接几行正文。index 让脉冲依次错开。"
  locale="zh"
  title="卡片加载"
/>

<DemoExample
  :demo="skeletonList"
  description="几条宽度不一的横条，用来占住一份列表还没回来时的位置。"
  locale="zh"
  title="错开的列表"
/>

<DemoExample
  :demo="skeletonTable"
  description="每一行四列，列宽按内容长短错开，整表的脉冲也按 index 往后推。"
  locale="zh"
  title="表格行"
/>

